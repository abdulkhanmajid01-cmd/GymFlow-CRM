// Import JWT package
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (userId, role) => {

  return jwt.sign(

    {
      id: userId,
      role: role,
    },

    process.env.JWT_SECRET,

    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }

  );

};

// Export
module.exports = generateToken;