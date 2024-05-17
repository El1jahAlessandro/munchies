/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
    corePlugins: {
        preflight: false,
    },
    content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
    prefix: '',
    theme: {
        extend: {},
    },
    plugins: [],
};

export default tailwindConfig;
