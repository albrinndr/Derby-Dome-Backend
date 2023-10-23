import { Request, Response } from "express";
import UserUseCase from "../../useCase/userUseCase";

class UserController {
    private userCase: UserUseCase;
    constructor(userCase: UserUseCase) {
        this.userCase = userCase;
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
}

export default UserController;
