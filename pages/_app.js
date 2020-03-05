import Head from "next/head";

import "../styles/style.scss";

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>Cafecito | Damián Catanzaro</title>
            </Head>
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
