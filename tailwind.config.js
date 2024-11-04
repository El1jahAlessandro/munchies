const colors = require('./json/colors.json');
/** @type {Theme | {readonly default: Theme}} */
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
        colors: colors,
        extend: {},
    },
    plugins: [],
};
