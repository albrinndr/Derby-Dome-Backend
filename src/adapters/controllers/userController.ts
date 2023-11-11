import { Request, Response } from "express";
import UserUseCase from "../../useCase/userUseCase";
import GenerateEmail from "../../infrastructure/services/sendMail";
import GenerateOtp from "../../infrastructure/services/generateOtp";
import CloudinaryUpload from "../../infrastructure/utils/cloudinaryUpload";


class UserController {
    private userCase: UserUseCase;
    private GenerateEmail: GenerateEmail;
    private GenerateOtp: GenerateOtp;
    private CloudinaryUpload: CloudinaryUpload;

    constructor(userCase: UserUseCase, GenerateEmail: GenerateEmail, GenerateOtp: GenerateOtp, CloudinaryUpload: CloudinaryUpload) {
        this.userCase = userCase;
        this.GenerateOtp = GenerateOtp;
        this.GenerateEmail = GenerateEmail;
        this.CloudinaryUpload = CloudinaryUpload;

    }

    async signUp(req: Request, res: Response) {
        try {
            const verifyUser = await this.userCase.signUp(req.body.email);

            if (verifyUser.data.status === true && req.body.isGoogle) {
                const user = await this.userCase.verifyUser(req.body);
                res.status(user.status).json(user.data);
            }
            else if (verifyUser.data.status === true) {
                req.app.locals.userData = req.body;
                const otp = this.GenerateOtp.createOtp();
                req.app.locals.otp = otp;
                this.GenerateEmail.sendMail(req.body.email, otp);
                console.log(otp);
                setTimeout(() => {
                    req.app.locals.otp = this.GenerateOtp.createOtp();
                }, 3 * 60000);

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
                const user = await this.userCase.verifyUser(req.app.locals.userData);
                req.app.locals.userData = null;
                res.status(user.status).json(user.data);
            } else {
                res.status(400).json({ status: false, message: 'Invalid otp' });
            }

        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async resendOtp(req: Request, res: Response) {
        try {
            const otp = this.GenerateOtp.createOtp();
            req.app.locals.otp = otp;
            this.GenerateEmail.sendMail(req.app.locals.userData.email, otp);
            console.log(otp);

            setTimeout(() => {
                req.app.locals.otp = this.GenerateOtp.createOtp();
            }, 3 * 60000);
            res.status(200).json({ message: 'Otp has been sent!' });
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
                    secure: process.env.NODE_ENV !== 'development',
                    maxAge: 30 * 24 * 60 * 60 * 1000
                });
            }

            res.status(user.status).json(user.data);
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
            // const userId = req.query.id as string;
            const userId = req.userId || '';
            const user = await this.userCase.profile(userId);
            res.status(user.status).json(user.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async updateProfile(req: Request, res: Response) {
        try {
            if (req.file) {
                const img = await this.CloudinaryUpload.upload(req.file.path, 'profile-picture');
                const imgUrl = img.secure_url;
                console.log(imgUrl);
                const data = req.body;
                data.profilePic = imgUrl;
                const user = await this.userCase.updateProfile(req.userId || '', data, req.body.newPassword);
                res.status(user.status).json(user.data);
            } else {
                const user = await this.userCase.updateProfile(req.userId || '', req.body, req.body.newPassword);
                res.status(user.status).json(user.data);
            }
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async userHomeContent(req: Request, res: Response) {
        try {
            const result = await this.userCase.userHome();
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async fixtureContent(req: Request, res: Response){
        try {
            const result = await this.userCase.allFixtures();
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }
}

export default UserController;
