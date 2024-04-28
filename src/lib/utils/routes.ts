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
        add: 'api/cart/add',
        get: 'api/cart/get',
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
