const crypto = require('crypto');

// Hash a password
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// Validate input
function validateInput(input) {
    return input && input.trim().length > 0;
}

module.exports = { hashPassword, validateInput };
