import Fixture from "../domain/fixture";
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
        // console.log(allFixtures);

        let allClubs = await this.ClubRepository.findAllClubs();
        let allTimes = await this.StadiumRepository.findAllTime();

        if (allClubs) allClubs = allClubs.filter((club: any) => club._id != clubId.toString());

        if (allTimes) allTimes = allTimes.filter((time: any) => new Date(time.showDate) <= new Date(date));


        //converting incoming date for checking
        const formDate = new Date(date);
        const validateDate = formDate.toISOString().split('T')[0];

        if (allFixtures) allFixtures = allFixtures.filter((fixture: any) => {
            //converting fixture date for checking
            const fixtureDate = new Date(fixture.date);
            const searchDate = fixtureDate.toISOString().split('T')[0];
            return searchDate == validateDate;
        });

        if (allFixtures.length) {
            allFixtures.forEach((fixture: any) => {
                if (allClubs && fixture.awayTeamId && fixture.awayTeamId._id && fixture.status == "active") {
                    allClubs = allClubs.filter((club: any) => {
                        club._id.toString() != fixture.awayTeamId._id.toString();
                    });
                }

                if (allTimes && fixture.status == "active") {
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

    async addNewFixture(data: Fixture) {
        if (data.awayTeamId) {
            const club = await this.ClubRepository.findById(data.awayTeamId);
            if (!club) {
                return {
                    status: 400,
                    data: { message: 'Select a valid club!' }
                };
            }
            const fixture = {
                ...data,
                awayTeam: club.name,
                awayTeamLogo: club.image,
                clubId: data.clubId
            };
            const newFixture = await this.FixtureRepository.saveFixture(fixture);
            return {
                status: 200,
                data: newFixture
            };
        } else {
            const fixture = {
                ...data,
                clubId: data.clubId
            };
            const newFixture = await this.FixtureRepository.saveFixture(fixture);
            return {
                status: 200,
                data: newFixture
            };
        }
    }

    async clubFixtures(id: string) {
        const fixtures = await this.FixtureRepository.findFixturesByClubId(id);
        return {
            status: 200,
            data: fixtures
        };
    }

    async cancelFixture(id: string) {
        const cancelled = await this.FixtureRepository.findFixtureByIdAndCancel(id);
        if (cancelled) {
            return {
                status: 200,
                data: 'Fixture has been cancelled!'
            };
        } else {
            return {
                status: 400,
                data: 'Invalid fixture'
            };
        }
    }
}

export default FixtureUseCase;
