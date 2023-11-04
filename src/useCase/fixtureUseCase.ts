import ClubRepository from "../infrastructure/repository/clubRepository";
import FixtureRepository from "../infrastructure/repository/fixtureRepository";
import StadiumRepository from "../infrastructure/repository/stadiumRepository";

class FixtureUseCase {
    private FixtureRepository: FixtureRepository;
    private ClubRepository: ClubRepository;
    private StadiumRepository: StadiumRepository;
    constructor(FixtureRepository: FixtureRepository, ClubRepository: ClubRepository
        , StadiumRepository: StadiumRepository
    ) {
        this.FixtureRepository = FixtureRepository;
        this.ClubRepository = ClubRepository;
        this.StadiumRepository = StadiumRepository;
    }

    async fixtureContent(date: Date, clubId: string) {
        let allFixtures = await this.FixtureRepository.findAllFixtures();
        let allClubs = await this.ClubRepository.findAllClubs();
        let allTimes = await this.StadiumRepository.findAllTime();

        if (allClubs) allClubs = allClubs.filter((club: any) => club._id != clubId.toString());

        if (allFixtures) allFixtures = allFixtures.filter((fixture: any) => fixture.date == date);
        if (allTimes) allTimes = allTimes.filter((time: any) => new Date(time.showDate) <= new Date(date));

        if (allFixtures.length) {
            allFixtures.forEach((fixture: any) => {
                if (allClubs && fixture.awayTeamId) {
                    allClubs = allClubs.filter((club: any) => (
                        club._id != fixture.awayTeamId
                    ));
                }
                if (allTimes) {
                    allTimes = allTimes.filter((time: any) => time.time != fixture.time);
                }
            });
        }

        if (!allTimes || allTimes.length < 1) {
            return {
                status: 200,
                data: false
            };
        }
        return {
            status: 200,
            data: { times: allTimes, clubs: allClubs }
        };
    }
}

export default FixtureUseCase;
