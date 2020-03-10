import React from "react";
import PropTypes from "prop-types";

import Head from "next/head";

const HeadCustom = ({ share }) => (
    <Head>
        <meta
            property="og:url"
            content={`${process.env.URL}${
                share && share._id ? "/coffee/" + share._id : ""
            }`}
        />
        <meta property="og:title" content="Damián Catanzaro | Cafecito" />
        <meta name="og:description" content="" />
        <meta property="og:site_name" content="Cafecito" />

        {share && share._id && (
            <meta
                property="og:image"
                content={`${process.env.URL}/imagesCoffee/${share._id}.png`}
            />
        )}

        <meta property="og:type" content="website" />
        <meta name="robots" content="noodp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@DamianCatanzaro" />
        <meta property="twitter:title" content="Damián Catanzaro | Cafecito" />
        <meta name="twitter:creator" content="@DamianCatanzaro" />
        <meta name="twitter:description" content="" />

        {share && share._id && (
            <meta
                name="twitter:image"
                content={`${process.env.URL}/imagesCoffee/${share._id}.png`}
            />
        )}

        <meta itemProp="name" content="Damián Catanzaro | Cafecito" />
        <meta itemProp="description" content="" />

        {share && share._id && (
            <meta
                itemProp="image"
                content={`${process.env.URL}/imagesCoffee/${share._id}.png`}
            />
        )}
    </Head>
);

HeadCustom.propTypes = {
    share: PropTypes.object,
};

export default HeadCustom;
