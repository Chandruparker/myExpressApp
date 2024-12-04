// const express = require('express');
// const { login } = require('../controllers/authControllers');

// const router = express.Router();

// router.post('/login', login);

// module.exports = router;

const express = require('express');
const { register, login, forgotPassword } = require('../controllers/authControllers');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

module.exports = router;

