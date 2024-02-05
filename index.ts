import { httpServer } from "./src/infrastructure/config/app";
import { connectDB } from "./src/infrastructure/config/db";

const PORT = process.env.PORT || 8000;

const startServer = async (): Promise<void> => {
    await connectDB();
    const app = httpServer;
    app?.listen(PORT, () => console.log("Server Started!"));
};
startServer();