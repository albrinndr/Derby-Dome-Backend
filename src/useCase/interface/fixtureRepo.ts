import Fixture from "../../domain/fixture";

interface FixtureRepo {
    findAllFixtures(): Promise<{}[]>;
    saveFixture(fixture: Fixture): Promise<any>;
}

export default FixtureRepo;
