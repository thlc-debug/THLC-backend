const express = require('express');
const router = express.Router();
const villaController = require('../controllers/villaController');

// Get all villas
router.get('/', villaController.getAllVillas);

// Get all villas
router.get('/:id', villaController.getVillaById);

// Create new villa
router.post('/', villaController.createVilla);

// // Delete villa by ID
// router.delete('/:id', villaController.deleteVilla);

module.exports = router;
