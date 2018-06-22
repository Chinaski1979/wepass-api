const path = require('path');

require('app-module-path').addPath(__dirname);

require('babel-polyfill');

require('babel-register')({
  presets : [ 'env' ],
});

require('dotenv').config({path: path.join(__dirname, '../.env')});

// Import the rest of our application.
module.exports = require('./server.js');
