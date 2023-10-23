import bcrypt from 'bcrypt';
import HashPassword from '../useCase/interface/hashPassword';

class Encrypt implements HashPassword {
    async generateHash(password: string): Promise<string> {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    }

    async compare(password: string, hashedPassword: string): Promise<boolean> {
        const match = await bcrypt.compare(password, hashedPassword);
        return match;
    }
}

export default Encrypt;
