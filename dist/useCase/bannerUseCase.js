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
class BannerUseCase {
    constructor(BannerRepository) {
        this.BannerRepository = BannerRepository;
    }
    getBanners() {
        return __awaiter(this, void 0, void 0, function* () {
            const banners = yield this.BannerRepository.findAll();
            return {
                status: 200,
                data: banners
            };
        });
    }
    changeBanner(bannerData) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.BannerRepository.findOne(bannerData.name);
            if (data) {
                data.text = bannerData.text;
                data.image = bannerData.image || (data === null || data === void 0 ? void 0 : data.image);
                data.color = bannerData.color || (data === null || data === void 0 ? void 0 : data.color);
                const updatedData = yield this.BannerRepository.save(data);
                return {
                    status: 200,
                    data: updatedData
                };
            }
            else {
                const updatedData = yield this.BannerRepository.save(bannerData);
                return {
                    status: 200,
                    data: updatedData
                };
            }
        });
    }
    ;
}
exports.default = BannerUseCase;
