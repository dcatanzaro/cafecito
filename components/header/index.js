import React from "react";
import style from "./style.scss";

import { Follow } from "react-twitter-widgets";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon as moonSolid } from "@fortawesome/free-solid-svg-icons";
import { faMoon as moonRegular } from "@fortawesome/free-regular-svg-icons";

class Header extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            darkMode: false
        };
    }

    render() {
        const { darkMode } = this.state;
        const { countCoffees } = this.props;

        return (
            <header className={style.headerContainer}>
                <div className={style.header}>
                    <div className={style.profileImg}></div>
                    <div className={style.informationContainer}>
                        <div className={style.name}>@DamianCatanzaro</div>
                        <div className={style.countCoffees}>
                            {countCoffees} cafecitos ☕️
                        </div>
                    </div>

                    <FontAwesomeIcon
                        icon={darkMode ? moonSolid : moonRegular}
                        className={style.darkMode}
                    />
                </div>

                <div className={style.twitter}>
                    <Follow username="DamianCatanzaro" />
                </div>
            </header>
        );
    }
}

export default Header;
