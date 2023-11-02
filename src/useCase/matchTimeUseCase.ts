import MatchTime from "../domain/matchTime";
import MatchTimeRepository from "../infrastructure/repository/matchTimeRepository";

class MatchTimeUseCase {
    private MatchTimeRepository: MatchTimeRepository;
    constructor(MatchTimeRepository: MatchTimeRepository) {
        this.MatchTimeRepository = MatchTimeRepository;
    }
    async addNewTime(timeData: MatchTime) {
        const timeExists = await this.MatchTimeRepository.findByTime(timeData.time);
        if (!timeExists) {
            const values = { ...timeData, newPrice: timeData.price };
            const newTime = await this.MatchTimeRepository.save(values);
            return {
                status: 200,
                data: newTime
            };
        } else {
            return {
                status: 400,
                data: { message: 'Time already exists!' }
            };
        }
    }
}

export default MatchTimeUseCase;
