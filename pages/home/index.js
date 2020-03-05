import React from "react";

import axios from "axios";

import Header from "../../components/header/index";
import InputText from "../../components/inputText/index";
import Coffee from "../../components/coffee/index";
import Post from "../../components/post/index";
import Modal from "../../components/modal/index";

import style from "./style.scss";

const isDev = process.env.NODE_ENV !== "production";

const fetchCoffees = async query => {
    const arQueries = query || queryConvert();

    const url = `${process.env.URL}/api/coffees?password=${arQueries.password}`;

    const coffees = await axios.get(url);

    return coffees.data;
};

const queryConvert = () => {
    var queryStr = window.location.search,
        queryArr = queryStr.replace("?", "").split("&"),
        queryParams = [];

    for (var q = 0, qArrLength = queryArr.length; q < qArrLength; q++) {
        var qArr = queryArr[q].split("=");
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

            return { coffees, showThankYou: result.data.showThankYou };
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
            openModal: showThankYou
        };
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

    render() {
        const { coffees, isAdmin, password, openModal } = this.state;

        return (
            <>
                <Header />
                <InputText />

                <h3 className={style.titleDescription}>Descripción</h3>

                <Post />

                <h3 className={style.title}>Cafés</h3>
                {coffees.map((coffee, key) => (
                    <Coffee
                        isAdmin={isAdmin}
                        password={password}
                        key={key}
                        coffee={coffee}
                        loadNewCoffees={this.loadNewCoffees}
                    />
                ))}

                {!coffees.length && (
                    <div className={style.waitingCoffee}>
                        <span>En espera ☕️</span>
                    </div>
                )}

                <Modal
                    openModal={openModal}
                    openModalCreateEvent={this.openModalCreateEvent}
                />

                <script
                    async
                    src="https://www.googletagmanager.com/gtag/js?id=UA-28173560-28"
                ></script>

                <script
                    dangerouslySetInnerHTML={{
                        __html: `window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());

                                gtag('config', 'UA-28173560-28');`
                    }}
                ></script>
            </>
        );
    }
}

export default Home;
