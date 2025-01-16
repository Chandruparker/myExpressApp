const express = require('express');
const upload = require('../controllers/multer-config');
const { getAllUsers,getAllOrders, getItemByOrderId,orderedItem, getAllItems, addItem, updateItem, deleteItem, getItemById, getUsersByName, updateProfile,updateOrderStatus,updateUserStatus} = require('../controllers/crudController');

const router = express.Router();

router.get('/items', getAllItems);
// router.post('/items', addItem);
router.put('/items/:productId', updateItem);
router.delete('/items/:productId', deleteItem);
router.get('/items/:productId', getItemById);
router.post('/items', upload.array('images', 10), addItem);
router.post('/submitOrder', orderedItem);
router.get('/orders', getAllOrders);
router.get('/users', getAllUsers);
// router.put('/users/:userId', updateUser); 
router.get('/orders/:orderId', getItemByOrderId);
router.get('/profile',getUsersByName);
router.put('/profile',updateProfile);
router.put('/orders/:orderId/status', updateOrderStatus);
router.put('/users/:username/status', updateUserStatus);
module.exports = router;
