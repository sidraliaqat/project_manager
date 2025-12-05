const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// In-memory data storage (testing ke liye)
let projects = [
    {
        id: 1,
        name: "Website Redesign",
        category: "Web Development",
        description: "Complete overhaul of company website with modern design",
        status: "active",
        progress: 75,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        team: ["You", "Sarah", "Mike", "Alex"],
        tasks: 12,
        budget: "$15,000"
    },
    {
        id: 2,
        name: "Mobile App Development",
        category: "Mobile",
        description: "Build cross-platform mobile application",
        status: "planning",
        progress: 20,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        team: ["You", "John", "Emma", "Sarah", "Mike"],
        tasks: 8,
        budget: "$25,000"
    }
];

let tasks = [
    {
        id: 1,
        title: "Design Homepage Layout",
        description: "Create wireframes and mockups for new homepage design",
        status: "todo",
        priority: "high",
        assignee: "You",
        deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        project: "Website Redesign",
        projectId: 1
    },
    {
        id: 2,
        title: "API Integration",
        description: "Integrate payment gateway API for checkout system",
        status: "progress",
        priority: "high",
        assignee: "Mike",
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        project: "E-commerce Platform",
        projectId: 1
    },
    {
        id: 3,
        title: "Write Documentation",
        description: "Document API endpoints and usage guidelines",
        status: "todo",
        priority: "medium",
        assignee: "Sarah",
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        project: "Mobile App",
        projectId: 2
    }
];

// API Routes

// Test route
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'Backend is working! 🚀',
        timestamp: new Date().toISOString()
    });
});

// Get all projects
app.get('/api/projects', (req, res) => {
    res.json({
        success: true,
        data: projects
    });
});

// Get single project
app.get('/api/projects/:id', (req, res) => {
    const project = projects.find(p => p.id == req.params.id);
    if (project) {
        res.json({ success: true, data: project });
    } else {
        res.status(404).json({ success: false, message: 'Project not found' });
    }
});

// Create new project
app.post('/api/projects', (req, res) => {
    try {
        const newProject = {
            id: projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1,
            ...req.body,
            createdAt: new Date().toISOString(),
            progress: 0,
            tasks: 0,
            team: req.body.team ? req.body.team.split(',').map(t => t.trim()) : ['You']
        };
        
        projects.push(newProject);
        
        res.status(201).json({
            success: true,
            data: newProject,
            message: 'Project created successfully!'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating project'
        });
    }
});

// Update project
app.put('/api/projects/:id', (req, res) => {
    const index = projects.findIndex(p => p.id == req.params.id);
    if (index !== -1) {
        projects[index] = { ...projects[index], ...req.body };
        res.json({ success: true, data: projects[index] });
    } else {
        res.status(404).json({ success: false, message: 'Project not found' });
    }
});

// Get all tasks
app.get('/api/tasks', (req, res) => {
    const { status, project } = req.query;
    let filteredTasks = [...tasks];
    
    if (status) {
        filteredTasks = filteredTasks.filter(t => t.status === status);
    }
    
    if (project) {
        filteredTasks = filteredTasks.filter(t => t.projectId == project);
    }
    
    res.json({
        success: true,
        data: filteredTasks
    });
});

// Get single task
app.get('/api/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id == req.params.id);
    if (task) {
        res.json({ success: true, data: task });
    } else {
        res.status(404).json({ success: false, message: 'Task not found' });
    }
});

// CREATE TASK - YEH IMPORTANT HAI! 🎯
app.post('/api/tasks', (req, res) => {
    console.log('📝 Creating new task:', req.body);
    
    try {
        const { title, description, project, priority, assignee, deadline, status } = req.body;
        
        if (!title) {
            return res.status(400).json({
                success: false,
                message: 'Task title is required'
            });
        }
        
        // Find project by name to get its ID
        const projectObj = projects.find(p => p.name === project);
        
        const newTask = {
            id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
            title,
            description: description || '',
            status: status || 'todo',
            priority: priority || 'medium',
            assignee: assignee || 'You',
            deadline: deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            project: project || 'General',
            projectId: projectObj ? projectObj.id : 1,
            createdAt: new Date().toISOString()
        };
        
        tasks.push(newTask);
        
        console.log('✅ Task created:', newTask);
        
        res.status(201).json({
            success: true,
            data: newTask,
            message: 'Task created successfully! ✅'
        });
    } catch (error) {
        console.error('❌ Error creating task:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating task'
        });
    }
});

// Update task
app.put('/api/tasks/:id', (req, res) => {
    const index = tasks.findIndex(t => t.id == req.params.id);
    if (index !== -1) {
        tasks[index] = { ...tasks[index], ...req.body };
        res.json({ success: true, data: tasks[index] });
    } else {
        res.status(404).json({ success: false, message: 'Task not found' });
    }
});

// Delete task
app.delete('/api/tasks/:id', (req, res) => {
    const index = tasks.findIndex(t => t.id == req.params.id);
    if (index !== -1) {
        tasks.splice(index, 1);
        res.json({ success: true, message: 'Task deleted' });
    } else {
        res.status(404).json({ success: false, message: 'Task not found' });
    }
});

// User profile
app.get('/api/users/profile', (req, res) => {
    res.json({
        success: true,
        data: {
            id: 'demo_user_id',
            firstName: 'Sidraayyy',
            lastName: 'Manager',
            email: 'sidraayyy@manager.com',
            role: 'Project Manager',
            avatar: 'SM',
            bio: 'Experienced project manager with expertise in web development projects.',
            company: 'Sidraayyy Inc.',
            position: 'Project Manager',
            phone: '+1-234-567-8900'
        }
    });
});

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Frontend served from: ${path.join(__dirname, '../frontend')}`);
    console.log(`✅ API Endpoints:`);
    console.log(`   GET  http://localhost:${PORT}/api/test`);
    console.log(`   GET  http://localhost:${PORT}/api/projects`);
    console.log(`   POST http://localhost:${PORT}/api/projects`);
    console.log(`   GET  http://localhost:${PORT}/api/tasks`);
    console.log(`   POST http://localhost:${PORT}/api/tasks`);
    console.log(`\n📝 Note: All data is stored in memory (for testing)`);
});