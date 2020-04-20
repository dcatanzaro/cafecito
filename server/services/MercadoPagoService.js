const axios = require("axios");

class MercadoPagoService {
    createPayment = async (title, price, coffeeId) => {
        const result = await axios.post(
            `https://api.mercadopago.com/checkout/preferences?access_token=${process.env.ACCESS_KEY_MP}`,
            {
                items: [
                    {
                        title: title,
                        quantity: 1,
                        currency_id: "ARS",
                        unit_price: price,
                    },
                ],
                external_reference: {
                    coffeeId,
                },
                back_urls: {
                    success: process.env.URL,
                },
                auto_return: "approved",
                payment_methods: {
                    installments: 1,
                    default_installments: 1,
                },
            }
        );

        return result.data.init_point;
    };

    getPayment = async (collectionId) => {
        const result = await axios.get(
            `https://api.mercadopago.com/v1/payments/${collectionId}?access_token=${process.env.ACCESS_KEY_MP}`
        );

        return result.data;
    };

    getUser = async () => {
        const result = await axios.get(
            `https://api.mercadolibre.com/users/me?access_token=${process.env.ACCESS_KEY_MP}`
        );

        return result.data;
    };

    getStores = async (userId) => {
        const result = await axios.get(
            `https://api.mercadopago.com/users/${userId}/stores/search?access_token=${process.env.ACCESS_KEY_MP}`
        );

        return result.data;
    };

    getAllPos = async () => {
        const result = await axios.get(
            `https://api.mercadopago.com/pos?limit=100&access_token=${process.env.ACCESS_KEY_MP}`
        );

        return result.data;
    };

    deletePos = async (posId) => {
        const result = await axios.delete(
            `https://api.mercadopago.com/pos/${posId}?access_token=${process.env.ACCESS_KEY_MP}`
        );

        return result.data;
    };

    createStore = async (userId, titleStore) => {
        const result = await axios.post(
            `https://api.mercadopago.com/users/${userId}/stores?access_token=${process.env.ACCESS_KEY_MP}`,
            {
                name: titleStore,
                location: {
                    street_number: "",
                    street_name: "",
                    city_name: "Belgrano",
                    state_name: "Capital Federal",
                    latitude: -32,
                    longitude: -32,
                },
            }
        );

        return result.data;
    };

    createPos = async (namePos, storeId, externalId) => {
        const result = await axios.post(
            `https://api.mercadopago.com/pos?access_token=${process.env.ACCESS_KEY_MP}`,
            JSON.stringify({
                name: namePos,
                fixed_amount: true,
                store_id: storeId,
                external_id: externalId,
            }),
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return result.data;
    };

    assingAmountToPos = async (userId, externalId, coffeeId, title, price) => {
        try {
            const result = await axios.post(
                `https://api.mercadopago.com/mpmobile/instore/qr/${userId}/${externalId}?access_token=${process.env.ACCESS_KEY_MP}`,
                JSON.stringify({
                    items: [
                        {
                            title: title,
                            currency_id: "ARS",
                            unit_price: price,
                            quantity: 1,
                        },
                    ],
                    external_reference: JSON.stringify({
                        coffeeId,
                        QR: true,
                    }),
                    payment_methods: {
                        installments: 1,
                        default_installments: 1,
                    },
                }),
                {
                    headers: {
                        "Accept-Encoding": "gzip,deflate",
                        "Content-Type": "application/json",
                    },
                }
            );

            return result.data;
        } catch (e) {
            return {};
        }
    };
}

module.exports = MercadoPagoService;
