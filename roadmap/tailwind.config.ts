import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          450: '#727af4',
          650: '#493fe6',
        },
        slate: {
          55: '#f4f7fa',
          450: '#7c8ba1',
        },
        orange: {
          850: '#9e370f',
        },
      },
    },
  },
  plugins: [],
};

export default config;
