import { AccountType, PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import alpensteigUser from '../json/companies/Alpensteig.json';
import asiaPerleUser from '../json/companies/AsiaPerle.json';
import tajMahalUser from '../json/companies/TajMahal.json';
import veneziaUser from '../json/companies/Venezia.json';
import categories from '../json/categories.json';
import { compact, omit } from 'lodash';

const prisma = new PrismaClient();

async function main() {
    async function createCategories(input: typeof categories) {
        return await Promise.all(
            input.map(category => {
                return prisma.categories.create({
                    data: category,
                });
            })
        );
    }

    const articleCategories = await createCategories(categories);

    async function createUser(
        input: Omit<typeof alpensteigUser, 'articles'> & {
            accountType?: AccountType;
            articles?: (typeof alpensteigUser)['articles'] | undefined;
            profilePic?: string | undefined;
        }
    ) {
        const createdUser = await prisma.user.create({
            data: {
                ...omit(input, 'articles'),
                password: await bcrypt.hash('test123', await bcrypt.genSalt()),
                profilePic: input.profilePic ?? '',
                accountType: input.accountType ?? 'business',
                ...(input.articles
                    ? {
                          article: {
                              createMany: {
                                  data: input.articles.map(article => ({
                                      ...omit(article, ['category']),
                                      ingredients: article.ingredients.join(', '),
                                  })),
                              },
                          },
                      }
                    : {}),
            },
            include: {
                article: true,
            },
        });

        if (createdUser && createdUser.article) {
            await Promise.all(
                createdUser.article.map(async article => {
                    const categories = compact(
                        input.articles?.find(inputArticles => inputArticles.name === article.name)?.category
                    );

                    const data = compact(
                        categories?.map(category => {
                            const categoryId = articleCategories.find(
                                articleCategory => category === articleCategory.ref
                            )?.id;
                            const articleId = article.id;
                            if (categoryId) {
                                return {
                                    categoryId,
                                    articleId,
                                };
                            }
                        })
                    );

                    if (data.length && categories.length) {
                        await prisma.articleCategories.createMany({
                            data: data,
                        });
                    }
                })
            );
        }

        return createdUser;
    }

    const max = await createUser({
        email: 'max.mustermann@gmail.com',
        name: 'Max Mustermann',
        accountType: 'user',
        profilePic: '',
        articles: [],
    });

    const alpensteig = await createUser(alpensteigUser);
    const asienPerle = await createUser(asiaPerleUser);
    const tajMahal = await createUser(tajMahalUser);
    const venezia = await createUser(veneziaUser);

    console.log({
        max,
        alpensteig,
        asienPerle,
        tajMahal,
        venezia,
    });
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
