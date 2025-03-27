import { Server } from "socket.io";
import http from "http";
import express from "express";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const userSocketMap: { [key: string]: string } = {};
const getReceiverSocketId = (receiverId: any) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket: any) => {
  const userId = socket.handshake.query.userId;
  if (userId != "undefined") {
    console.log("connected", userId);

    const existingUser = userSocketMap[userId];
    if (existingUser) {
      io.to(existingUser).emit("forceDisconnect");
      delete userSocketMap[userId];
    }
    userSocketMap[userId] = socket.id;
  }
  socket.on("joinRoom", (roomId: string, userId: string) => {
    console.log("user-join", roomId, userId);
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  // socket.on() is used to listen to the events. can be used both on client and server side
  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io, getReceiverSocketId };
