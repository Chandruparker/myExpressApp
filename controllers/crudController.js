// const fs = require('fs');
// const path = require('path');

// const ITEMS_FILE = path.join(__dirname, '../data/items.json');

// function getAllItems(req, res) {
//     const items = JSON.parse(fs.readFileSync(ITEMS_FILE, 'utf-8'));
//     res.json(items);
// }

// function addItem(req, res) {
//     const { name, description } = req.body;
//     if (!name || !description) {
//         return res.status(400).json({ message: 'Name and description are required.' });
//     }

//     const items = JSON.parse(fs.readFileSync(ITEMS_FILE, 'utf-8'));
//     const nextId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;

//     const newItem = { id: nextId, name, description };

//     items.push(newItem);

//     fs.writeFileSync(ITEMS_FILE, JSON.stringify(items, null, 2), 'utf-8');
//     res.status(201).json({ message: 'Item added successfully.', newItem });
// }

// function updateItem(req, res) {
//     const { id } = req.params;
//     const { name, description } = req.body;

//     const items = JSON.parse(fs.readFileSync(ITEMS_FILE, 'utf-8'));
//     const item = items.find(i => i.id === parseInt(id));

//     if (!item) {
//         return res.status(404).json({ message: 'Item not found.' });
//     }

//     item.name = name || item.name;
//     item.description = description || item.description;

//     fs.writeFileSync(ITEMS_FILE, JSON.stringify(items, null, 2), 'utf-8');
//     res.json({ message: 'Item updated successfully.', item });
// }

// function deleteItem(req, res) {
//     const { id } = req.params;

//     let items = JSON.parse(fs.readFileSync(ITEMS_FILE, 'utf-8'));
//     const initialLength = items.length;
//     items = items.filter(i => i.id !== parseInt(id));

//     if (items.length === initialLength) {
//         return res.status(404).json({ message: 'Item not found.' });
//     }

//     fs.writeFileSync(ITEMS_FILE, JSON.stringify(items, null, 2), 'utf-8');
//     res.json({ message: 'Item deleted successfully.' });
// }
// const getItemById = (req, res) => {
//   const { id } = req.params;
//   const items = JSON.parse(fs.readFileSync(ITEMS_FILE, 'utf-8'));

//   const item = items.find((item) => item.id === parseInt(id, 10));
//   if (item) {
//     res.status(200).json(item);
//   } else {
//     res.status(404).json({ message: 'Item not found' });
//   }
// };
// module.exports = { getAllItems, addItem, updateItem, deleteItem, getItemById };

const Item = require('../models/product');
const Order = require('../models/orders');
const getNextSequenceValue = require('../utils/getNextSequence');



exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// exports.addItem = async (req, res) => {
//     const { name, description, image } = req.body;

//     if (!name || !description || !category) {
//       return res.status(400).json({ message: 'Name, description, and category are required.' });
//     }
  
//     try {
//       const productId = await getNextSequenceValue('productId');
//       const newProduct = new Item({
//         productId,
//         name,
//         description,
//         category,
//         image,
//       });
  
//       await newProduct.save();
//       res.status(201).json({ message: 'Product added successfully.', newProduct });
//     } catch (error) {
//       res.status(500).json({ message: 'Server error.', error: error.message });
//     }
//   };

//   exports.updateItem = async (req, res) => {
//     const { productId } = req.params;
//     const { name, description } = req.body;
  
//     try {
//       const updatedItem = await Item.findByIdAndUpdate(
//         { productId: parseInt(productId) },
//         { name, description },
//         { new: true, runValidators: true }
//       );
  
//       if (!updatedItem) {
//         return res.status(404).json({ message: 'Item not found.' });
//       }
  
//       res.json({ message: 'Item updated successfully.', updatedItem });
//     } catch (err) {
//       res.status(500).json({ message: 'Server error.', error: err.message });
//     }
//   };


exports.addItem = async (req, res) => {
  const { name, description, category, price } = req.body;
  console.log('File received:', req.file); // Debugging
  console.log('Request body:', req.body); // Debugging
  // Validate fields
  if (!name || !description || !category || !price) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const productId = await getNextSequenceValue('productId'); // Generate unique ID

    // Handle image upload
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Save relative path
    console.log('Image URL:', imageUrl); // Debugging

    // Create new item
    const newItem = new Item({
      productId,
      name,
      description,
      category,
      price,
      image: imageUrl, // Save image path to MongoDB
    });

    // Save item to MongoDB
    await newItem.save();

    res.status(201).json({ message: 'Item added successfully.', newItem });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};


exports.updateItem = async (req, res) => {
    const { productId } = req.params;
    const { name, description } = req.body;
  
    try {
      // Use findOneAndUpdate to query by productId instead of _id
      const updatedItem = await Item.findOneAndUpdate(
        { productId: parseInt(productId) }, // Match by productId
        { name, description },             // Fields to update
        { new: true, runValidators: true } // Options: return the updated document
      );
  
      if (!updatedItem) {
        return res.status(404).json({ message: 'Item not found.' });
      }
  
      res.json({ message: 'Item updated successfully.', updatedItem });
    } catch (err) {
      res.status(500).json({ message: 'Server error.', error: err.message });
    }
  };
  
  exports.deleteItem = async (req, res) => {
    const { productId } = req.params;
  
    try {
      const deletedItem = await Item.findOneAndDelete({ productId: parseInt(productId) });
  
      if (!deletedItem) {
        return res.status(404).json({ message: 'Item not found.' });
      }
  
      res.json({ message: 'Item deleted successfully.' });
    } catch (err) {
      res.status(500).json({ message: 'Server error.', error: err.message });
    }
  };

//   exports.getItemById = async (req, res) => {
//     const { productId } = req.params;
  
//     try {
//       const item = await Item.findById(productId);
  
//       if (!item) {
//         return res.status(404).json({ message: 'Item not found.' });
//       }
  
//       res.json(item);
//     } catch (err) {
//       res.status(500).json({ message: 'Server error.', error: err.message });
//     }
//   };
  
exports.getItemById = async (req, res) => {
    const { productId } = req.params;
  
    try {
      // Use findOne to query by productId instead of _id
      const item = await Item.findOne({ productId: parseInt(productId) });
  
      if (!item) {
        return res.status(404).json({ message: 'Item not found.' });
      }
  
      res.json(item);
    } catch (err) {
      res.status(500).json({ message: 'Server error.', error: err.message });
    }
  };
  
  exports.orderedItem = async (req, res) => {
    try {
      const orderData = req.body;
  
     
      const order = new Order(orderData);
      await order.save();
  
      res.status(200).json({ message: 'Order submitted successfully!', order });
    } catch (error) {
      console.error('Error saving order:', error);
      res.status(500).json({ message: 'Error submitting order', error });
    }
  };

