const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userName: { type: String, required: true },
  address: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    contact: { type: String, required: true }
  },
  orderDetails: {
    cartItems: [
      {
        image: [String], // Array of image URLs
        _id: String,
        name: String,
        price: Number,
        quantity: Number
      }
    ],
    totalValue: Number,
    discount: Number,
    paymentType: String,
    deliveryOption:String,
    tax: Number,
    gst: Number,
    finalAmount: Number,
    status: String
    
  },
  orderStatus: [
    {
      status: { type: String, required: true },
      updatedAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
