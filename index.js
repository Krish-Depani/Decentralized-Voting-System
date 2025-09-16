const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const app = express();


// Authorization middleware
const authorizeUser = (req, res, next) => {
  const token = req.query.Authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).send('<h1 align="center"> Login to Continue </h1>');
  }

  try {
    // Verify and decode the token
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY, { algorithms: ['HS256'] });

    req.user = decodedToken;
    next(); // Proceed to the next middleware
  } catch (error) {
    return res.status(401).json({ message: 'Invalid authorization token' });
  }
};


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/login.html'));
});

app.get('/js/login.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/js/login.js'))
});

app.get('/css/login.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/css/login.css'))
});

app.get('/css/index.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/css/index.css'))
});

app.get('/css/admin.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/css/admin.css'))
});

app.get('/assets/eth5.jpg', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/assets/eth5.jpg'))
});

app.get('/js/app.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/js/app.js'))
});

app.get('/admin.html', authorizeUser, (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/admin.html'));
});

app.get('/index.html', authorizeUser, (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/index.html'));
});

app.get('/dist/login.bundle.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/dist/login.bundle.js'));
});

app.get('/dist/app.bundle.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/dist/app.bundle.js'));
});

// Serve the favicon.ico file
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/favicon.ico'));
});

// Serve our consolidated pages without authentication
app.get('/admin-consolidated.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/admin-consolidated.html'));
});

app.get('/voter-consolidated.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/voter-consolidated.html'));
});

// Serve other HTML files for testing
app.get('/metamask-minimal.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/metamask-minimal.html'));
});

app.get('/metamask-basic.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/metamask-basic.html'));
});

app.get('/connect-metamask.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/connect-metamask.html'));
});

app.get('/metamask-troubleshoot.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/metamask-troubleshoot.html'));
});

app.get('/admin-direct-connect.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/admin-direct-connect.html'));
});

app.get('/admin-minimal.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/admin-minimal.html'));
});

app.get('/admin-simple-working.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/admin-simple-working.html'));
});

app.get('/voter-simple.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/voter-simple.html'));
});

app.get('/admin-simple-storage.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/admin-simple-storage.html'));
});

app.get('/voter-simple-storage.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/voter-simple-storage.html'));
});

// Start the server
app.listen(8080, () => {
  console.log('Server listening on http://localhost:8080');
});
