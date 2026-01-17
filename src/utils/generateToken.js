const jwt = require("jsonwebtoken");
require("dotenv").config();

async function generateToken(userId) {
  const payload = { userId };
  const key = process.env.JWT_SECRET_KEY;
  const token = jwt.sign(payload, key, { expiresIn: "2h" });
  return token;
}

module.exports = { generateToken };
