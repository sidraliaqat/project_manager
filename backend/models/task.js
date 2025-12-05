const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Task title is required'],
        trim: true,
        maxlength: [200, 'Task title cannot exceed 200 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    status: {
        type: String,
        enum: ['todo', 'in-progress', 'review', 'completed', 'blocked'],
        default: 'todo'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    estimatedHours: {
        type: Number,
        min: 0,
        default: 0
    },
    actualHours: {
        type: Number,
        min: 0,
        default: 0
    },
    labels: [{
        type: String,
        trim: true
    }],
    attachments: [{
        filename: String,
        url: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        },
        size: Number
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        content: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    subtasks: [{
        title: String,
        completed: {
            type: Boolean,
            default: false
        },
        completedAt: Date
    }],
    completedAt: {
        type: Date
    },
    dependencies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }]
}, {
    timestamps: true
});

// Index for faster queries
TaskSchema.index({ project: 1, status: 1 });
TaskSchema.index({ assignee: 1, dueDate: 1 });
TaskSchema.index({ dueDate: 1 });

module.exports = mongoose.model('Task', TaskSchema);