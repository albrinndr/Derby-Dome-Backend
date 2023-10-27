import { Request, Response } from "express";
import ClubUseCase from "../../useCase/clubUseCase";
import GenerateEmail from "../../infrastructure/utils/sendMail";
import GenerateOtp from "../../infrastructure/utils/generateOtp";


class ClubController {
    private clubCase: ClubUseCase;
    private GenerateEmail: GenerateEmail;
    private GenerateOtp: GenerateOtp;

    constructor(clubCase: ClubUseCase, GenerateEmail: GenerateEmail, GenerateOtp: GenerateOtp) {
        this.clubCase = clubCase;
        this.GenerateOtp = GenerateOtp;
        this.GenerateEmail = GenerateEmail;

    }

    async signup(req: Request, res: Response) {
        try {
            const verifyClub = await this.clubCase.signUp(req.body.email);
            console.log(req.file)


            if (verifyClub.data.status === true) {
                req.app.locals.clubData = req.body;
                const otp = this.GenerateOtp.createOtp();
                req.app.locals.clubOtp = otp;
                this.GenerateEmail.sendMail(req.body.email, otp);
                console.log(otp);
                setTimeout(() => {
                    req.app.locals.clubOtp = this.GenerateOtp.createOtp();
                }, 3 * 60000);

                res.status(verifyClub.status).json(verifyClub.data);
            } else {
                res.status(verifyClub.status).json(verifyClub.data);
            }

        } catch (error) {

        }
    }

    async clubVerification(req: Request, res: Response) {
        try {
            if (req.body.otp == req.app.locals.clubOtp) {
                const user = await this.clubCase.verifyClub(req.app.locals.clubData);
                req.app.locals.clubData = null;
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
            req.app.locals.clubOtp = otp;
            this.GenerateEmail.sendMail(req.app.locals.clubData.email, otp);
            console.log(otp);

            setTimeout(() => {
                req.app.locals.clubOtp = this.GenerateOtp.createOtp();
            }, 3 * 60000);
            res.status(200).json({ message: 'Otp has been sent!' });
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async login(req: Request, res: Response) {
        try {
            const club = await this.clubCase.login(req.body);

            if (club.data.token != '') {
                res.cookie('clubJWT', club.data.token, {
                    httpOnly: true,
                    sameSite: 'strict',
                    maxAge: 30 * 24 * 60 * 60 * 1000
                });
            }
            res.status(club.status).json(club.data.club);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }
}

export default ClubController;
