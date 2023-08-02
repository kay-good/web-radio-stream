<template>
  <div>
    <h1>B</h1>
    <p>This is an about page used to illustrate mapping a view to a router with Vue Router.</p>
    <button @click="onClickMic">{{ title }}</button>
    <button @click="execCommand('pause')">Say pause</button>
    <button @click="execCommand('resume')">Say resume</button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { AudioRecorder } from "jnaudiostream";
import { io } from "socket.io-client";

const URL = "http://localhost:3000";

const recorderRef = ref(new AudioRecorder({}, 100));
let recording = ref(false)
const socketRef = ref(io(URL)).value;
const title = `${recording.value ? "Stop" : "Start"} recording`;

watch(socketRef, (newSocket) => {
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
  socketRef.emit("control", command);
};


</script>