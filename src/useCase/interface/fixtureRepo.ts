interface FixtureRepo {
    findAllFixtures(): Promise<{}[]>;
}

export default FixtureRepo;
