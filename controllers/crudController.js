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
const User = require('../models/users')
const getNextSequenceValue = require('../utils/getNextSequence');



exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const items = await Order.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const items = await User.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// Fetch user profile by username (GET)
exports.getUsersByName = async (req, res) => {
  try {
    const username = req.query.username;

    // Validate the username
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    // Fetch the user profile from the database
    const profile = await User.findOne({ username: username });

    if (profile) {
      res.json(profile);
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile (PUT)

exports.updateProfile = async (req, res) => {
  const { username } = req.body; // Extract username from the payload
  const updateData = req.body; // Use the rest of the payload as update data

  try {
    // Validate if username exists in the payload
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    // Find the user by username and update the profile
    const updatedUser = await User.findOneAndUpdate(
      { username: username }, // Query to find user by username
      { $set: updateData }, // Update fields
      { new: true, runValidators: true } // Options: return the updated document and run schema validators
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully!',
      updatedUser,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      message: 'Server error.',
      error: error.message,
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params; // Get orderId from the request URL
  const { status } = req.body; // Get the new status from the request body

  try {
    // Validate the inputs
    if (!orderId || !status) {
      return res.status(400).json({ message: 'Order ID and status are required.' });
    }

    // Update the orderStatus array by pushing a new status update
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId }, // Find the order by orderId
      {
        $push: {
          orderStatus: {
            status,
            updatedAt: new Date() // Add the current timestamp
          }
        }
      },
      { new: true } // Return the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.json({ message: 'Order status updated successfully.', order: updatedOrder });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  const { username } = req.params; // Get orderId from the request URL
  const { status } = req.body; // Get the new status from the request body

  try {
    // Validate the inputs
    if (!username || !status) {
      return res.status(400).json({ message: 'user and status are required.' });
    }

    // Update the orderStatus array by pushing a new status update
    const updatedUser = await User.findOneAndUpdate(
      { username }, // Find the order by orderId
      {
        $push: {
          userStatus: {
            status,
            updatedAt: new Date() // Add the current timestamp
          }
        }
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'user not found.' });
    }

    res.json({ message: 'user status updated successfully.', user: updatedUser });
  } catch (err) {
    console.error('Error updating user status:', err);
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


// exports.addItem = async (req, res) => {
//   const { name, description, category, price } = req.body;
//   console.log('File received:', req.file); 
//   console.log('Request body:', req.body); 
 
//   if (!name || !description || !category || !price) {
//     return res.status(400).json({ message: 'All fields are required.' });
//   }

//   try {
//     const productId = await getNextSequenceValue('productId');


//     const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; 
//     console.log('Image URL:', imageUrl); 

    
//     const newItem = new Item({
//       productId,
//       name,
//       description,
//       category,
//       price,
//       image: imageUrl, // Save image path to MongoDB
//     });

   
//     await newItem.save();

//     res.status(201).json({ message: 'Item added successfully.', newItem });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error.', error: error.message });
//   }
// };

exports.addItem = async (req, res) => {
  const { name, description, category, price } = req.body;

  console.log('Files received:', req.files); // Debugging for multiple files
  console.log('Request body:', req.body); // Debugging

  // Validate fields
  if (!name || !description || !category || !price) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const productId = await getNextSequenceValue('productId'); // Generate unique ID

    // Handle multiple image uploads
    const imageUrls = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : [];
    console.log('Image URLs:', imageUrls); // Debugging

    // Create new item
    const newItem = new Item({
      productId,
      name,
      description,
      category,
      price,
      image: imageUrls, // Save array of image paths to MongoDB
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
  const { productId } = req.query; // Correct way to get query params

  try {
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

  exports.getItemByOrderId = async (req, res) => {
    const { orderId } = req.params;
  
    try {
      // Use orderId as a string to query the database
      const item = await Order.findOne({ orderId: orderId });
  
      if (!item) {
        return res.status(404).json({ message: 'Order not found.' });
      }
  
      res.json(item);
    } catch (err) {
      res.status(500).json({ message: 'Server error.', error: err.message });
    }
  };
  