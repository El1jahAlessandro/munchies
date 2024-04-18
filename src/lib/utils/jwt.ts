import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '@prisma/client';
import { pick } from 'lodash';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { AuthorizationTokenSchema } from '@/lib/schemas/common.schema';

type SignOption = {
    expiresIn?: string | number;
};

export const cookieOptions: Partial<ResponseCookie> = {
    sameSite: 'strict',
    expires: new Date(Date.now() + 12 * 60 * 60 * 1000),
};

export function createToken(
    payload: JwtPayload,
    options: SignOption = {
        expiresIn: '12h',
    }
) {
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
        throw new Error('No JWT Secret Key');
    }
    return jwt.sign(payload, secretKey, options);
}

export function verifyToken(token: string | undefined) {
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
        throw new Error('No JWT Secret Key');
    }
    if (token) {
        return jwt.verify(token, secretKey);
    }
}

export function tokenExpired(token: string) {
    const decode = jwt.decode(token, { json: true });
    if (!decode) {
        throw new Error('Cannot Decode JWT Token');
    }
    return decode.exp! > Date.now();
}

export function createAuthorizationToken(user: User) {
    return createToken({
        ...pick(user, AuthorizationTokenSchema.keyof().options),
    });
}
