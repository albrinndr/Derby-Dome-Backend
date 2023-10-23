import { Response } from "express";
import { ObjectId } from "mongoose";

interface JWT {
    generateToken(res: Response, userId: ObjectId, name: string): void;
}
export default JWT;
