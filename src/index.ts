import { createServer } from "./infrastructure/config/app";
import { connectDB } from "./infrastructure/config/db";

const app = createServer();
const PORT = process.env.PORT || 8000;

connectDB().then(() => {
    app?.listen(PORT, () => console.log('Server started!'));
});