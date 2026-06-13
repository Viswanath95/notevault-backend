const mongoose = require('mongoose');

const noteSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true, // faster queries when filtering by user
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        content: {
            type: String,
            default: '',
        },
        colour: {
            type: String,
            default: '#ffffff',
        },
        isPinned: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,   // adds both createdAt & updatedAt automatically
    }
);

module.exports = mongoose.model('Note', noteSchema);