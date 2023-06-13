const express = require('express');
const Fs = require('fs');
const Throttle = require('throttle');
const { ffprobeSync } = require('@dropb/ffprobe');

const app = express();

app.use(express.static(__dirname + '/dist'));



app.get('/stream', (req, res) => {
  res.send('Hello World!')
})

app.listen(3000, () => {
  console.log('App listening on port 3000!');
});