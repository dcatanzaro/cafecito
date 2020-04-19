import React, { useState } from "react";
import style from "./style.scss";

const QR = ({ data }) => {
    return (
        <section className={style.qrSection}>
            <div className={style.qrTitle}>
                <span>Escaneá y pagá con </span>
                <img
                    src="/imgs/mercadopago.png"
                    alt="MercadoPago Logo"
                    height="30px"
                />
            </div>
            <img className={style.imageQR} src={data.qr} alt="QR MercadoPago" />

            <a href={data.mercadoPagoLink}>Ir a MercadoPago.com</a>
        </section>
    );
};

export default QR;
