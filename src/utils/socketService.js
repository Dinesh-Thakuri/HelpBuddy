import io from "socket.io-client/dist/socket.io.js";
import { SOCKET_URL } from "../api/client";

class WSService {
  initializeSocket = async () => {
    try {
      this.socket = io(SOCKET_URL, {
        transports: ["websocket"],
      });

      this.socket.on("connect", (data) => {
        console.log("=== socket connected ====");
      });
      ``;

      this.socket.on("disconnect", (data) => {
        console.log("=== socket disconnected ====");
      });

      this.socket.on("error", (data) => {
        console.log("socket error", data);
      });
    } catch (error) {
      console.log("socket is not initialized", error);
    }
  };

  emit(event, data = {}) {
    this.socket.emit(event, data);
  }

  on(event, cb) {
    this.socket.on(event, cb);
  }

  off(event, cb) {
    this.socket.off(event, cb);
  }
}

const socketServcies = new WSService();

export default socketServcies;
