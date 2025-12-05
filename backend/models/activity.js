const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['project', 'task', 'comment', 'milestone', 'meeting', 'file', 'user'],
        required: true
    },
    action: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true
});

// Index for faster queries
ActivitySchema.index({ user: 1, createdAt: -1 });
ActivitySchema.index({ project: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', ActivitySchema);