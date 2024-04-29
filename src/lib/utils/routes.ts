export const api = {
    user: {
        auth: 'api/user/auth',
        create: 'api/user/create',
        get: 'api/user/get',
        logout: 'api/user/logout',
        edit: 'api/user/edit',
    },
    article: {
        create: 'api/article/create',
        get: 'api/article/get',
    },
    cart: {
        put: 'api/cart/put',
        get: 'api/cart/get',
        remove: 'api/cart/remove',
    },
};

export const pages = {
    home: '/overview',
    login: '/login',
    cart: '/cart',
    register: '/register',
    article: '/article',
    profile: '/profile',
};
