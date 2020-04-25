const config = require('./config');
require('dotenv').config();
const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const { chatToken, videoToken, voiceToken } = require('./tokens');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
if(!process.env.PROD){
  const pino = require('express-pino-logger')();
  app.use(pino);
}

const sendTokenResponse = (token, res) => {
  res.set('Content-Type', 'application/json');
  res.send(
    JSON.stringify({
      token: token.toJwt()
    })
  );
};

app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

app.get('/chat/token', (req, res) => {
  const identity = req.query.identity;
  const token = chatToken(identity, config);
  sendTokenResponse(token, res);
});

app.post('/chat/token', (req, res) => {
  const identity = req.body.identity;
  const token = chatToken(identity, config);
  sendTokenResponse(token, res);
});

app.get('/video/token', (req, res) => {
  const identity = req.query.identity;
  const room = req.query.room;
  const token = videoToken(identity, room, config);
  sendTokenResponse(token, res);
});

app.post('/video/token', (req, res) => {
  const identity = req.body.identity;
  const room = req.body.room;
  const token = videoToken(identity, room, config);
  sendTokenResponse(token, res);
});

app.get('/voice/token', (req, res) => {
  const identity = req.body.identity;
  const token = voiceToken(identity, config);
  sendTokenResponse(token, res);
});

app.post('/voice/token', (req, res) => {
  const identity = req.body.identity;
  const token = voiceToken(identity, config);
  sendTokenResponse(token, res);
});


if (process.env.PROD) {
  app.use(express.static(path.join(__dirname, './build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './build/index.html'));
  });
}


app.listen(3001, () =>{
  console.log('Express server is running on localhost:3001');
});
