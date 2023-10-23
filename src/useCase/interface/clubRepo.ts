import Club from "../../domain/club";

interface ClubRepo {
    save(club: Club): Promise<Club>;
    findByEmail(email: string): Promise<Club | null>;
    findById(_id: string): Promise<Club | null>;
    findAllClubs(): Promise<{}[] | null>;
}

export default ClubRepo;
