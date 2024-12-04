const Counter = require('../models/Counter');

async function getNextSequenceValue(name) {
  const counter = await Counter.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

exports.addItem = async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: 'Name and description are required.' });
  }

  try {
    const productId = await getNextSequenceValue('productId');
    const newItem = new Item({
      productId,
      name,
      description,
    });

    await newItem.save();
    res.status(201).json({ message: 'Item added successfully.', newItem });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};
