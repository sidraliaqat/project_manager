const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/user');
const Task = require('../models/task');
const Project = require('../models/project');

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Public (for demo)
router.get('/profile', async (req, res) => {
    try {
        // For demo, return mock user data
        const user = {
            id: 'demo_user_id',
            firstName: 'Sidraayyy',
            lastName: 'Manager',
            email: 'sidraayyy@manager.com',
            role: 'admin',
            avatar: 'SM',
            bio: 'Experienced project manager with expertise in web development projects.',
            company: 'Sidraayyy Inc.',
            position: 'Project Manager',
            phone: '+1-234-567-8900',
            settings: {
                theme: 'light',
                notifications: {
                    email: true,
                    push: true
                }
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Get user's tasks and projects for stats
        const tasks = await Task.find({ $or: [
            { assignee: 'demo_user_id' },
            { reporter: 'demo_user_id' }
        ]});

        const projects = await Project.find({
            $or: [
                { owner: 'demo_user_id' },
                { 'team.user': 'demo_user_id' }
            ]
        });

        const completedTasks = tasks.filter(t => t.status === 'completed').length;
        const overdueTasks = tasks.filter(t => 
            new Date(t.dueDate) < new Date() && t.status !== 'completed'
        ).length;

        res.json({
            success: true,
            data: {
                ...user,
                stats: {
                    totalProjects: projects.length,
                    totalTasks: tasks.length,
                    completedTasks,
                    overdueTasks,
                    activeProjects: projects.filter(p => p.status === 'active').length
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

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // For demo, update mock data
        const updatedUser = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            bio: req.body.bio || '',
            company: req.body.company || '',
            position: req.body.position || '',
            phone: req.body.phone || '',
            settings: req.body.settings || {}
        };

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/users/activities
// @desc    Get user activities
// @access  Private
router.get('/activities', async (req, res) => {
    try {
        // For demo, return mock activities
        const activities = [
            {
                id: 1,
                type: 'project',
                action: 'created',
                title: 'Website Redesign',
                user: 'You',
                time: '2 hours ago'
            },
            {
                id: 2,
                type: 'task',
                action: 'completed',
                title: 'Homepage wireframe',
                user: 'Sarah Smith',
                time: '5 hours ago'
            },
            {
                id: 3,
                type: 'comment',
                action: 'added',
                title: 'Mobile App project',
                user: 'Mike Johnson',
                time: '1 day ago'
            },
            {
                id: 4,
                type: 'milestone',
                action: 'reached',
                title: 'Project Alpha',
                user: 'Team',
                time: '2 days ago'
            },
            {
                id: 5,
                type: 'meeting',
                action: 'scheduled',
                title: 'Sprint Planning',
                user: 'You',
                time: '3 days ago'
            }
        ];

        res.json({
            success: true,
            count: activities.length,
            data: activities
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', async (req, res) => {
    try {
        // Get tasks and projects for demo user
        const tasks = await Task.find({ $or: [
            { assignee: 'demo_user_id' },
            { reporter: 'demo_user_id' }
        ]});

        const projects = await Project.find({
            $or: [
                { owner: 'demo_user_id' },
                { 'team.user': 'demo_user_id' }
            ]
        });

        const completedTasks = tasks.filter(t => t.status === 'completed').length;
        const overdueTasks = tasks.filter(t => 
            new Date(t.dueDate) < new Date() && t.status !== 'completed'
        ).length;

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
                totalProjects: projects.length,
                activeProjects: projects.filter(p => p.status === 'active').length,
                totalTasks: tasks.length,
                completedTasks,
                overdueTasks,
                upcomingTasks,
                productivity: tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0
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