const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// CRUD routes
router.get('/', userController.getAllUsers);  // Read all users
router.get('/:id', userController.getUserById);  // Read a single user
router.post('/', userController.createUser);  // Create a new user
router.put('/:id', userController.updateUser);  // Update a user
router.delete('/:id', userController.deleteUser);  // Delete a user

module.exports = router;
