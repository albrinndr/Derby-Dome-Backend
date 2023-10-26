import { Request, Response } from "express";
import UserUseCase from "../../useCase/userUseCase";
import GenerateEmail from "../../infrastructure/utils/sendMail";
import GenerateOtp from "../../infrastructure/utils/generateOtp";


class UserController {
    private userCase: UserUseCase;
    private GenerateEmail: GenerateEmail;
    private GenerateOtp: GenerateOtp;
    constructor(userCase: UserUseCase, GenerateEmail: GenerateEmail, GenerateOtp: GenerateOtp) {
        this.userCase = userCase;
        this.GenerateOtp = GenerateOtp;
        this.GenerateEmail = GenerateEmail;
    }

    async signUp(req: Request, res: Response) {
        try {
            const verifyUser = await this.userCase.verifyUser(req.body.email);
            if (verifyUser.data.status === true) {
                req.app.locals.userData = req.body;
                const otp = this.GenerateOtp.createOtp();
                req.app.locals.otp = otp;
                this.GenerateEmail.sendMail(req.body.email, otp);

                setTimeout(() => {
                    req.app.locals.otp = this.GenerateOtp.createOtp();
                }, 5 * 60000);

                res.status(verifyUser.status).json(verifyUser.data);
            } else {
                res.status(verifyUser.status).json(verifyUser.data);
            }
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async userVerification(req: Request, res: Response) {
        try {
            if (req.body.otp == req.app.locals.otp) {
                const user = await this.userCase.signUp(req.app.locals.userData);
                req.app.locals.userData = null;
                res.status(user.status).json(user.data);
            } else {
                res.status(200).json({ status: false, message: 'Invalid otp' });
            }

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
