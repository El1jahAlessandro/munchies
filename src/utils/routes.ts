export const api = {
    user: {
        auth: 'api/user/auth',
        create: 'api/user/create',
    },
    article: {
        create: 'api/article/create',
        get: {
            all: 'api/article/get/all',
            byId: 'api/article/get/byId',
        },
    },
};

export const pages = {
    login: '/login',
    register: '/register',
    article: '/article',
};
