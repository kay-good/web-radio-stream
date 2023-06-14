import express from "express";
import http from "http";
import { Server as IOServer } from "socket.io";
import queue from "./queue.js";

const PORT = 3000;
const app = express();
const server = http.createServer(app);
const io = new IOServer(server);

(async () => {
  await queue.loadTracks("songs");
  queue.play();

  io.on("connection", (socket) => {
    console.log("New listener connected");
  });

  app.get("/stream", (req, res) => {
    const { id, client } = queue.addClient();

    res.set({
      "Content-Type": "audio/mp3",
      "Transfer-Encoding": "chunked",
    }).status(200);

    client.pipe(res);

    req.on("close", () => {
      queue.removeClient(id);
    });
  });

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
})();

export { };