"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpServer = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const userRoutes_1 = __importDefault(require("../routes/userRoutes"));
const clubRoutes_1 = __importDefault(require("../routes/clubRoutes"));
const adminRoutes_1 = __importDefault(require("../routes/adminRoutes"));
const paymentRoutes_1 = __importDefault(require("../routes/paymentRoutes"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const socketRepository_1 = require("../repository/socketRepository");
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
exports.httpServer = httpServer;
const socket = new socketRepository_1.SocketRepository(httpServer);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({ origin: process.env.CORS_URL, credentials: true, }));
app.use((0, express_session_1.default)({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use('/api/user', userRoutes_1.default);
app.use('/api/club', clubRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/payment', paymentRoutes_1.default);
