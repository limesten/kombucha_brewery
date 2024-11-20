import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                "creamy-white": "var(--creamy-white)",
                "soft-stone": "var(--soft-stone)",
                "sage-green": "var(--sage-green)",
                "blush-sand": "var(--blush-sand)",
                "warm-taupe": "var(--warm-taupe)",
                "golden-straw": "var(--golden-straw)",
                "earthy-clay": "var(--earthy-clay)",
                "smoky-grey": "var(--smoky-grey)",
                "slate-grey": "var(--slate-grey)",
                "moss-green": "var(--moss-green)",
                "forest-night": "var(--forest-night)",
                "charcoal-grey": "var(--charcoal-grey)",
            },
        },
    },
    plugins: [],
} satisfies Config;
