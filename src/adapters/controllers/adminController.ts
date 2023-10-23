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
}

export default AdminController;
