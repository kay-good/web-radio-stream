<template>
  <div>
    <h1>B</h1>
    <p>This is an about page used to illustrate mapping a view to a router with Vue Router.</p>
    <button @click="onClickMic">{{ title }}</button>
    <button @click="execCommand('pause')">Say hello</button>
    <button @click="execCommand('resume')">Say bye</button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { AudioRecorder } from "jnaudiostream";

const recorderRef = ref(new AudioRecorder({}, 100));
const recording = ref(false)
const title = `${recording ? "Stop" : "Start"} recording`;

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

const onClickMic = () => {
  const recorder = recorderRef.value;
  recording = (!recorder.recording);
  recorder.recording
    ? recorder.stopRecording()
    : recorder.startRecording();
};

const execCommand = (command) => {
  socket.emit("control", command);
};


</script>