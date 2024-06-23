const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, updateProfile, resetPassword, userListing } = require('./user')
const { validateToken, checkRole } = require('../controllers/user')
const { getCategories, addItem, getItems, editItem, deleteItem, getItemListToBook } = require('./item')

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', validateToken, getProfile);
router.put('/profile', validateToken, updateProfile);
router.post('/reset-password', resetPassword);

router.get('/categories', validateToken, getCategories);

router.post('/item', validateToken, addItem);
router.get('/item', validateToken, getItems);
router.put('/item/:id', validateToken, editItem);
router.delete('/item/:id', validateToken, deleteItem);

router.get('/itemsToBook', validateToken, getItemListToBook);
router.get('/users', validateToken, checkRole(['Admin']), userListing);

module.exports = router;