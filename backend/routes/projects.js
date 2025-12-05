const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Project = require('../models/project');
const Task = require('../models/task');
const Activity = require('../models/activity');

// @route   GET /api/projects
// @desc    Get all projects
// @access  Public (for demo)
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find()
            .populate('owner', 'firstName lastName email avatar')
            .populate('team.user', 'firstName lastName email avatar')
            .sort({ createdAt: -1 });

        // Calculate progress based on tasks
        const projectsWithProgress = await Promise.all(projects.map(async (project) => {
            const tasks = await Task.find({ project: project._id });
            const totalTasks = tasks.length;
            const completedTasks = tasks.filter(task => task.status === 'completed').length;
            
            const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            
            return {
                ...project.toObject(),
                calculatedProgress: progress,
                taskCount: totalTasks
            };
        }));

        res.json({
            success: true,
            count: projectsWithProgress.length,
            data: projectsWithProgress
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Public (for demo)
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('owner', 'firstName lastName email avatar')
            .populate('team.user', 'firstName lastName email avatar');

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Get project tasks
        const tasks = await Task.find({ project: project._id })
            .populate('assignee', 'firstName lastName avatar')
            .populate('reporter', 'firstName lastName avatar');

        // Calculate progress
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.status === 'completed').length;
        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        res.json({
            success: true,
            data: {
                ...project.toObject(),
                calculatedProgress: progress,
                tasks: tasks,
                stats: {
                    totalTasks,
                    completedTasks,
                    inProgress: tasks.filter(t => t.status === 'in-progress').length,
                    todo: tasks.filter(t => t.status === 'todo').length
                }
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

// @route   POST /api/projects
// @desc    Create new project
// @access  Private
router.post('/', [
    check('name', 'Project name is required').not().isEmpty(),
    check('startDate', 'Start date is required').not().isEmpty(),
    check('deadline', 'Deadline is required').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // For demo, create project without authentication
        const projectData = {
            ...req.body,
            owner: 'demo_user_id',
            team: [{ user: 'demo_user_id', role: 'lead' }]
        };

        const project = await Project.create(projectData);

        // Create activity
        await Activity.create({
            type: 'project',
            action: 'created',
            title: project.name,
            user: 'demo_user_id',
            project: project._id
        });

        res.status(201).json({
            success: true,
            data: project
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        let project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Update project
        project = await Project.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({
            success: true,
            data: project
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Delete all tasks associated with the project
        await Task.deleteMany({ project: project._id });

        // Delete project
        await project.deleteOne();

        res.json({
            success: true,
            message: 'Project deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/projects/:id/tasks
// @desc    Get project tasks
// @access  Public
router.get('/:id/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.id })
            .populate('assignee', 'firstName lastName avatar')
            .populate('reporter', 'firstName lastName avatar')
            .sort({ dueDate: 1 });

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

// @route   GET /api/projects/:id/stats
// @desc    Get project statistics
// @access  Public
router.get('/:id/stats', async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.id });
        
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === 'completed').length;
        const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
        const todoTasks = tasks.filter(t => t.status === 'todo').length;
        
        const highPriority = tasks.filter(t => t.priority === 'high' || t.priority === 'urgent').length;
        const overdueTasks = tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length;
        
        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        res.json({
            success: true,
            data: {
                totalTasks,
                completedTasks,
                inProgressTasks,
                todoTasks,
                highPriority,
                overdueTasks,
                progress
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

module.exports = router;