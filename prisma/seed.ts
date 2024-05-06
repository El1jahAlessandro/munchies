import { Article, PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import indian from '../json/Indisch.json';
import dessert from '../json/Dessert.json';
import asian from '../json/Asia.json';

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
            profilePic: 'munchies/Profile Pictures/cz7weri7fwvqzr65vxez',
            accountType: 'business',
            article: {
                create: {
                    name: 'Chicken Nuggets',
                    price: 7.99,
                    picture: 'munchies/Article Pictures/walehfagakg9jc38ey40',
                    ingredients: 'Chicken',
                    description: 'Ein Chicken',
                },
            },
        },
        include: {
            article: true,
        },
    });

    const indianFoodCategory = await createCategory('indisch', 'pepper', await createArticles(indian, mcDonalds.id));
    const asianFoodCategory = await createCategory('asiatisch', 'sushi', await createArticles(asian, mcDonalds.id));
    const dessertFoodCategory = await createCategory(
        'dessert',
        'chocolate',
        await createArticles(dessert, mcDonalds.id)
    );
    const fastFoodCategory = await createCategory('fastfood', 'hamburger', mcDonalds.article);

    console.log({ max, mcDonalds, indianFoodCategory, asianFoodCategory, dessertFoodCategory, fastFoodCategory });
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
