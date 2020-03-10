import style from "./style.scss";
import React from "react";
import { Follow } from "react-twitter-widgets";

const Header = () => (
    <header className={style.headerContainer}>
        <div className={style.header}>
            <div className={style.profileImg}></div>
            <div className={style.name}>@DamianCatanzaro</div>
        </div>

        <div className={style.twitter}>
            <Follow username="DamianCatanzaro" />
        </div>
    </header>
);

export default Header;
