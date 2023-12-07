"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketRepository = void 0;
const socket_io_1 = require("socket.io");
class SocketRepository {
    constructor(httpServer) {
        this.handleConnection = (socket) => {
            console.log('a user connected!');
            socket.on("sendMessage", ({ senderId, text, name, profilePic }) => {
                this.io.emit("getMessage", {
                    senderId,
                    text,
                    name,
                    profilePic
                });
            });
            socket.on("disconnect", () => {
                console.log("a user disconnected!");
            });
        };
        this.io = new socket_io_1.Server(httpServer, {
            cors: {
                origin: process.env.CORS_URL
            }
        });
        this.io.on("connection", this.handleConnection);
    }
}
exports.SocketRepository = SocketRepository;
