"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class BannerController {
    constructor(bannerCase, CloudinaryUpload) {
        this.bannerCase = bannerCase;
        this.CloudinaryUpload = CloudinaryUpload;
    }
    getBanners(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const banners = yield this.bannerCase.getBanners();
                res.status(banners.status).json(banners.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    updateBanner(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.file) {
                    const img = yield this.CloudinaryUpload.upload(req.file.path, 'banners');
                    const imgUrl = img.secure_url;
                    const reqData = {
                        image: imgUrl,
                        name: req.body.name,
                        text: req.body.text,
                        color: req.body.color
                    };
                    const bannerData = yield this.bannerCase.changeBanner(reqData);
                    res.status(bannerData.status).json(bannerData.data);
                }
                else {
                    const bannerData = yield this.bannerCase.changeBanner(req.body);
                    res.status(bannerData.status).json(bannerData.data);
                }
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
}
exports.default = BannerController;
