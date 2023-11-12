import Fixture from "../../domain/fixture";

interface FixtureRepo {
    findAllFixtures(): Promise<{}[]>;
    saveFixture(fixture: Fixture): Promise<any>;
    findFixturesByClubId(id: string): Promise<{}[]>;
    findFixtureByIdAndCancel(id: string): Promise<boolean>;
    findByIdNotCancelled(id: string): Promise<any | null>;
}

export default FixtureRepo;
