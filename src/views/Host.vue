<template>
  <div>
    <h1>B</h1>
    <p>This is an about page used to illustrate mapping a view to a router with Vue Router.</p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const recorderRef = ref(new AudioRecorder({}, 100));

watch(socket, (newSocket) => {
  if (!newSocket) return;
        const recorder = recorderRef.value;

        recorder.onReady = (packet) => {
            console.log("Recording started!");
            console.log(packet);
            console.log("Header size: " + packet.data.size + "bytes");
            newSocket.emit("bufferHeader", packet);
        };

        recorder.onBuffer = (packet) => {
          newSocket.emit("stream", packet);
        };
})
</script>