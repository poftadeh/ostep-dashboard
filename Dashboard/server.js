const express = require('express');
const request = require('request');
const path = require('path');
const basicAuth = require('express-basic-auth');
const { IpFilter, IpDeniedError } = require('express-ipfilter');
const { whitelist, users } = require('../config-files/authentication');

const PORT = process.env.PORT || 8080;
const app = express();
const ipResultCheck = (err, req, res, next) => {
  if (err) {
    err instanceof IpDeniedError ? next() : next(err);
  } else {
    next();
  }
};

//app.use('/', IpFilter(whitelist, { mode: 'allow' }));

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get(
  '/test',
  IpFilter(whitelist, { mode: 'allow' }),
  ipResultCheck,
  basicAuth({ challenge: true, users })
);

app.get('/data/:containerName', (req, res, next) => {
  request(`http://${req.params.containerName}`, (error, _response, body) => {
    if (error) next(error);
    res.send(body);
  });
});

app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

app.use((err, req, res, next) => {
  console.error('Error handler:', err);
  console.log('err status', err.status);
  if (err instanceof IpDeniedError) {
    next();
  } else {
    res.status(err.status || 500).json({ message: err.message });
  }
});

//app.use(basicAuth({ challenge: true, users }));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Dashboard container is listening on port ${PORT}`);
});
