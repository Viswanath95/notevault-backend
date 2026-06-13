const express = require('express');
const router = express.Router();
const { getAllNotes, createNote, updateNote, deleteNote, searchNotes } = require('../controllers/noteController');
const { createNoteValidator, updateNoteValidator } = require('../validators/noteValidator');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/auth'); // protects all routes below

router.use(authMiddleware); // all note routes require login

router.get('/search', searchNotes);
router.get('/', getAllNotes);
router.post('/', createNoteValidator, validate, createNote);
router.put('/:id', updateNoteValidator, validate, updateNote);
router.delete('/:id', deleteNote);

module.exports = router;