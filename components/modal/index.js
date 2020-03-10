import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import style from "./style.scss";

const Modal = ({
    title,
    nameModal,
    openModal,
    openModalCreateEvent,
    children,
}) => (
    <div
        className={style.modalAddEventContainer}
        style={{ display: `${openModal ? "block" : "none"}` }}
    >
        <div className={style.modalContainer}>
            <header>
                {title}
                <FontAwesomeIcon
                    width="15"
                    icon={faTimes}
                    onClick={() => openModalCreateEvent(false, nameModal)}
                />
            </header>

            <div className={style.formContainer}>{children}</div>
        </div>
    </div>
);

Modal.propTypes = {
    title: PropTypes.string,
    nameModal: PropTypes.string,
    openModal: PropTypes.bool,
    openModalCreateEvent: PropTypes.func,
    children: PropTypes.node.isRequired,
};

export default Modal;
