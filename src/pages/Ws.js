import { io } from "socket.io-client";

let socket = null;

// ⭐ Create socket
export const ConnectWs = () => {
    if (!socket) {
        socket = io("https://live-chat-application-22b5.onrender.com/", {
            transports: ["websocket"],
            withCredentials: true
        });

        socket.on("connect", () => {
            console.log("socket connected:", socket.id);
        });

        socket.on("wellcome", (socketMsg, id) => {
            console.log(socketMsg, id);
        });

        socket.on("connect_error", (err) => {
            console.log("socket error:", err.message);
        });
    }

    return socket;
};

// ⭐ Disconnect socket correctly
export const DisconnectWs = () => {
    if (socket) {
        const oldId = socket.id;   // SAVE ID BEFORE DISCONNECT

        socket.disconnect();

        console.log("socket disconnected:", oldId);

        socket = null;
    }
};

export { socket };
