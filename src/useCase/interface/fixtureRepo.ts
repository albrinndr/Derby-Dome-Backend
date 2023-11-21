import Fixture from "../../domain/fixture";

interface FixtureRepo {
    findAllFixtures(): Promise<{}[]>;
    saveFixture(fixture: Fixture): Promise<any>;
    findFixturesByClubId(id: string): Promise<{}[]>;
    findFixtureByIdAndCancel(id: string): Promise<boolean>;
    findByIdNotCancelled(id: string): Promise<any | null>;
    updateNormalSeats(fixtureId: string, stand: string, section: string, row: string, count: number, seats: number[]): Promise<any>;
    updateVipSeats(fixtureId: string, stand: string, row: string, count: number, seats: number[]): Promise<any>;
    updateSeatsOnCancel(fixtureId: string, stand: string, section: string, row: string, count: number, seats: number[]): Promise<boolean>;
}

export default FixtureRepo;
