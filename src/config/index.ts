import { Server } from "socket.io";
import http from "http";
import express from "express";
import { getRoomById } from "../controller/roomController";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
export interface IRoomSocket {
  title: string;
  author: string;
  isPrivate: boolean;
  allowCamera: boolean;
  allowMic: boolean;
  hasPassword: boolean;
  password: string;
  tag: string;
  participants: string[];
}
const userSocketMap: { [key: string]: string } = {};
const roomOnlineUsers: { [key: string]: IRoomSocket } = {};
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
  socket.on("joinRoom", async (roomId: string, userId: string) => {
    console.log("user-join", roomId, userId);
    const room = roomOnlineUsers[roomId];
    if (room) {
      const user = room.participants.find((id) => id === userId);
      if (user) {
        return;
      }
      room.participants.push(userId);
      roomOnlineUsers[roomId] = room;
    } else {
      if (roomId === "any") {
        roomOnlineUsers[roomId] = {
          title: "Any Room",
          author: "Any Author",
          isPrivate: false,
          allowCamera: true,
          allowMic: true,
          hasPassword: false,
          password: "",
          tag: "ANY",
          participants: [userId],
        };
      } else {
        const roomReturn = await getRoomById(roomId);
        if (!roomReturn) {
          return;
        }
        roomOnlineUsers[roomId] = {
          title: roomReturn.title,
          author: roomReturn.author,
          isPrivate: roomReturn.isPrivate,
          allowCamera: roomReturn.allowCamera,
          allowMic: roomReturn.allowMic,
          hasPassword: roomReturn.hasPassword,
          password: roomReturn.password,
          tag: roomReturn.tag,
          participants: [userId],
        };
      }
    }
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
      const room = roomOnlineUsers[roomId];
      if (room) {
        room.participants = room.participants.filter((id) => id !== userId);
        roomOnlineUsers[roomId] = room;
        if (room.participants.length === 0) {
          delete roomOnlineUsers[roomId];
        }
      }
      socket.leave(roomId);
      io.emit("getRoomOnlineUsers", roomOnlineUsers);
    });
  });

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  io.emit("getRoomOnlineUsers", roomOnlineUsers);
  // socket.on() is used to listen to the events. can be used both on client and server side
  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io, getReceiverSocketId };
