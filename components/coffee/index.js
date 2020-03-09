import React, { useState } from "react";
import style from "./style.scss";

import axios from "axios";
import dayjs from "dayjs";

const Coffee = ({ coffee, loadNewCoffees, password, isAdmin }) => {
    const [isOpenTextInput, setIsOpenTextInput] = useState(false);
    const [answer, setAnswer] = useState("");

    const openTextInput = () => {
        setIsOpenTextInput(true);
        setAnswer(coffee.answer || "");
    };

    const sendAnswer = async (idCoffee) => {
        if (!answer.length) {
            return;
        }

        setAnswer("");
        setIsOpenTextInput(false);

        const url = `${process.env.URL}/api/send_answer`;

        const result = await axios.post(url, {
            answer,
            password,
            idCoffee,
        });

        loadNewCoffees();
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

    const deleteMessage = async (idCoffee) => {
        const confirmDelete = confirm(
            `¿Estás seguro que querés borrar el mensaje?`
        );

        if (confirmDelete) {
            const url = `${process.env.URL}/api/delete_coffee`;

            const result = await axios.post(url, {
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
                <div className={style.q}>
                    <div className={style.name}>
                        {coffee.name ? coffee.name : "Anónimo"}
                        <span>
                            {`regaló ${coffee.countCoffees} ${
                                coffee.countCoffees > 1 ? "cafés" : "café"
                            }`}{" "}
                            {SHOW_DATE_COFFEE
                                ? `el ${dayjs(coffee.createdAt).format(
                                      "DD-MM-YYYY"
                                  )}`
                                : ""}
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
                                onChange={(e) => {
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

export default Coffee;
