<template>
  <div>
    <h1>C</h1>
    <audio :src="`${URL}/stream`" autoPlay controls />
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { AudioStreamer } from "jnaudiostream";
import { io } from "socket.io-client";

const streamerRef = ref(new AudioStreamer());
const URL = "http://localhost:3000";
const socketRef = ref(io(URL)).value;


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

onUnmounted(() => {
  socketRef.off('bufferHeader');
  socketRef.off('stream');
});
</script>