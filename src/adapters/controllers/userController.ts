import { Request, Response } from "express";
import UserUseCase from "../../useCase/userUseCase";
import GenerateEmail from "../../infrastructure/services/sendMail";
import GenerateOtp from "../../infrastructure/services/generateOtp";
import CloudinaryUpload from "../../infrastructure/utils/cloudinaryUpload";

declare module 'express-session' {
    interface SessionData {
        forgotEmail?: string;
        forgotOtp?: number;
        forgotClubEmail?: string;
        forgotClubOtp?: number;
    }
}

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
                    sameSite: 'none',
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

    async fixtureContent(req: Request, res: Response) {
        try {
            const result = await this.userCase.allFixtures();
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async userSearch(req: Request, res: Response) {
        try {
            const result = await this.userCase.userSearch();
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async fixtureDetails(req: Request, res: Response) {
        try {
            const id = req.query.id as string;
            const result = await this.userCase.fixtureDetails(id);
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async clubDetails(req: Request, res: Response) {
        try {
            const id = req.query.id as string;
            const result = await this.userCase.clubDetails(id);
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async bookingPage(req: Request, res: Response) {
        try {
            const id = req.query.id as string;
            const userId = req.userId || '';
            const result = await this.userCase.bookingPage(id, userId);
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async checkoutPage(req: Request, res: Response) {
        try {
            const id = req.userId || '';
            const result = await this.userCase.getCartDataForCheckout(id);
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async allReviews(req: Request, res: Response) {
        try {
            const result = await this.userCase.allReviews();
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async userReview(req: Request, res: Response) {
        try {
            const userId = req.userId || '';
            const result = await this.userCase.singleUserReview(userId);
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async followClub(req: Request, res: Response) {
        try {
            const userId = req.userId || '';
            const clubId = req.query.clubId as string;
            const result = await this.userCase.followClub(userId, clubId);
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async userNotifications(req: Request, res: Response) {
        try {
            const userId = req.userId || '';
            const notifications = await this.userCase.userNotifications(userId);
            res.status(notifications.status).json(notifications.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async notificationCount(req: Request, res: Response) {
        try {
            const userId = req.userId || '';
            const count = await this.userCase.newNotificationCount(userId);
            res.status(count.status).json(count.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async readNotification(req: Request, res: Response) {
        try {
            const userId = req.userId || '';
            const count = await this.userCase.readNotification(userId);
            res.status(count.status).json(count.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async forgotPassword(req: Request, res: Response) {
        try {
            const email = req.body.email;
            const result = await this.userCase.forgotPassword(email);
            if (result.data.status) {
                req.session.forgotEmail = email;
                const otp = this.GenerateOtp.createOtp();
                req.session.forgotOtp = otp;
                console.log(req.session.forgotOtp);

                this.GenerateEmail.sendMail(email, otp);
            }
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async forgotOtpVerify(req: Request, res: Response) {
        try {
            const forgotOtp = req.session.forgotOtp;
            const otp = req.body.otp;
            if (forgotOtp == otp) {
                res.status(200).json('Success');
            } else {
                res.status(400).json({ message: "Invalid OTP!" });
            }
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async forgotChangePassword(req: Request, res: Response) {
        try {
            const forgotEmail = req.session.forgotEmail as string;
            const password = req.body.password;

            const result = await this.userCase.forgotPasswordChange(forgotEmail, password);
            res.status(result.status).json(result.data);

        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async allFollowedClubs(req: Request, res: Response) {
        try {
            const userId = req.userId || '';
            const result = await this.userCase.allFollowedClubs(userId);
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async setUserBrowserToken(req: Request, res: Response) {
        try {
            const userId = req.userId || '';
            const browserToken = req.body.token;
            const result = await this.userCase.setBrowserToken(userId, browserToken);
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }
}

export default UserController;
