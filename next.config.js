const dotenv = require("dotenv");
const isDev = process.env.NODE_ENV !== "production";

const envFile = isDev ? `.env.${process.env.NODE_ENV}` : ".env";
dotenv.config({ path: envFile });

const withSass = require("@zeit/next-sass");

module.exports = withSass({
    env: {
        BRANCH: process.env.BRANCH,
        URL: process.env.URL
    },
    cssModules: true,
    cssLoaderOptions: {
        importLoaders: 1,
        localIdentName: "[local]__[hash:base64:5]"
    }
});
