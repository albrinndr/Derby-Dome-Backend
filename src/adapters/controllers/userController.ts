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

    async login(req: Request, res: Response) {
        try {
            const user = await this.userCase.login(req.body);

            if (user.data.token != '') {
                res.cookie('userJWT', user.data.token, {
                    httpOnly: true,
                    sameSite: 'strict',
                    maxAge: 30 * 24 * 60 * 60 * 1000
                });
            }
            res.status(user.status).json(user.data.user);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async logout(req: Request, res: Response) {
        try {
            res.cookie('userJWT', '', {
                httpOnly: true,
                expires: new Date(0)
            });
            res.status(200).json({ message: 'User logged out' });
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async profile(req: Request, res: Response) {
        try {
            const userId = req.query.id as string;
            const user = await this.userCase.profile(userId);
            res.status(user.status).json(user.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async updateProfile(req: Request, res: Response) {
        try {
            const user = await this.userCase.updateProfile(req.body, req.body.newPassword);
            res.status(user.status).json(user.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }
}

export default UserController;
