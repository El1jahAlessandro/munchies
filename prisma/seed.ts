import { Article, PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import indian from '../json/Indisch.json';

type CategoryArticlesPropsType = {
    name: string;
    description: string;
    ingredients: string[];
    picture: string;
    price: number;
};

const prisma = new PrismaClient();

async function main() {
    async function createArticles(categoryArticles: CategoryArticlesPropsType[], userId: number) {
        return await Promise.all(
            categoryArticles.map(food => {
                return prisma.article.create({
                    data: {
                        ...food,
                        ingredients: food.ingredients.join(', '),
                        userId,
                    },
                });
            })
        );
    }

    async function createCategory(name: string, icon: string, articles: Article[]) {
        return prisma.categories.create({
            data: {
                name,
                icon,
                ArticleCategories: {
                    createMany: {
                        data: articles.map(article => {
                            return {
                                articleId: article.id,
                            };
                        }),
                    },
                },
            },
        });
    }

    const max = await prisma.user.create({
        data: {
            email: 'max.mustermann@gmail.com',
            name: 'Max Mustermann',
            password: await bcrypt.hash('test123', await bcrypt.genSalt()),
            accountType: 'user',
        },
    });

    const mcDonalds = await prisma.user.create({
        data: {
            email: 'ronald.mcdonald@gmail.com',
            name: 'McDonalds',
            password: await bcrypt.hash('test123', await bcrypt.genSalt()),
            profilePic:
                'data:image/png;base64,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',
            accountType: 'business',
            article: {
                create: {
                    name: 'Chicken Nuggets',
                    price: 7.99,
                    picture:
                        'data:image/jpeg;base64,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',
                    ingredients: 'Chicken',
                    description: 'Ein Chicken',
                },
            },
        },
        include: {
            article: true,
        },
    });

    const indianFood = await createArticles(indian, mcDonalds.id);

    const indianFoodCategory = await createCategory('indisch', 'pepper', indianFood);
    const fastFoodCategory = await createCategory('fastfood', 'hamburger', mcDonalds.article);

    console.log({ max, mcDonalds, indianFoodCategory, fastFoodCategory });
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
