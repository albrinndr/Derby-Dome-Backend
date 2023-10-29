import Banner from "../domain/banner";
import BannerRepository from "../infrastructure/repository/bannerRepository";
class BannerUseCase {
    private BannerRepository: BannerRepository;
    constructor(BannerRepository: BannerRepository) {
        this.BannerRepository = BannerRepository;
    }
    async getBanners() {
        const banners = await this.BannerRepository.findAll();
        return {
            status: 200,
            data: banners
        };
    }

    async changeBanner(bannerData: Banner) {
        const data = await this.BannerRepository.findOne(bannerData.name);
        if (data) {
            data.text = bannerData.text || data.text;
            data.image = bannerData.image || data?.image;
            data.color = bannerData.color || data?.color;

            const updatedData = await this.BannerRepository.save(data);
            return {
                status: 200,
                data: updatedData
            };
        } else {
            const updatedData = await this.BannerRepository.save(bannerData);
            return {
                status: 200,
                data: updatedData
            };
        }
    };
}

export default BannerUseCase;
