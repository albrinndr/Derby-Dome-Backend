import Fixture from "../domain/fixture";
import ClubRepository from "../infrastructure/repository/clubRepository";
import FixtureRepository from "../infrastructure/repository/fixtureRepository";
import PaymentRepository from "../infrastructure/repository/paymentRepository";
import StadiumRepository from "../infrastructure/repository/stadiumRepository";

class FixtureUseCase {
    private FixtureRepository: FixtureRepository;
    private ClubRepository: ClubRepository;
    private StadiumRepository: StadiumRepository;
    private PaymentRepository: PaymentRepository;
    constructor(FixtureRepository: FixtureRepository, ClubRepository: ClubRepository
        , StadiumRepository: StadiumRepository, PaymentRepository: PaymentRepository
    ) {
        this.FixtureRepository = FixtureRepository;
        this.ClubRepository = ClubRepository;
        this.StadiumRepository = StadiumRepository;
        this.PaymentRepository = PaymentRepository;
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


        const clubXIExists = await this.ClubRepository.findTeamPlayerCount(clubId);


        if (!allTimes || allTimes.length < 1) {
            return {
                status: 200,
                data: false
            };
        }
        return {
            status: 200,
            data: { times: allTimes, clubs: allClubs, team: clubXIExists }
        };
    }

    async paymentGenerate(data: Fixture) {
        if (data.awayTeamId) {
            const club = await this.ClubRepository.findById(data.awayTeamId);
            if (!club) {
                return {
                    status: 400,
                    data: { message: 'Select a valid club!' }
                };
            } else {
                const price = data.price || 100;
                const fixtureName = `${data.title} against ${club.name} at ${data.time}`;

                const stripeId = await this.PaymentRepository.confirmPayment(price, fixtureName);

                return {
                    status: 200,
                    data: { stripeSessionId: stripeId }
                };
            }
        } else {
            const price = data.price || 100;
            const fixtureName = `${data.title} against ${data.awayTeam} at ${data.time}`;

            const stripeId = await this.PaymentRepository.confirmPayment(price, fixtureName);

            return {
                status: 200,
                data: { stripeSessionId: stripeId }
            };
        }
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
            let checkDate = new Date();
            checkDate.setDate(checkDate.getDate() + 2);
            const fixture = {
                ...data,
                awayTeam: club.name,
                awayTeamLogo: club.image,
                clubId: data.clubId,
                checkDate: checkDate
            };
            const newFixture = await this.FixtureRepository.saveFixture(fixture);

            return {
                status: 200,
                // data: newFixture
                data: newFixture
            };
        } else {
            let checkDate = new Date();
            checkDate.setDate(checkDate.getDate() + 2);
            const fixture = {
                ...data,
                clubId: data.clubId,
                checkDate: checkDate
            };
            const newFixture = await this.FixtureRepository.saveFixture(fixture);

            return {
                status: 200,
                // data: newFixture
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
