import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import CoffePicker from "../../components/coffeePicker";

import styles from "./style.scss";

const COFFEE_PRICE = 50;

const ProfileImg = ({ imgSrc }) => (
    <div className={styles.profileImg}>
        <img src={imgSrc} alt="profile-img" />
    </div>
);

const RedirectIcon = ({ url }) => (
    <a href={url} className={styles.redirect}>
        <img src="/imgs/redirect-icon.svg" alt="redirect-icon" />
    </a>
);

class CustomCoffee extends Component {
    static async getInitialProps({ query }) {
        const title = query.title || "";
        const description = query.description || "";
        const message = query.message || "";

        return { title, description, message };
    }

    static propTypes = {
        title: PropTypes.string,
        description: PropTypes.string,
        message: PropTypes.string,
    };

    constructor(props) {
        super(props);

        const { title, description, message } = props;

        this.state = {
            title,
            description,
            message,
            name: "",
            countCoffees: 1,
            loading: true,
        };
    }

    sendCoffee = async () => {
        const { name, message, countCoffees } = this.state;

        this.setState({
            loading: true,
        });

        const url = `${process.env.URL}/api/send_coffee`;

        const result = await axios.post(url, {
            name,
            message,
            countCoffees: countCoffees || 1,
        });

        window.location.href = result.data.mercadoPagoLink;
    };

    setCount = value => {
        this.setState({
            countCoffees: value < 1 ? 1 : value,
        });
    };

    handleFormChange = e => {
        this.setState({
            name: e.target.value,
        });
    };

    render() {
        const { countCoffees, name, title, description } = this.state;

        return (
            <div className={styles.main}>
                <div className={styles.modalContainer}>
                    <RedirectIcon url="/" />

                    <ProfileImg imgSrc="https://avatars2.githubusercontent.com/u/43894343?s=460&v=4" />

                    <h1 className={styles.title}>{title}</h1>
                    <h3 className={styles.description}>{description}</h3>

                    <CoffePicker
                        countCoffees={countCoffees}
                        setCount={this.setCount}
                    />

                    <input
                        className={styles.input}
                        placeholder="Nombre o @Twitter (opcional)"
                        value={name}
                        onChange={this.handleFormChange}
                        type="text"
                    />
                    <button className={styles.submit} onClick={this.sendCoffee}>
                        Invitame 1 café (${countCoffees * COFFEE_PRICE})
                    </button>
                </div>
            </div>
        );
    }
}

ProfileImg.propTypes = {
    imgSrc: PropTypes.string,
};

RedirectIcon.propTypes = {
    url: PropTypes.string,
};

export default CustomCoffee;
