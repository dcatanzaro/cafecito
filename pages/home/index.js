import React from "react";
import PropTypes from "prop-types";
import axios from "axios";

import HeadCustom from "../../components/headCustom/index";
import Header from "../../components/header/index";
import InputText from "../../components/inputText/index";
import Coffee from "../../components/coffee/index";
import Post from "../../components/post/index";
import Modal from "../../components/modal/index";

import dayjs from "dayjs";
import MobileDetect from "mobile-detect";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

import style from "./style.scss";

const fetchCoffees = async (query) => {
    const arQueries = query || queryConvert();

    const url = `${process.env.URL}/api/coffees?password=${arQueries.password}`;

    const coffees = await axios.get(url);

    return coffees.data;
};

const queryConvert = () => {
    const queryStr = window.location.search,
        queryArr = queryStr.replace("?", "").split("&"),
        queryParams = [];

    for (let q = 0, qArrLength = queryArr.length; q < qArrLength; q++) {
        const qArr = queryArr[q].split("=");
        queryParams[qArr[0]] = qArr[1];
    }

    return queryParams;
};

class Home extends React.Component {
    static async getInitialProps({ req, query }) {
        const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;

        const externalReference = query.external_reference;

        const coffees = await fetchCoffees(query);

        if (externalReference) {
            const coffee = JSON.parse(externalReference);

            const result = await axios.get(
                `${process.env.URL}/api/get_payment_by_coffe/${coffee.coffeeId}`
            );

            return {
                coffees,
                showThankYou: result.data.showThankYou,
                query,
                userAgent,
            };
        }

        return { coffees, showThankYou: false, query, userAgent };
    }

    constructor(props) {
        super(props);

        const { coffees, showThankYou, query } = this.props;

        let coffeeShare = "";

        if (query.coffee === "coffee" && query.id) {
            coffeeShare = coffees.coffees.find((coffee) => {
                if (coffee._id == query.id) {
                    return coffee;
                }
            });
        }

        this.state = {
            coffees: coffees || [],
            isAdmin: false,
            password: "",
            openModal: showThankYou,
            openModalShare: coffeeShare && coffeeShare._id ? true : false,
            prefersDark: "light",
            share: coffeeShare || {},
        };

        if (process.browser) {
            const localStorageDarkMode = window.localStorage.getItem(
                "darkMode"
            );

            if (localStorageDarkMode) {
                this.state.prefersDark = localStorageDarkMode;
            } else {
                const prefersDark = window.matchMedia(
                    "(prefers-color-scheme: dark)"
                ).matches;

                this.state.prefersDark = prefersDark ? "dark" : "light";
            }
        }
    }

    static propTypes = {
        coffees: PropTypes.object,
        showThankYou: PropTypes.bool,
        query: PropTypes.object,
        userAgent: PropTypes.string,
    };

    loadNewCoffees = async () => {
        const coffees = await fetchCoffees();

        this.setState({ coffees });
    };

    componentDidMount() {
        const arQueries = queryConvert();

        this.setState({
            isAdmin: arQueries.isAdmin,
            password: arQueries.password,
        });
    }

    openModalCreateEvent = (status, type) => {
        this.setState({
            [type]: status,
        });
    };

    shareTwitter = () => {
        const { share } = this.state;
        const linkToGo = `${process.env.URL}/coffee/${share._id}`;

        window.open(
            `https://twitter.com/intent/tweet?text=${linkToGo}`,
            "targetWindow",
            "toolbar=no,location=0,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=250"
        );
        return false;
    };

    copyLink = () => {
        const { share } = this.state;
        const linkToGo = `${process.env.URL}/coffee/${share._id}`;

        if (typeof navigator.clipboard == "undefined") {
            const textArea = document.createElement("textarea");
            textArea.value = linkToGo;
            textArea.style.position = "fixed";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            document.execCommand("copy");

            document.body.removeChild(textArea);
            return;
        }

        navigator.clipboard.writeText(linkToGo);
    };

    setShare = (coffee) => {
        this.setState({
            share: coffee,
            openModalShare: true,
        });
    };

    render() {
        const {
            coffees,
            isAdmin,
            password,
            openModal,
            openModalShare,
            prefersDark,
            share,
        } = this.state;

        const { userAgent } = this.props;

        const { SHOW_DATE_COFFEE } = process.env;

        const md = new MobileDetect(userAgent);

        return (
            <>
                <HeadCustom share={share} />
                <Header
                    countCoffees={coffees.countCoffees}
                    prefersDark={prefersDark}
                />
                <InputText isMobile={md.mobile()} />

                <h3 className={style.titleDescription}>Descripción</h3>

                <Post />

                <h3 className={style.title}>Cafés</h3>
                {coffees.coffees.map((coffee, key) => (
                    <Coffee
                        setShare={this.setShare}
                        isAdmin={isAdmin}
                        password={password}
                        key={key}
                        coffee={coffee}
                        loadNewCoffees={this.loadNewCoffees}
                    />
                ))}

                {!coffees.countCoffees && (
                    <div className={style.waitingCoffee}>
                        <span>En espera ☕️</span>
                    </div>
                )}

                <Modal
                    title="¡Gracias!"
                    openModal={openModal}
                    nameModal="openModal"
                    openModalCreateEvent={this.openModalCreateEvent}
                >
                    OMG! What!? Gracias por haberme ayudado! Lo valoro
                    muchisimo! ❤️. Happy coding ✨.
                    <img
                        width="100%"
                        src="https://media2.giphy.com/media/vFKqnCdLPNOKc/giphy.gif"
                        alt=""
                    />
                </Modal>

                <Modal
                    title="Compartir"
                    openModal={openModalShare}
                    nameModal="openModalShare"
                    openModalCreateEvent={this.openModalCreateEvent}
                >
                    <div className={style.q}>
                        <div className={style.name}>
                            {share.name ? share.name : "Anónimo"}
                            <span>
                                {` regaló ${share.countCoffees} ${
                                    share.countCoffees > 1 ? "cafés" : "café"
                                }`}
                                {SHOW_DATE_COFFEE &&
                                    ` el ${dayjs(share.createdAt).format(
                                        "DD-MM-YYYY"
                                    )}`}
                            </span>
                        </div>
                        {share.message && (
                            <span className={style.text}>{share.message}</span>
                        )}
                    </div>
                    <div className={style.profile}>
                        <div className={style.profileImg}></div>
                        <span>@DamianCatanzaro</span>
                    </div>

                    <div className={style.buttonShare}>
                        <button
                            className={style.buttonTwitter}
                            onClick={() => this.shareTwitter()}
                        >
                            <FontAwesomeIcon icon={faTwitter} width="14" />{" "}
                            Twitter
                        </button>
                        <button
                            className={style.buttonCopy}
                            onClick={() => this.copyLink()}
                        >
                            <FontAwesomeIcon icon={faCopy} width="14" /> Copiar
                            Link
                        </button>
                    </div>
                </Modal>

                {process.env.GA_ID && (
                    <>
                        <script
                            async
                            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_ID}`}
                        ></script>

                        <script
                            dangerouslySetInnerHTML={{
                                __html: `window.dataLayer = window.dataLayer || [];
                                        function gtag(){dataLayer.push(arguments);}
                                        gtag('js', new Date());

                                        gtag('config', '${process.env.GA_ID}');`,
                            }}
                        ></script>
                    </>
                )}
            </>
        );
    }
}

export default Home;
