import React from "react";
import style from "./style.scss";

import axios from "axios";

class InputText extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            countCoffees: 1,
            message: "",
            loading: false,
            price: 50
        };
    }

    sendCoffee = async () => {
        const { name, message, countCoffees } = this.state;

        this.setState({
            loading: true
        });

        const url = `${process.env.URL}/api/send_coffee`;

        const result = await axios.post(url, {
            name,
            message,
            countCoffees: countCoffees || 1
        });

        window.location.href = result.data.mercadoPagoLink;
    };

    render() {
        const { name, price, countCoffees, message, loading } = this.state;

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
                                    src="/imgs/coffee.png"
                                    height="50"
                                    alt=""
                                />
                                <span>$50</span>
                            </div>

                            <span className={style.multiplier}>x</span>

                            <input
                                type="text"
                                placeholder="1"
                                value={countCoffees}
                                onChange={e => {
                                    this.setState({
                                        countCoffees: e.target.value
                                    });
                                }}
                            />

                            <button
                                className={`${
                                    parseInt(countCoffees) === 1
                                        ? style.selected
                                        : null
                                }`}
                                onClick={() => {
                                    this.setState({
                                        countCoffees: 1
                                    });
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
                                    this.setState({
                                        countCoffees: 3
                                    });
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
                                    this.setState({
                                        countCoffees: 5
                                    });
                                }}
                            >
                                5
                            </button>
                        </div>

                        <input
                            type="text"
                            value={name}
                            placeholder="Nombre o @Twitter (opcional)"
                            onChange={e => {
                                this.setState({
                                    name: e.target.value
                                });
                            }}
                        />
                        <textarea
                            maxLength="500"
                            placeholder="Mensaje (opcional)"
                            value={message}
                            onChange={e => {
                                this.setState({
                                    message: e.target.value
                                });
                            }}
                        ></textarea>
                        <button onClick={this.sendCoffee}>
                            {`Invitame ${tmpCountCoffees} ${
                                parseInt(tmpCountCoffees) > 1 ? "cafés" : "café"
                            } ($${priceCoffee})`}
                        </button>
                    </>
                )}
            </header>
        );
    }
}

export default InputText;
