const express = require('express');
const upload = require('../controllers/multer-config');
const { orderedItem, getAllItems, addItem, updateItem, deleteItem, getItemById} = require('../controllers/crudController');

const router = express.Router();

router.get('/items', getAllItems);
// router.post('/items', addItem);
router.put('/items/:productId', updateItem);
router.delete('/items/:productId', deleteItem);
router.get('/items/:productId', getItemById);
router.post('/items', upload.single('image'), addItem);
router.post('/submitOrder', orderedItem);

module.exports = router;
