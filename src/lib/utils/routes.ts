export const api = {
    user: {
        auth: 'api/user/auth',
        create: 'api/user/create',
        get: 'api/user/get',
        edit: 'api/user/edit',
    },
    article: {
        create: 'api/article/create',
        get: 'api/article/get',
    },
    cart: {
        put: 'api/cart/put',
        get: 'api/cart/get',
    },
    order: {
        create: 'api/order/create',
        edit: 'api/order/edit',
    },
};

export const pages = {
    home: '/overview',
    login: '/sign-up',
    cart: '/cart',
    register: '/sign-in',
    article: '/article',
    profile: '/profile',
    orders: '/orders',
};
