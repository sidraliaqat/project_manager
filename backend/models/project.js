const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Project name is required'],
        trim: true,
        maxlength: [100, 'Project name cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'marketing', 'hr', 'design', 'development', 'other'],
        default: 'other'
    },
    status: {
        type: String,
        enum: ['planning', 'active', 'on-hold', 'completed', 'cancelled'],
        default: 'planning'
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    startDate: {
        type: Date,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    budget: {
        type: Number,
        min: 0,
        default: 0
    },
    currency: {
        type: String,
        default: 'USD'
    },
    client: {
        name: String,
        email: String,
        phone: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    team: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            enum: ['member', 'lead', 'contributor'],
            default: 'member'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    tags: [{
        type: String,
        trim: true
    }],
    settings: {
        isPublic: {
            type: Boolean,
            default: false
        },
        allowComments: {
            type: Boolean,
            default: true
        }
    },
    completedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Calculate progress automatically based on tasks
ProjectSchema.virtual('calculatedProgress').get(function() {
    // This will be calculated in the controller
    return this.progress;
});

module.exports = mongoose.model('Project', ProjectSchema);