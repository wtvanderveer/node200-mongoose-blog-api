const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/my-blog');
mongoose.Promise = Promise;

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/users', require('./routes/users'));
app.use('/api/blogs', require('./routes/blogs'));

module.exports = app;
