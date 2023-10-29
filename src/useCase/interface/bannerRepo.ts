import Banner from "../../domain/banner";

interface BannerRepo {
    findOne(name: string): Promise<Banner | null>;
    save(banner: Banner): Promise<Banner>;
    findAll(): Promise<{}[] | null>;
}
export default BannerRepo;
