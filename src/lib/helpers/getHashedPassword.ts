import bcrypt from 'bcryptjs';

export async function getHashedPassword(password: string) {
    return bcrypt.hash(password, await bcrypt.genSalt());
}
