const bcrypt = require('bcrypt');
const config = require('../config');

const hashPassword = async (password) => {
  return await bcrypt.hash(password, config.bcryptRounds);
};

const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = { hashPassword, verifyPassword };
