import { io } from "socket.io-client";

let socket = null;

export const getSocket = () => {
  if (socket) return socket;

  let url;
  const apiUrl = import.meta.env.VITE_API_URL;
  if (import.meta.env.PROD) {
    url = undefined;
  } else if (apiUrl) {
    url = apiUrl.replace(/\/api\/v1\/?$/, "");
  } else {
    url = "http://localhost:5000";
  }

  socket = io(url, { transports: ["websocket", "polling"] });
  return socket;
};

export const closeSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
