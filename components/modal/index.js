import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import style from "./style.scss";

const Modal = ({ title, openModal, openModalCreateEvent, children }) => (
    <div
        className={style.modalAddEventContainer}
        style={{ display: `${openModal ? "block" : "none"}` }}
    >
        <div className={style.modalContainer}>
            <header>
                {title}
                <FontAwesomeIcon
                    icon={faTimes}
                    onClick={() => openModalCreateEvent(false)}
                />
            </header>

            <div className={style.formContainer}>{children}</div>
        </div>
    </div>
);

Modal.propTypes = {
    openModal: PropTypes.bool,
    openModalCreateEvent: PropTypes.func,
};

export default Modal;
