const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { generateLoginToken, getTokenData } = require("../config/jwt.config")

dotenv.config();
const secret = process.env.JWT_KEY;

module.exports = {
  extendSession: async(req, res) => {
    const { token } = req.params;
    try {
      const data = getTokenData(token)
      const extension = generateLoginToken
    } catch (error) {
      
    }
  }
}