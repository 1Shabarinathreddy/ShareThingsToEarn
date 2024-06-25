const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, updateProfile, resetPassword, userListing } = require('./user')
const { validateToken, checkRole } = require('../controllers/user')
const { getCategories, addItem, getItems, editItem, deleteItem, getItemListToBook } = require('./item')
const { bookItem, getRequestedItems, getRentalItems, updateStatus, returnItem, getRentedItems } = require('./itemrequest')
const multer = require('multer');


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', validateToken, getProfile);
router.put('/profile', validateToken, updateProfile);
router.post('/reset-password', resetPassword);

router.get('/categories', validateToken, getCategories);

// Initialize multer for file uploads
const upload = multer({ dest: 'uploads/' });

router.post('/item', upload.single('file'), validateToken, addItem);
router.get('/item', validateToken, getItems);
router.put('/item/:id', upload.single('file'), validateToken, editItem);
router.delete('/item/:id', validateToken, deleteItem);

// Items needs to list in the dashboard to book
router.get('/itemsToBook', validateToken, getItemListToBook);
router.post('/book-item', validateToken, bookItem);

// Items taken rent from other users
router.get('/requested-items', validateToken, getRequestedItems);

// Items for Approval screen that needs to give to rental by the current user
router.get('/rental-items', validateToken, getRentalItems);

// Approve or Reject status by the current user
router.put('/update-status/:id', validateToken, updateStatus);
router.put('/return-item/:id', validateToken, returnItem)

router.get('/users', validateToken, checkRole(['Admin']), userListing);
router.get('/rented-items', validateToken, checkRole(['Admin']), getRentedItems)

module.exports = router;