import React, { useState } from "react";
import style from "./style.scss";

import axios from "axios";

const InputText = () => {
    const [name, setName] = useState("");
    const [countCoffees, setCountCoffees] = useState(1);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [price] = useState(50);

    const sendCoffee = async () => {
        setLoading(true);

        const url = `${process.env.URL}/api/send_coffee`;

        const result = await axios.post(url, {
            name,
            message,
            countCoffees: countCoffees || 1,
        });

        window.location.href = result.data.mercadoPagoLink;
    };

    const tmpCountCoffees = countCoffees ? countCoffees : 1;
    const priceCoffee = tmpCountCoffees * price;

    return (
        <header className={style.inputText}>
            {loading ? (
                <div className={style.loading}>
                    <span>Creando café...</span>
                </div>
            ) : (
                <>
                    <span>¡Ayudame con un café ☕️!</span>

                    <div className={style.containerInputCoffee}>
                        <div className={style.imageCoffee}>
                            <img
                                src="/static/imgs/coffee.png"
                                height="50"
                                alt=""
                            />
                            <span>$50</span>
                        </div>

                        <span className={style.multiplier}>x</span>

                        <div className={style.countCoffeesContainer}>
                            <button
                                onClick={() => {
                                    if (countCoffees > 1) {
                                        setCountCoffees(
                                            preCountCoffees =>
                                                preCountCoffees - 1
                                        );
                                    }
                                }}
                            >
                                -
                            </button>

                            <input
                                type="text"
                                placeholder="1"
                                value={countCoffees}
                                onChange={e => {
                                    setCountCoffees(e.target.value);
                                }}
                            />

                            <button
                                onClick={() => {
                                    setCountCoffees(
                                        preCountCoffees => preCountCoffees + 1
                                    );
                                }}
                            >
                                +
                            </button>
                        </div>

                        <div className={style.buttonCoffeesContainer}>
                            <button
                                className={`${
                                    parseInt(countCoffees) === 1
                                        ? style.selected
                                        : null
                                }`}
                                onClick={() => {
                                    setCountCoffees(1);
                                }}
                            >
                                1
                            </button>
                            <button
                                className={`${
                                    parseInt(countCoffees) === 3
                                        ? style.selected
                                        : null
                                }`}
                                onClick={() => {
                                    setCountCoffees(3);
                                }}
                            >
                                3
                            </button>
                            <button
                                className={`${
                                    parseInt(countCoffees) === 5
                                        ? style.selected
                                        : null
                                }`}
                                onClick={() => {
                                    setCountCoffees(5);
                                }}
                            >
                                5
                            </button>
                        </div>
                    </div>

                    <input
                        type="text"
                        value={name}
                        placeholder="Nombre o @Twitter (opcional)"
                        onChange={e => {
                            setName(e.target.value);
                        }}
                    />
                    <textarea
                        maxLength="500"
                        placeholder="Mensaje (opcional)"
                        value={message}
                        onChange={e => {
                            setMessage(e.target.value);
                        }}
                    ></textarea>
                    <button onClick={sendCoffee}>
                        {`Invitame ${tmpCountCoffees} ${
                            parseInt(tmpCountCoffees) > 1 ? "cafés" : "café"
                        } ($${priceCoffee})`}
                    </button>
                </>
            )}
        </header>
    );
};

export default InputText;
