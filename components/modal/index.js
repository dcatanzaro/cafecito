import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import style from "./style.scss";

const Modal = ({ openModal, openModalCreateEvent }) => (
    <div
        className={style.modalAddEventContainer}
        style={{ display: `${openModal ? "block" : "none"}` }}
    >
        <div className={style.modalContainer}>
            <header>
                ¡Gracias!{" "}
                <FontAwesomeIcon
                    icon={faTimes}
                    onClick={() => openModalCreateEvent(false)}
                />
            </header>

            <div className={style.formContainer}>
                OMG! What!? Gracias por haberme ayudado! Lo valoro muchisimo!
                ❤️. Happy coding ✨.
                <img
                    width="100%"
                    src="https://media2.giphy.com/media/vFKqnCdLPNOKc/giphy.gif"
                    alt=""
                />
            </div>
        </div>
    </div>
);

export default Modal;
