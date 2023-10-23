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

            res.cookie('adminJWT', admin.data.token, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000
            });
            res.status(admin.status).json(admin.data.admin);
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
}

export default AdminController;
