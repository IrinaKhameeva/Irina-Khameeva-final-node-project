const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authentication');
const {
  fetchArtObjects,
  saveArtObject,
  getUserCollection,
  deleteArtObject,
} = require('../controllers/artControllers');

// 
router.get('/gallery', fetchArtObjects);

// 
router.use(authenticateUser);
router.post('/save', saveArtObject);
router.get('/mycollection', getUserCollection);
router.delete('/mycollection/:id', deleteArtObject);

module.exports = router;
