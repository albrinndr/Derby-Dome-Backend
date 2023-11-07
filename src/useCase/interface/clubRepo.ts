import Club, { Team } from "../../domain/club";

interface ClubRepo {
    save(club: Club): Promise<Club>;
    findByEmail(email: string): Promise<Club | null>;
    findById(_id: string): Promise<Club | null>;
    findAllClubs(): Promise<{}[] | null>;
    findTeamById(clubId: string): Promise<Team | {}>;
}

export default ClubRepo;
