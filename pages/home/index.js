import React from "react";

import axios from "axios";

import Header from "../../components/header/index";
import InputText from "../../components/inputText/index";
import Coffee from "../../components/coffee/index";
import Post from "../../components/post/index";
import Modal from "../../components/modal/index";

import dayjs from "dayjs";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

import style from "./style.scss";

const fetchCoffees = async query => {
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
    static async getInitialProps({ query }) {
        const externalReference = query.external_reference;

        const coffees = await fetchCoffees(query);

        if (externalReference) {
            const coffee = JSON.parse(externalReference);

            const result = await axios.get(
                `${process.env.URL}/api/get_payment_by_coffe/${coffee.coffeeId}`
            );

            return {
                coffees,
                showThankYou: result.data.showThankYou
            };
        }

        return { coffees, showThankYou: false };
    }

    constructor(props) {
        super(props);

        const { coffees, showThankYou } = this.props;

        this.state = {
            coffees: coffees || [],
            isAdmin: false,
            password: "",
            openModal: showThankYou,
            openModalShare: false,
            prefersDark: "light",
            share: {}
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

    loadNewCoffees = async () => {
        const coffees = await fetchCoffees();

        this.setState({ coffees });
    };

    componentDidMount() {
        const arQueries = queryConvert();

        this.setState({
            isAdmin: arQueries.isAdmin,
            password: arQueries.password
        });
    }

    openModalCreateEvent = status => {
        this.setState({
            openModal: status
        });
    };

    shareTwitter = () => {
        window.open(
            "https://twitter.com/intent/tweet?text=https://cafecito.damiancatanzaro.com/",
            "targetWindow",
            "toolbar=no,location=0,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=250"
        );
        return false;
    };

    copyLink = () => {
        const linkToGo = "huehue";

        if (typeof navigator.clipboard == "undefined") {
            var textArea = document.createElement("textarea");
            textArea.value = linkToGo;
            textArea.style.position = "fixed"; //avoid scrolling to bottom
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                document.execCommand("copy");
            } catch (err) {}

            document.body.removeChild(textArea);
            return;
        }

        navigator.clipboard.writeText(linkToGo);
    };

    setShare = coffee => {
        this.setState({
            share: coffee,
            openModalShare: true
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
            share
        } = this.state;

        const { SHOW_DATE_COFFEE } = process.env;

        return (
            <>
                <Header
                    countCoffees={coffees.countCoffees}
                    prefersDark={prefersDark}
                />
                <InputText />

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
                            <span className={style.text}>
                                Me sorprendió como tus side projects (y la
                                calidad de estos) motivan a uno a ponerle más
                                pilas para aprender/practicar. Un genio. Saludos
                                desde Misiones.
                            </span>
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
                            <FontAwesomeIcon icon={faTwitter} /> Twitter
                        </button>
                        <button
                            className={style.buttonCopy}
                            onClick={() => this.copyLink()}
                        >
                            <FontAwesomeIcon icon={faCopy} /> Copiar Link
                        </button>
                    </div>
                </Modal>
            </>
        );
    }
}

export default Home;
