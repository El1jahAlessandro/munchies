import prisma from '@/lib/utils/prisma';
import { getUserInputArgs } from '@/lib/schemas/user.schema';

export async function getUserById(id: string) {
    return prisma.user.findUnique({ where: { id }, ...getUserInputArgs });
}

export async function getUserByClerkId(clerkId: string) {
    return prisma.user.findUnique({ where: { clerkId }, ...getUserInputArgs });
}

export async function getUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email }, ...getUserInputArgs });
}
