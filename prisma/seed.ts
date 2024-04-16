import { prisma } from '@/utils/prisma';
import { getHashedPassword } from '@/helpers/getHashedPassword';

async function main() {
    const max = await prisma.user.create({
        data: {
            email: 'max.mustermann@gmail.com',
            forename: 'Max',
            lastname: 'Mustermann',
            password: await getHashedPassword('test123'),
            accountType: 'user',
        },
    });

    const categories = await prisma.articleCategories.createMany({
        data: ['dessert', 'drinks', 'pizza', 'indian', 'pasta', 'burger', 'salad', 'asian'].map(category => {
            return {
                name: category,
                icon: '',
            };
        }),
    });

    const article = await prisma.article.create({
        data: {
            name: 'Weißbrotschnitzel',
            price: 19.99,
            picture: '',
            description: 'Ein Weißbrotschnitzel',
            ingredients: 'Mehl, Fleisch, Eier',
            articleCategoriesId: 1,
            userId: max.id,
        },
    });

    console.log({ max, categories, article });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async e => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
