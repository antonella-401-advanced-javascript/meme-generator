const express = require('express');
const app = express();

app.use(require('cors')());
app.use(require('cookie-parser')());
app.use(express.json());


const ensureAuth = require('./middleware/ensure-auth');
const checkConnection = require('./middleware/check-connection');

app.use('/api/auth', require('./routes/auth'));
app.use('/api/meme', require('./routes/meme', ensureAuth));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));
app.use(checkConnection());

module.exports = app;
