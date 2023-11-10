import Banner from "../../domain/banner";
import BannerModel from "../db/BannerModel";
import BannerRepo from "../../useCase/interface/bannerRepo";

class BannerRepository implements BannerRepo {
    async findOne(name: string): Promise<Banner | null> {
        const data = await BannerModel.findOne({ name });
        if (data) return data;
        return null;
    }

    async save(stadium: Banner): Promise<Banner> {
        const newData = new BannerModel(stadium);
        await newData.save();
        return newData;
    }

    async findAll(): Promise<{}[]> {
        const data = await BannerModel.find();
        if (data) return data;
        return [];
    }
}

export default BannerRepository;
