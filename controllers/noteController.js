const Note = require('../models/Note');
const HttpError = require('../models/http-error');

// Backend pagination implementation
// GET /api/notes?page=1&limit=6
const getAllNotes = async(req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 6

        const skip = (page - 1) * limit

        const [notes, total] = await Promise.all([
            Note.find({ userId: req.userData.userId })
                .sort({ isPinned: -1, updatedAt: -1 })
                .skip(skip)
                .limit(limit),
            Note.countDocuments({ userId: req.userData.userId })
        ])

        res.json({
            success: true,
            notes,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total/limit),
                hasNextPage: page < Math.ceil(total/limit), // ← key flag
            }
        })
    }catch (err) {
        return next(new HttpError('Fetching notes failed.', 500));
    }
    
}

// POST /api/notes
// Create a new note
const createNote = async (req, res, next) => {
    try {
        const { title, content, colour, isPinned } = req.body;

        const note = await Note.create({
            userId: req.userData.userId, // always from token, never from req.body
            title,
            content,
            colour,
            isPinned,
        });

        res.status(201).json({
            success: true,
            note,
        });
    }catch (err) {
        return next(new HttpError('Creating a note is failed, please try again.', 500));
    }
};

// PUT /api/notes/:id
// Update a note
const updateNote = async(req, res, next) => {
    try {
        const { title, content, colour, isPinned } = req.body;

        const note = await Note.findOneAndUpdate(
            {
                _id: req.params.id, // Particular note id
                userId: req.userData.userId, // Loggedin user id
            },
            { title, content, colour, isPinned },
            { returnDocument: 'after', runValidators: true }
    );

    if(!note) {
        return next(new HttpError('Note not found or unauthorized', 400));
    }

    res.json({
        success: true,
        note,
    });
    }catch (err) {
        return next(new HttpError('Updating note failed, please try again later.', 500));
    }
};

// DELETE /api/notes/:id
// Delete a note
const deleteNote = async (req, res, next) => {
    try {
        const note = await Note.findOneAndDelete({
            _id: req.params.id,
            userId: req.userData.userId,
        });

        if(!note) {
            return next(new HttpError('Note not found or unauthorized', 400));
        }

        res.json({
            success: true,
            message: 'Note deleted successfully.',
        });
    }catch (err) {
        return next(new HttpError('Deleting note failed, please try again later.', 500));
    }
};

// GET /api/notes/search?q=keyword
// Search notes by title or content
const searchNotes = async (req, res, next) => {
    try {
        const { q } = req.query;

        if(!q || q.trim() === '') {
            return next(new HttpError('Search query cannot be empty', 400));
        }

        const notes = await Note.find({
            userId: req.userData.userId,
            $or: [
                { title: { $regex: q, $options: 'i'} }, //case-insensitive
                { content:{ $regex: q, $options: 'i'} },
            ],
        }).sort({ isPinned: -1, updatedAt: -1});

        res.json({
            success: true,
            count: notes.length,
            notes,
        });
    }catch (err) {
        return next(new HttpError('Search failed, please try again later.', 500));
    }
};

module.exports = { getAllNotes, createNote, updateNote, deleteNote, searchNotes };