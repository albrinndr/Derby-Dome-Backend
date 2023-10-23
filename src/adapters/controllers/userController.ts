import { Request, Response } from "express";
import UserUseCase from "../../useCase/userUseCase";
import JWTToken from "../../infrastructure/utils/generateToken";


class UserController {
    private userCase: UserUseCase;
    private JWTToken: JWTToken;
    constructor(userCase: UserUseCase, JWTToken: JWTToken) {
        this.userCase = userCase;
        this.JWTToken = JWTToken;
    }

    async signup(req: Request, res: Response) {
        try {
            const user = await this.userCase.signUp(req.body);
            res.status(user.status).json(user.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }
    async login(req: Request, res: Response) {
        try {
            const user = await this.userCase.login(req.body);
            const userId = user.data?._id;
            const userName = user.data?.name;
            if (userId && userName) this.JWTToken.generateToken(res, userId, userName);
            res.status(user.status).json(user.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }
}

export default UserController;
