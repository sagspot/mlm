const path = require('path');
const express = require('express');
const dotenv = require('dotenv').config();
const morgan = require('morgan');
const colors = require('colors');

const connectDB = require('./db');
const usersRoute = require('./api/users/users');

const app = express();

app.use(morgan('dev'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', usersRoute);

const PORT = process.env.PORT || 3000;

connectDB();

const server = app.listen(PORT, () =>
  console.log(`Server is listening on port ${PORT}...`.yellow.bold)
);

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);
  server.close(() => process.exit(1));
});
