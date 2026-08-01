import { Server } from "socket.io";

let io = null;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    socket.on("join:admin", () => {
      socket.join("admins");
    });
    socket.on("disconnect", () => {});
  });

  return io;
};

export const emitToAdmins = (event, payload) => {
  if (!io) return;
  io.to("admins").emit(event, payload);
};

export const getIO = () => io;
