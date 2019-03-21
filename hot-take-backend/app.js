// srv addres : mongodb+srv://harith:<PASSWORD>@cluster0-9clfo.mongodb.net/test?retryWrites=true
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const saucesRoutes = require('./routes/sauces');
const usersRoutes = require('./routes/users');
const path = require('path')


mongoose.connect('mongodb+srv://harith:Tanzania_98@cluster0-9clfo.mongodb.net/test?retryWrites=true')
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

 app.use('/images', express.static(path.join(__dirname, 'images')));
 app.use('/api/sauces', saucesRoutes);
 app.use('/api/auth', usersRoutes)

module.exports = app;