import MatchTime from "../../domain/matchTime";
import MatchTimeRepo from "../../useCase/interface/matchTimeRepo";
import MatchTimeModel from "../db/matchTimeModal";

class MatchTimeRepository implements MatchTimeRepo {
    async save(time: MatchTime): Promise<MatchTime> {
        const newTime = new MatchTimeModel(time);
        await newTime.save();
        return newTime;
    }
    async findByTime(time: string): Promise<MatchTime | null> {
        const findTime = await MatchTimeModel.findOne({ time });
       return findTime;
    }
}

export default MatchTimeRepository;
