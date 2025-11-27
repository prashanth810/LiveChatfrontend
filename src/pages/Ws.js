import { io } from "socket.io-client";

export const ConnectWs = () => {
    const socket = io("http://localhost:8010", {
        transports: ["websocket"],
        withCredentials: true
    });

    socket.on("connect", () => {
        console.log("socket connected:", socket.id);
    });

    socket.on("wellcome", (socket, id) => {
        console.log(socket, id);
    })

    socket.on("connect_error", (err) => {
        console.log("socket error:", err.message);
    });

    // socket.on("disconnected", () => {
    //     console.log("socket disconnected ", socket.id);
    // })

    return socket;
};
