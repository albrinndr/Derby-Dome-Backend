import { Request, Response } from "express";
import fs from 'fs';
import ClubUseCase from "../../useCase/clubUseCase";
import GenerateEmail from "../../infrastructure/services/sendMail";
import GenerateOtp from "../../infrastructure/services/generateOtp";
import CloudinaryUpload from "../../infrastructure/utils/cloudinaryUpload";


class ClubController {
    private clubCase: ClubUseCase;
    private GenerateEmail: GenerateEmail;
    private GenerateOtp: GenerateOtp;
    private CloudinaryUpload: CloudinaryUpload;

    constructor(clubCase: ClubUseCase, GenerateEmail: GenerateEmail, GenerateOtp: GenerateOtp, CloudinaryUpload: CloudinaryUpload) {
        this.clubCase = clubCase;
        this.GenerateOtp = GenerateOtp;
        this.GenerateEmail = GenerateEmail;
        this.CloudinaryUpload = CloudinaryUpload;

    }

    async signup(req: Request, res: Response) {
        try {
            const verifyClub = await this.clubCase.signUp(req.body.email);
            if (req.file) {
                req.app.locals.image = req.file.path;
            }

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
                if (req.file) {
                    fs.unlink(req.file.path, (err) => {
                        if (err) {
                            console.error('Error deleting file:', err);
                        }
                    });
                }
                res.status(verifyClub.status).json(verifyClub.data);
            }

        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async clubVerification(req: Request, res: Response) {
        try {
            if (req.body.otp == req.app.locals.clubOtp) {
                const img = await this.CloudinaryUpload.upload(req.app.locals.image, 'club-logos');
                const clubData = req.app.locals.clubData;
                clubData.image = img.secure_url;

                const user = await this.clubCase.verifyClub(clubData);
                req.app.locals.clubData = null;
                req.app.locals.image = null;
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
            res.status(club.status).json(club.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async logout(req: Request, res: Response) {
        try {
            res.cookie('clubJWT', '', {
                httpOnly: true,
                expires: new Date(0)
            });
            res.status(200).json({ message: 'Club logged out' });
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async profile(req: Request, res: Response) {
        try {
            const clubId = req.clubId || '';
            const club = await this.clubCase.profile(clubId);
            res.status(club.status).json(club.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async updateProfile(req: Request, res: Response) {
        try {
            if (req.file) {
                const img = await this.CloudinaryUpload.upload(req.file.path, 'club-logos');
                const imgUrl = img.secure_url;
                const data = {
                    name: req.body.name,
                    phone: req.body.phone,
                    email: req.body.email,
                    password: req.body.password,
                    image: imgUrl,
                    _id: req.clubId || '',
                    address: req.body.address,
                    contactPerson: req.body.contactPerson,
                    description: req.body.description
                };
                const club = await this.clubCase.updateProfile(req.clubId || '', data, req.body.newPassword);
                res.status(club.status).json(club.data);
            } else {
                const club = await this.clubCase.updateProfile(req.clubId || '', req.body, req.body.newPassword);
                res.status(club.status).json(club.data);
            }

        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async updateBackgroundImg(req: Request, res: Response) {
        try {
            const id = req.clubId || '';
            if (req.file) {
                const img = await this.CloudinaryUpload.upload(req.file.path, 'club-banners');
                const backgroundUrl = img.secure_url;
                const updated = await this.clubCase.backgroundUpdate(id, backgroundUrl);
                res.status(updated.status).json(updated.data);
            } else {
                res.status(400).json({ message: 'Upload a banner image!' });
            }
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async getTeamData(req: Request, res: Response) {
        try {
            const id = req.clubId || '';
            const team = await this.clubCase.getTeamData(id);
            res.status(team.status).json(team.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async addTeamManager(req: Request, res: Response) {
        try {
            if (req.file) {
                const img = await this.CloudinaryUpload.upload(req.file.path, 'team');
                const managerImg = img.secure_url;
                const data = { name: req.body.name, image: managerImg };
                const id = req.clubId || '';
                const result = await this.clubCase.addClubManager(id, data);
                res.status(result.status).json(result.data);
            } else {
                res.status(400).json({ message: 'Upload manager photo' });
            }
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async editTeamManager(req: Request, res: Response) {
        try {
            const data = { name: req.body.name, image: '' };
            const id = req.clubId || '';
            if (req.file) {
                const img = await this.CloudinaryUpload.upload(req.file.path, 'team');
                const managerImg = img.secure_url;
                data.image = managerImg;
            }
            const result = await this.clubCase.editClubManager(id, data);
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async addNewPlayer(req: Request, res: Response) {
        try {
            const id = req.clubId || '';
            const data = { ...req.body, image: '' };
            if (req.file) {
                const img = await this.CloudinaryUpload.upload(req.file.path, 'team');
                const player = img.secure_url;
                data.image = player;
            }
            const result = await this.clubCase.addNewPlayer(id, data);
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async editPlayer(req: Request, res: Response) {
        try {
            const id = req.clubId || '';
            const playerId = req.body.id;
            const data = {
                name: req.body.name,
                shirtNo: req.body.shirtNo,
                position: req.body.position
            };
            if (req.file) {
                const img = await this.CloudinaryUpload.upload(req.file.path, 'team');
                const playerImg = img.secure_url;
                const playerData = { ...data, image: playerImg };
                const result = await this.clubCase.editPlayer(id, playerId, playerData);
                res.status(result.status).json(result.data);
            } else {
                const result = await this.clubCase.editPlayer(id, playerId, data);
                res.status(result.status).json(result.data);
            }
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async deletePlayer(req: Request, res: Response) {
        try {
            const clubId = req.clubId || '';
            const result = await this.clubCase.deleteClubPlayer(clubId, req.params.id);
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async changeStartingXI(req: Request, res: Response) {
        try {
            const clubId = req.clubId || "";
            const p1Id = req.params.p1Id;
            const p2Id = req.params.p2Id;
            const result = await this.clubCase.changeStartingXI(clubId, p1Id, p2Id);
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async dashboardProfitAndExpenseContent(req: Request, res: Response) {
        try {
            const clubId = req.clubId || "";
            const year = req.query.year as string;
            const result = await this.clubCase.clubDashboardSalesAndExpense(clubId, year);
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async dashboardContent(req: Request, res: Response) {
        try {
            const clubId = req.clubId || "";
            const result = await this.clubCase.clubDashboardContent(clubId);
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async forgotPassword(req: Request, res: Response) {
        try {
            const email = req.body.email;
            const result = await this.clubCase.forgotPassword(email);
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

            const result = await this.clubCase.forgotPasswordChange(forgotEmail, password);
            res.status(result.status).json(result.data);

        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

}

export default ClubController;
