require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(helmet());

app.use(routes);

app.use(function (err, req, res, next) {
  console.log(err);
  res.status(err.status || 500).json({
    status: 'error',
    message: 'Internal server error occurred',
  });
});

app.listen(port, () => {
  console.log(`Server started listening on ${port}`);
});

module.exports = app;
