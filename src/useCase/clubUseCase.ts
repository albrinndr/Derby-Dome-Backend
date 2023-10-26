import Club from "../domain/club";
import ClubRepository from "../infrastructure/repository/clubRepository";
import JWTToken from "../infrastructure/utils/generateToken";
import Encrypt from "../infrastructure/utils/bcryptPassword";

class ClubUseCase {
    private ClubRepository: ClubRepository;
    private Encrypt: Encrypt;
    private JWTToken: JWTToken;
    constructor(ClubRepository: ClubRepository, Encrypt: Encrypt, JWTToken: JWTToken) {
        this.ClubRepository = ClubRepository;
        this.Encrypt = Encrypt;
        this.JWTToken = JWTToken;
    }

    async signUp(club: Club) {
        const clubExists = await this.ClubRepository.findByEmail(club.email);
        if (clubExists) {
            throw new Error('Club Already Exists!');
        } else {
            const hashedPassword = await this.Encrypt.generateHash(club.password);
            const newClub = { ...club, password: hashedPassword };
            await this.ClubRepository.save(newClub);
            return {
                status: 200,
                data: newClub
            };
        }
    }

    async login(club: Club) {
        const clubData = await this.ClubRepository.findByEmail(club.email);
        let token = '';
        if (clubData) {
            if (clubData.isBlocked){
                return {
                    status: 400,
                    data: {
                        club: 'Club is blocked by admin!',
                        token: ''
                    }
                };
            }
            
            const passwordMatch = await this.Encrypt.compare(club.password, clubData.password);
            if (passwordMatch) {
                const clubId = clubData?._id;
                if (clubId) token = this.JWTToken.generateToken(clubId);
                return {
                    status: 200,
                    data: {
                        club: clubData,
                        token
                    }
                };
            } else {
                return {
                    status: 400,
                    data: {
                        club: 'Invalid email or password!',
                        token: ''
                    }
                };
            }
        } else {
            return {
                status: 400,
                data: {
                    club: 'Invalid email or password!',
                    token: ''
                }
            };
        }
    }
}

export default ClubUseCase;
