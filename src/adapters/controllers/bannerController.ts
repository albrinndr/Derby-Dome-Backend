import { Request, Response } from "express";
import BannerUseCase from "../../useCase/bannerUseCase";
import CloudinaryUpload from "../../infrastructure/utils/cloudinaryUpload";


class BannerController {
    private bannerCase: BannerUseCase;
    private CloudinaryUpload: CloudinaryUpload;
    constructor(bannerCase: BannerUseCase, CloudinaryUpload: CloudinaryUpload) {
        this.bannerCase = bannerCase;
        this.CloudinaryUpload = CloudinaryUpload;

    }

    async getBanners(req: Request, res: Response) {
        try {
            const banners = await this.bannerCase.getBanners();
            res.status(banners.status).json(banners.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async updateBanner(req: Request, res: Response) {
        try {
            if (req.file) {
                const img = await this.CloudinaryUpload.upload(req.file.path, 'banners');
                const imgUrl = img.secure_url;
                const reqData = {
                    image: imgUrl,
                    name: req.body.name,
                    text: req.body.text,
                    color: req.body.color
                };
                const bannerData = await this.bannerCase.changeBanner(reqData);
                res.status(bannerData.status).json(bannerData.data);
            } else {
                const bannerData = await this.bannerCase.changeBanner(req.body);
                res.status(bannerData.status).json(bannerData.data);
            }
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }
}

export default BannerController;
