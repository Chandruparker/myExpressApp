// const fs = require('fs');
// const path = require('path');
// const { hashPassword, validateInput } = require('../util');

// const USERS_FILE = path.join(__dirname, '../data/users.json');

// function login(req, res) {
//     const { username, password } = req.body;

//     if (!validateInput(username) || !validateInput(password)) {
//         return res.status(400).json({ message: 'Username and password are required.' });
//     }

//     const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
//     const user = users.find(
//         u => u.username === username && u.password === password
//     );

//     if (!user) {
//         return res.status(401).json({ message: 'Invalid username or password.' });
//     }

//     res.status(200).json({ message: 'Login successful.', username });
// }

// module.exports = { login };

// const fs = require('fs');
// const bcrypt = require('bcrypt');

// const USERS_FILE = './data/users.json';


// exports.register = async (req, res) => {
//     const { username, password, role } = req.body;
  
//     if (!username || !password || !role) {
//       return res.status(400).json({ message: 'All fields are required.' });
//     }
  
//     const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
//     const userExists = users.some((user) => user.username === username);
  
//     if (userExists) {
//       return res.status(400).json({ message: 'Username already exists.' });
//     }
  
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = {
//       id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
//       username,
//       password: hashedPassword,
//       role,
//     };
  
//     users.push(newUser);
//     fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
//     res.status(201).json({ message: 'User registered successfully.', newUser });
//   };


//   exports.login = async (req, res) => {
//     const { username, password } = req.body;
  
//     if (!username || !password) {
//       return res.status(400).json({ message: 'Username and password are required.' });
//     }
  
//     const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
//     const user = users.find((u) => u.username === username && u.password === password);
//   console.log('data',users)
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid credentials.' });
//     }
  
//     res.status(200).json({ message: 'Login successful.', user: { id: user.id, username: user.username, role: user.role } });
//   };



//   exports.forgotPassword = async (req, res) => {
//     const { username, newPassword } = req.body;
  
//     if (!username || !newPassword) {
//       return res.status(400).json({ message: 'Username and new password are required.' });
//     }
  
//     const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
//     const userIndex = users.findIndex((u) => u.username === username);
  
//     if (userIndex === -1) {
//       return res.status(404).json({ message: 'User not found.' });
//     }
  
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     users[userIndex].password = hashedPassword;
  
//     fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
//     res.status(200).json({ message: 'Password reset successfully.' });
//   };

const User = require('../models/users'); // Adjust path
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.', user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }
  
    try {
      const user = await User.findOne({ username });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
  
      res.status(200).json({
        message: 'Login successful.',
        user: { id: user._id, username: user.username, role: user.role },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error.' });
    }
  };
  
  exports.forgotPassword = async (req, res) => {
    const { username, newPassword } = req.body;
  
    if (!username || !newPassword) {
      return res.status(400).json({ message: 'Username and new password are required.' });
    }
  
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ message: 'Password reset successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error.' });
    }
  };
