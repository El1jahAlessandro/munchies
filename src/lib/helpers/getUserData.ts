import prisma from '@/lib/utils/prisma';

export async function getUserById(id: string) {
    return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
}
