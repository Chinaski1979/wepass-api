require('app-module-path').addPath(__dirname);
require('babel-register')({
  presets : [ 'env' ],
});

require('dotenv').config();

// Import the rest of our application.
module.exports = require('./server.js');
