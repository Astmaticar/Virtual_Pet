const express = require('express');
const {
  getPet,
  createPet,
  feedPet,
  cleanPet,
  playWithPet,
  deletePet,
} = require('../controllers/petController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getPet);
router.post('/', authMiddleware, createPet);
router.put('/feed', authMiddleware, feedPet);
router.put('/clean', authMiddleware, cleanPet);
router.put('/play', authMiddleware, playWithPet);
router.delete('/', authMiddleware, deletePet);

module.exports = router;
