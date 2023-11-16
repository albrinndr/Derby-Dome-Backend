import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";

export class SocketRepository {
    private io: SocketIOServer;

    constructor(httpServer: HttpServer) {
        this.io = new SocketIOServer(httpServer, {
            cors: {
                origin: process.env.CORS_URL
            }
        });

        this.io.on("connection", this.handleConnection);
    }

    private handleConnection = (socket: Socket) => {
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
}
