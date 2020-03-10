import React, { useState } from "react";
import style from "./style.scss";
import PropTypes from "prop-types";
import axios from "axios";
import dayjs from "dayjs";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";

const Coffee = ({ setShare, coffee, loadNewCoffees, password, isAdmin }) => {
    const [isOpenTextInput, setIsOpenTextInput] = useState(false);
    const [answer, setAnswer] = useState("");

    const openTextInput = () => {
        setIsOpenTextInput(true);
        setAnswer(coffee.answer || "");
    };

    const sendAnswer = async idCoffee => {
        if (!answer.length) {
            return;
        }

        setAnswer("");
        setIsOpenTextInput(false);

        const url = `${process.env.URL}/api/send_answer`;

        await axios.post(url, {
            answer,
            password,
            idCoffee,
        });

        loadNewCoffees();
    };

    const deleteMessage = async idCoffee => {
        const confirmDelete = window.confirm(
            `¿Estás seguro que querés borrar el mensaje?`
        );

        if (confirmDelete) {
            const url = `${process.env.URL}/api/delete_coffee`;

            await axios.post(url, {
                password,
                idCoffee,
            });

            loadNewCoffees();
        }
    };

    const { SHOW_DATE_COFFEE } = process.env;

    return (
        <section className={style.coffeeContainer}>
            <div className={style.coffee}>
                <FontAwesomeIcon
                    icon={faShareAlt}
                    className={style.shareIcon}
                    onClick={() => {
                        console.log(coffee);
                        setShare(coffee);
                    }}
                />

                <div className={style.q}>
                    <div className={style.name}>
                        {coffee.name ? coffee.name : "Anónimo"}
                        <span>
                            {` regaló ${coffee.countCoffees} ${
                                coffee.countCoffees > 1 ? "cafés" : "café"
                            }`}
                            {SHOW_DATE_COFFEE &&
                                ` el ${dayjs(coffee.createdAt).format(
                                    "DD-MM-YYYY"
                                )}`}
                        </span>
                    </div>
                    {coffee.message && (
                        <span className={style.text}>{coffee.message}</span>
                    )}
                </div>
                {coffee.answer && (
                    <div className={style.answer}>{coffee.answer}</div>
                )}
                {isAdmin &&
                    (!isOpenTextInput ? (
                        <div className={style.buttons}>
                            <button onClick={openTextInput}>
                                {!coffee.answer ? "Responder" : "Editar"}
                            </button>
                            <button
                                className={style.dangerButton}
                                onClick={() => deleteMessage(coffee._id)}
                            >
                                Borrar
                            </button>
                        </div>
                    ) : (
                        <>
                            <textarea
                                placeholder="Respuesta"
                                value={answer}
                                onChange={e => {
                                    setAnswer(e.target.value);
                                }}
                            ></textarea>
                            <button onClick={() => sendAnswer(coffee._id)}>
                                Enviar
                            </button>
                        </>
                    ))}
            </div>
        </section>
    );
};

Coffee.propTypes = {
    coffee: PropTypes.shape({
        answer: PropTypes.string,
        name: PropTypes.string,
        countCoffees: PropTypes.number,
        createdAt: PropTypes.number,
        message: PropTypes.string,
        _id: PropTypes.string,
    }),
    loadNewCoffees: PropTypes.any,
    password: PropTypes.any,
    isAdmin: PropTypes.bool,
};

export default Coffee;
