const express = require('express');
const { getAllItems, addItem, updateItem, deleteItem, getItemById} = require('../controllers/crudController');

const router = express.Router();

router.get('/items', getAllItems);
router.post('/items', addItem);
router.put('/items/:productId', updateItem);
router.delete('/items/:productId', deleteItem);
router.get('/items/:productId', getItemById);


module.exports = router;
