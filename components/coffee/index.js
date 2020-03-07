import React from "react";
import style from "./style.scss";

import axios from "axios";
import dayjs from "dayjs";

const isDev = process.env.NODE_ENV !== "production";

class Coffee extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            openTextInput: false,
            answer: ""
        };
    }

    openTextInput = () => {
        const { coffee } = this.props;

        this.setState({
            openTextInput: true,
            answer: coffee.answer || ""
        });
    };

    sendAnswer = async idCoffee => {
        const { answer } = this.state;
        const { loadNewCoffees, password } = this.props;

        if (!answer.length) {
            return;
        }

        this.setState({
            answer: "",
            openTextInput: false
        });

        const url = `${process.env.URL}/api/send_answer`;

        const result = await axios.post(url, {
            answer,
            password,
            idCoffee
        });

        loadNewCoffees();
    };

    queryConvert = () => {
        var queryStr = window.location.search,
            queryArr = queryStr.replace("?", "").split("&"),
            queryParams = [];

        for (var q = 0, qArrLength = queryArr.length; q < qArrLength; q++) {
            var qArr = queryArr[q].split("=");
            queryParams[qArr[0]] = qArr[1];
        }

        return queryParams;
    };

    deleteMessage = async idCoffee => {
        const { loadNewCoffees, password } = this.props;

        const confirmDelete = confirm(
            `¿Estás seguro que querés borrar el mensaje?`
        );

        if (confirmDelete) {
            const url = `${process.env.URL}/api/delete_coffee`;

            const result = await axios.post(url, {
                password,
                idCoffee
            });

            loadNewCoffees();
        }
    };

    render() {
        const { coffee, isAdmin } = this.props;
        const { openTextInput, answer } = this.state;

        return (
            <section className={style.coffeeContainer}>
                <div className={style.coffee}>
                    <div className={style.q}>
                        <div className={style.name}>
                            {coffee.name ? coffee.name : "Anónimo"}{" "}
                            <span>{`regaló ${coffee.countCoffees} ${
                                coffee.countCoffees > 1 ? "cafés" : "café"
                            }`} el ${coffee.createdAt}</span>
                        </div>
                        {coffee.message && (
                            <span className={style.text}>{coffee.message}</span>
                        )}
                    </div>
                    {coffee.answer && (
                        <div className={style.answer}>{coffee.answer}</div>
                    )}
                    {isAdmin &&
                        (!openTextInput ? (
                            <div className={style.buttons}>
                                <button onClick={this.openTextInput}>
                                    {!coffee.answer ? "Responder" : "Editar"}
                                </button>
                                <button
                                    className={style.dangerButton}
                                    onClick={() =>
                                        this.deleteMessage(coffee._id)
                                    }
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
                                        this.setState({
                                            answer: e.target.value
                                        });
                                    }}
                                ></textarea>
                                <button
                                    onClick={() => this.sendAnswer(coffee._id)}
                                >
                                    Enviar
                                </button>
                            </>
                        ))}
                </div>
            </section>
        );
    }
}

export default Coffee;
