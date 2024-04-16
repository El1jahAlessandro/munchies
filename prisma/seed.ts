import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const categoryData = ['dessert', 'drinks', 'pizza', 'indian', 'pasta', 'burger', 'salad', 'asian'];

const articleData = [
    {
        name: 'Weißbrotschnitzel',
        price: 19.99,
        picture: '',
        description: 'Ein Weißbrotschnitzel',
        ingredients: 'Mehl, Fleisch, Eier',
        articleCategoriesId: 1,
    },
    {
        name: 'Döner',
        price: 3,
        picture: '',
        description: 'Ein Weißbrotschnitzel',
        ingredients: 'Mehl, Fleisch, Eier',
        articleCategoriesId: 1,
    },
    {
        name: 'Pommes',
        price: 2,
        picture: '',
        description: 'Ein Weißbrotschnitzel',
        ingredients: 'Mehl, Fleisch, Eier',
        articleCategoriesId: 1,
    },
    {
        name: 'Wiener Schnitzel',
        price: 17,
        picture: '',
        description: 'Ein Weißbrotschnitzel',
        ingredients: 'Mehl, Fleisch, Eier',
        articleCategoriesId: 1,
    },
];

async function main() {
    const max = await prisma.user.create({
        data: {
            email: 'max.mustermann@gmail.com',
            forename: 'Max',
            lastname: 'Mustermann',
            password: await bcrypt.hash('test123', await bcrypt.genSalt()),
            accountType: 'user',
        },
    });

    const categories = await prisma.articleCategories.createMany({
        data: categoryData.map(category => {
            return {
                name: category,
                icon: '',
            };
        }),
    });

    const article = await prisma.article.createMany({
        data: articleData.map(article => {
            return {
                ...article,
                userId: max.id,
            };
        }),
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
