import Stadium, { Time } from "../../domain/stadium";
import StadiumRepo from "../../useCase/interface/stadiumRepo";
import StadiumModel from "../db/stadiumModal";

class StadiumRepository implements StadiumRepo {
    async saveTime(time: Time): Promise<any> {
        const stadium = await StadiumModel.findOne();
        if (stadium) {
            stadium.timings.push({
                time: time.time,
                price: time.price,
                newPrice: time.newPrice,
                delete: time.delete,
                changeDate: time.changeDate,
            });
            await stadium.save();
            return stadium;
        } else {
            const stadium = new StadiumModel({
                timings: [{
                    time: time.time,
                    price: time.price,
                    newPrice: time.newPrice,
                    delete: time.delete,
                    changeDate: time.changeDate,
                }]
            });
            await stadium.save();
            return stadium;
        }
    }

    async findByTime(time: string): Promise<Stadium | null> {
        const findTime = await StadiumModel.findOne({ 'timings.time': time });
        if (findTime) return findTime;
        return null;
    }

    async findAllTime(): Promise<{}[] | null> {
        const matchTimings = await StadiumModel.aggregate([{ $project: { _id: 0, timings: 1 } }]);
        return matchTimings[0].timings;
    }

    async findTimeById(id: string): Promise<Stadium | null> {
        const findTime = await StadiumModel.findOne({ 'timings._id': id });
        if (findTime) return findTime;
        return null;
    }

    async updateNewPrice(id: string, price: number): Promise<any> {
        await StadiumModel.findOneAndUpdate(
            { 'timings._id': id },
            {
                $set: {
                    'timings.$.newPrice': price,
                    'timings.$.changeDate':new Date(new Date().setDate(new Date().getDate() + 12))
                }
            }
        );
    }

    async updatePrice(id: string, price: number): Promise<any> {
        await StadiumModel.findOneAndUpdate(
            { 'timings._id': id },
            { $set: { 'timings.$.price': price } }
        );
    }
}

export default StadiumRepository;
