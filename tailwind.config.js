/** @type {Theme | {readonly default: Theme}} */
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
        colors: {
            primary: {
                main: '#00a023',
            },
            secondary: {
                main: '#9796A1',
            },
            error: {
                main: '#d32f2f',
            },
            white: '#ffffff',
            black: '#000000',
            'traffic-white': '#F6F6F6',
        },
        extend: {},
    },
    plugins: [],
};
