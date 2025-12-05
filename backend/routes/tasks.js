const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Task = require('../models/task');
const Project = require('../models/project');
const Activity = require('../models/activity');

// @route   GET /api/tasks
// @desc    Get all tasks
// @access  Public (for demo)
router.get('/', async (req, res) => {
    try {
        const { status, priority, project, assignee, sort, limit } = req.query;
        
        let query = {};
        
        // Build query based on filters
        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (project) query.project = project;
        if (assignee) query.assignee = assignee;
        
        // Sort options
        let sortOption = { dueDate: 1 };
        if (sort === 'priority') sortOption = { priority: -1 };
        if (sort === 'created') sortOption = { createdAt: -1 };
        
        const tasks = await Task.find(query)
            .populate('project', 'name category')
            .populate('assignee', 'firstName lastName avatar')
            .populate('reporter', 'firstName lastName avatar')
            .sort(sortOption)
            .limit(parseInt(limit) || 100);

        res.json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('project', 'name category status')
            .populate('assignee', 'firstName lastName email avatar')
            .populate('reporter', 'firstName lastName email avatar')
            .populate('comments.user', 'firstName lastName avatar');

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.json({
            success: true,
            data: task
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/tasks
// @desc    Create new task
// @access  Private
router.post('/', [
    check('title', 'Task title is required').not().isEmpty(),
    check('project', 'Project is required').not().isEmpty(),
    check('dueDate', 'Due date is required').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Check if project exists
        const project = await Project.findById(req.body.project);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Create task
        const taskData = {
            ...req.body,
            reporter: 'demo_user_id' // For demo
        };

        const task = await Task.create(taskData);

        // Update project progress
        const tasks = await Task.find({ project: project._id });
        const completedTasks = tasks.filter(t => t.status === 'completed').length;
        const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
        
        await Project.findByIdAndUpdate(project._id, { progress });

        // Create activity
        await Activity.create({
            type: 'task',
            action: 'created',
            title: task.title,
            description: `Added to ${project.name}`,
            user: 'demo_user_id',
            project: project._id,
            task: task._id
        });

        res.status(201).json({
            success: true,
            data: task
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Check if status changed to completed
        const wasCompleted = task.status === 'completed';
        const willBeCompleted = req.body.status === 'completed';

        // Update task
        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        // Update completedAt if status changed to completed
        if (!wasCompleted && willBeCompleted) {
            task.completedAt = new Date();
            await task.save();
        }

        // Update project progress
        const project = await Project.findById(task.project);
        if (project) {
            const tasks = await Task.find({ project: project._id });
            const completedTasks = tasks.filter(t => t.status === 'completed').length;
            const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
            
            await Project.findByIdAndUpdate(project._id, { progress });
        }

        res.json({
            success: true,
            data: task
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Get project before deleting
        const projectId = task.project;

        await task.deleteOne();

        // Update project progress
        if (projectId) {
            const project = await Project.findById(projectId);
            if (project) {
                const tasks = await Task.find({ project: projectId });
                const completedTasks = tasks.filter(t => t.status === 'completed').length;
                const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
                
                await Project.findByIdAndUpdate(projectId, { progress });
            }
        }

        res.json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/tasks/stats/overview
// @desc    Get tasks overview statistics
// @access  Public
router.get('/stats/overview', async (req, res) => {
    try {
        const tasks = await Task.find();
        
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === 'completed').length;
        const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
        const todoTasks = tasks.filter(t => t.status === 'todo').length;
        
        const highPriority = tasks.filter(t => t.priority === 'high' || t.priority === 'urgent').length;
        const mediumPriority = tasks.filter(t => t.priority === 'medium').length;
        const lowPriority = tasks.filter(t => t.priority === 'low').length;
        
        const overdueTasks = tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length;
        
        const today = new Date();
        const weekLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        const upcomingTasks = tasks.filter(t => 
            new Date(t.dueDate) >= today && 
            new Date(t.dueDate) <= weekLater && 
            t.status !== 'completed'
        ).length;

        res.json({
            success: true,
            data: {
                totalTasks,
                completedTasks,
                inProgressTasks,
                todoTasks,
                priorities: {
                    high: highPriority,
                    medium: mediumPriority,
                    low: lowPriority
                },
                overdueTasks,
                upcomingTasks
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/tasks/:id/comments
// @desc    Add comment to task
// @access  Private
router.post('/:id/comments', [
    check('content', 'Comment content is required').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        const comment = {
            user: 'demo_user_id',
            content: req.body.content
        };

        task.comments.push(comment);
        await task.save();

        // Create activity
        await Activity.create({
            type: 'comment',
            action: 'added',
            title: 'New comment',
            description: `On task: ${task.title}`,
            user: 'demo_user_id',
            task: task._id,
            project: task.project
        });

        res.json({
            success: true,
            data: task.comments[task.comments.length - 1]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;