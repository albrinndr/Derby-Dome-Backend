import { ObjectId } from "mongoose";

interface JWT {
    generateToken(userId: ObjectId): string;
}
export default JWT;
