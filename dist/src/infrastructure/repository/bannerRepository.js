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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bannerModel_1 = __importDefault(require("../db/bannerModel"));
class BannerRepository {
    findOne(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield bannerModel_1.default.findOne({ name });
            if (data)
                return data;
            return null;
        });
    }
    save(stadium) {
        return __awaiter(this, void 0, void 0, function* () {
            const newData = new bannerModel_1.default(stadium);
            yield newData.save();
            return newData;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield bannerModel_1.default.find();
            if (data)
                return data;
            return [];
        });
    }
}
exports.default = BannerRepository;
