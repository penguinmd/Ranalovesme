const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Photo = require('../models/Photo');
const { authenticateToken } = require('../middleware/auth');
const { updatePhotoValidator, photoIdValidator } = require('../validators/photos');
const validate = require('../middleware/validate');
const AppError = require('../utils/AppError');
const config = require('../config');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../', config.uploadsDir);
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: config.maxFileSize },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new AppError('Only image files (JPEG, PNG, GIF, WEBP) are allowed', 400));
  }
});

// Get all photos
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const photos = await Photo.getAll();
    res.json(photos);
  } catch (error) {
    next(error);
  }
});

// Get single photo
router.get('/:id', authenticateToken, photoIdValidator, validate, async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      throw new AppError('Photo not found', 404);
    }
    res.json(photo);
  } catch (error) {
    next(error);
  }
});

// Upload photo
router.post('/', authenticateToken, upload.single('photo'), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }

    const { caption, location, taken_date } = req.body;

    const id = await Photo.create({
      filename: req.file.filename,
      original_name: req.file.originalname,
      caption,
      location,
      taken_date,
      uploaded_by: req.user.id
    });

    res.status(201).json({
      id,
      filename: req.file.filename,
      message: 'Photo uploaded successfully'
    });
  } catch (error) {
    // Clean up uploaded file if database insert fails
    if (req.file) {
      fs.unlink(path.join(uploadsDir, req.file.filename)).catch(console.error);
    }
    next(error);
  }
});

// Update photo metadata
router.put('/:id', authenticateToken, updatePhotoValidator, validate, async (req, res, next) => {
  try {
    const { caption, location, taken_date } = req.body;

    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      throw new AppError('Photo not found', 404);
    }

    await Photo.update(req.params.id, { caption, location, taken_date });
    res.json({ message: 'Photo updated successfully' });
  } catch (error) {
    next(error);
  }
});

// Delete photo
router.delete('/:id', authenticateToken, photoIdValidator, validate, async (req, res, next) => {
  try {
    const filename = await Photo.delete(req.params.id);

    if (!filename) {
      throw new AppError('Photo not found', 404);
    }

    // Delete the file from filesystem
    const filepath = path.join(uploadsDir, filename);
    await fs.unlink(filepath).catch(err => {
      console.error('Error deleting file:', err);
    });

    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
