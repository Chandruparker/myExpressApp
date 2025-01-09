const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  fullName: { type: String }, 
  email: { type: String }, 
  phone: { type: String }, 
  dob: { type: Date }, 
  address: { 
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String },
  },
});

module.exports = mongoose.model('User', userSchema);
