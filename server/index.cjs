const express = require('express');
const fs = require('fs');
const { PassThrough } = require('stream')
const Throttle = require('throttle');
const ffprobe = require('@dropb/ffprobe').ffprobe;
const ffprobeStatic = require('ffprobe-static');


const app = express();

app.use(express.static(__dirname + '/dist'));

ffprobe.path = ffprobeStatic.path;
let counter = 0
let sinks = new Set();
let bitrate = 100000
const readable = fs.createReadStream('./songs/2.mp3')

ffprobe('./songs/2.mp3').then((info) => {
  bitrate = parseInt(info.format.bit_rate)
  console.log(bitrate);
}).catch((err) => {
  console.error(err);
}).then(() => {
  const throttle = new Throttle(bitrate / 8)
  readable.pipe(throttle).on('data', (chunk) => {
    counter = counter + 1
    console.log("chunk " + counter)
    for (const sink of sinks) {
      sink.write(chunk);
    }
  })
});



app.get('/stream', (req, res) => {
  const sink = new PassThrough();

  sink.on('close', () => {
    sinks.delete(sink);
  });

  sinks.add(sink);
  res.set('Content-Type', 'audio/mp3');
  res.set('Transfer-Encoding', 'chunked');
  sink.pipe(res);
})


app.get('/stream2', (req, res) => {
  const audioPath = './2.mp3';
  const audioStream = fs.createReadStream(audioPath);

  res.set('Content-Type', 'audio/mp3');
  audioStream.pipe(res);
})

app.get('/stream3', (req, res) => {
  res.set('Content-Type', 'audio/mp3');
  res.set('Transfer-Encoding', 'chunked');

  readable.on('data', chunk => {
    res.write(chunk);
  });

  readable.on('end', () => {
    res.end();
  });
})

app.listen(3000, () => {
  console.log('App listening on port 3000!');
});