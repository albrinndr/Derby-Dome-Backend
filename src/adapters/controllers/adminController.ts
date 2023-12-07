import { Request, Response } from "express";
import AdminUseCase from "../../useCase/adminUseCase";

class AdminController {
    private adminCase: AdminUseCase;
    constructor(adminCase: AdminUseCase) {
        this.adminCase = adminCase;
    }

    async login(req: Request, res: Response) {
        try {
            const admin = await this.adminCase.login(req.body);

            if (admin.data.token) {
                res.cookie('adminJWT', admin.data.token, {
                    httpOnly: true,
                    sameSite: 'strict',
                    secure: process.env.NODE_ENV !== 'development',
                    maxAge: 30 * 24 * 60 * 60 * 1000
                });
            }
            res.status(admin.status).json(admin.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }

    }

    async logout(req: Request, res: Response) {
        try {
            res.cookie('adminJWT', '', {
                httpOnly: true,
                expires: new Date(0)
            });
            res.status(200).json({ message: 'Admin logged out' });
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async getUsers(req: Request, res: Response) {
        try {
            const users = await this.adminCase.getUsers();
            res.status(users.status).json(users.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async blockUser(req: Request, res: Response) {
        try {
            const userId = req.query.id as string;
            const user = await this.adminCase.blockUser(userId);
            res.status(user.status).json(user.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async getClubs(req: Request, res: Response) {
        try {
            const clubs = await this.adminCase.getClubs();
            res.status(clubs.status).json(clubs.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async blockClub(req: Request, res: Response) {
        try {
            const clubId = req.query.id as string;
            const club = await this.adminCase.blockClub(clubId);
            res.status(club.status).json(club.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async slotSaleDashboardData(req: Request, res: Response) {
        try {
            const year = req.query.year as string;
            const result = await this.adminCase.dashboardSlotSaleData(year);
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async staticChartAndCardDashboardData(req: Request, res: Response) {
        try {
            const result = await this.adminCase.dashboardChartAndCardContent();
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async ticketsSoldDashboardData(req: Request, res: Response) {
        try {
            const year = req.query.year as string;
            const result = await this.adminCase.dashboardTicketSoldData(year);
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async allFixtures(req: Request, res: Response) {
        try {
            const result = await this.adminCase.allFixtures();
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

}

export default AdminController;
