import { Seats, Time } from "../domain/stadium";
import FixtureRepository from "../infrastructure/repository/fixtureRepository";
import StadiumRepository from "../infrastructure/repository/stadiumRepository";
import ScheduleTask from "../infrastructure/utils/scheduleTask";

class StadiumUseCase {
    private StadiumRepository: StadiumRepository;
    private FixtureRepository: FixtureRepository;
    // private ScheduleTask: ScheduleTask;
    constructor(StadiumRepository: StadiumRepository, ScheduleTask: ScheduleTask, FixtureRepository: FixtureRepository) {
        this.StadiumRepository = StadiumRepository;
        this.FixtureRepository = FixtureRepository;
        // this.ScheduleTask = ScheduleTask;
    }
    async addNewTime(timeData: Time) {
        const timeExists = await this.StadiumRepository.findByTime(timeData.time);
        if (!timeExists) {
            let values = { ...timeData };
            const fixtureData = await this.FixtureRepository.findAllFixtures();
            if(fixtureData.length===0) values = {...timeData,showDate:new Date(new Date().setDate(new Date().getDate() + 10))}
            const newTime = await this.StadiumRepository.saveTime(values);
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

    async getAllTimes() {
        const allTimes = await this.StadiumRepository.findAllTime();
        return {
            status: 200,
            data: allTimes
        };
    }

    async updateTimePrice(timeData: Time) {
        const time = await this.StadiumRepository.findTimeById(timeData.id);
        if (time) {
            await this.StadiumRepository.updatePrice(timeData.id, timeData.price);
            // this.ScheduleTask.scheduleTimePrice(() => this.StadiumRepository.updatePrice(timeData.id, timeData.price));
            return {
                status: 200,
                data: { message: 'Changes applied!' }
            };
        } else {
            return {
                status: 400,
                data: { message: 'Invalid data provided' }
            };
        }
    }

    async deleteMatchTime(id: string) {
        const time = await this.StadiumRepository.findTimeById(id);
        if (time) {
            await this.StadiumRepository.deleteMatchTime(id);
            // this.ScheduleTask.scheduleTimePrice(() => this.StadiumRepository.deleteMatchTime(id));

            return {
                status: 200,
                data: { message: 'Time removed!' }
            };
        } else {
            return {
                status: 400,
                data: { message: 'Invalid data provided' }
            };
        }

    }

    async setSeatPrice(seatData: Seats) {
        await this.StadiumRepository.seatPriceSave(seatData.stand, seatData.price);
        return {
            status: 200,
            data: { message: 'Seat price updated!' }
        };
    }

    async getSeats() {
        const result = await this.StadiumRepository.getAllSeats();
        return {
            status: 200,
            data: result
        };
    }
}

export default StadiumUseCase;
