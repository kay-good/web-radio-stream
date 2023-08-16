<template>
  <div id="container">
    <canvas id="canvas"></canvas>
    <h1>C</h1>
    <button @click="playAudio">Play audio</button>
    <audio :src="`${URL}/stream`" controls id="audio" crossorigin="anonymous" />
    <p>Count is: {{ buttonClicked }}</p>
    <button @click="greet">Greet</button>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted, onMounted } from 'vue'
import { AudioStreamer } from "jnaudiostream";
import { io } from "socket.io-client";

let streamerRef = null
const socketRef = ref(io(URL)).value;
const URL = "http://localhost:3000";
let buttonClicked = ref(false);

let container = null
let canvas = null
let audio1 = null
let ctx = null
let audioCtx = null

function playAudio() {
  streamerRef = ref(new AudioStreamer());
  buttonClicked.value = true
  console.log("play click")

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  let audioSource = null;
  let analyser = null;


  audioSource = audioCtx.createMediaElementSource(audio1);
  analyser = audioCtx.createAnalyser();
  audioSource.connect(analyser);
  analyser.connect(audioCtx.destination);

  analyser.fftSize = 128;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  const barWidth = canvas.width / bufferLength;
  console.log(ctx)
 
  let x = 0;
  function animate() {
    x = 0;
    let barHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArray);
    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i];
      ctx.fillStyle = "gray";
      //ctx.fillRect(30, 50, 100, 200);
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      //console.log(x, canvas.height - barHeight, barWidth, barHeight)
      x += barWidth;
    }

    requestAnimationFrame(animate);
  }

  animate();
};

function greet() {
  alert(`Hello ${buttonClicked}!`)
}

watch(buttonClicked, (newValue, oldValue) => {
  if (newValue) {
    audio1.play();
    console.log("play watch")
    watch(
      () => socketRef,
      (newSocket, oldSocket) => {
        if (oldSocket) {
          oldSocket.off('bufferHeader');
          oldSocket.off('stream');
        }

        if (newSocket) {
          const streamer = streamerRef.value;

          socketRef.on('bufferHeader', (packet) => {
            if (streamer.mediaBuffer) {
              return;
            }

            streamer.setBufferHeader(packet);
            streamer.playStream();
          });

          socketRef.on('stream', (packet) => {
            if (!streamer.mediaBuffer) {
              return;
            }
            streamer.receiveBuffer(packet);
          });
        }
      },
      { immediate: true }
    );
  }
});

onUnmounted(() => {
  socketRef.off('bufferHeader');
  socketRef.off('stream');
});

onMounted(() => {
  container = document.getElementById("container");
  canvas = document.getElementById("canvas");
  audio1 = document.getElementById("audio");
  console.log(canvas)
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext("2d");
})

</script>