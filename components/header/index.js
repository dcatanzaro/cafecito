import React from "react";
import style from "./style.scss";

import { Follow } from "react-twitter-widgets";

class Header extends React.Component {
    render() {
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
                </div>

                <div className={style.twitter}>
                    <Follow username="DamianCatanzaro" />
                </div>
            </header>
        );
    }
}

export default Header;
