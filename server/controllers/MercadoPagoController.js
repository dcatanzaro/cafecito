const dayjs = require("dayjs");

class MercadoPagoController {
    constructor({
        coffeeService,
        mercadoPagoService,
        socketService,
        telegram,
    }) {
        this.coffeeService = coffeeService;
        this.mercadoPagoService = mercadoPagoService;
        this.socketService = socketService;
        this.telegram = telegram;

        this.userId = "";
        this.storeId = "";
    }

    createStore = async () => {
        const userMp = await this.mercadoPagoService.getUser();

        this.userId = userMp.id;

        const stores = await this.mercadoPagoService.getStores(this.userId);

        const storeCafecito = stores.results.find((store) => {
            if (store.name == "Cafecito") {
                return store;
            }
        });

        if (storeCafecito) {
            this.storeId = storeCafecito.id;
        } else {
            const store = await this.mercadoPagoService.createStore(
                this.userId,
                "Cafecito"
            );

            this.storeId = store.id;
        }
    };

    deleteAllPosOld = async () => {
        const arPos = await this.mercadoPagoService.getAllPos();

        const actualDate = dayjs();

        await arPos.results.map(async (pos) => {
            const datePos = dayjs(pos.date_last_updated).add(1, "hour");

            if (datePos < actualDate) {
                await this.mercadoPagoService.deletePos(pos.id);
            }
        });
    };

    createQR = async (name, price, coffeeId) => {
        const externalId = `CafecitoPos${coffeeId}`;

        const pos = await this.mercadoPagoService.createPos(
            externalId,
            this.storeId,
            externalId
        );

        const QR = await this.mercadoPagoService.assingAmountToPos(
            this.userId,
            externalId,
            coffeeId,
            name,
            price
        );

        return { pos, QR };
    };

    createPayment = async (name, price, coffeeId) => {
        const paymentLink = await this.mercadoPagoService.createPayment(
            name,
            price,
            coffeeId
        );

        return paymentLink;
    };

    savePayment = async (req, res) => {
        const { id, topic } = req.query;

        try {
            if (topic == "payment") {
                const payment = await this.mercadoPagoService.getPayment(id);

                if (payment.status === "approved") {
                    const reference = JSON.parse(payment.external_reference);

                    if (reference.coffeeId) {
                        const coffee = await this.coffeeService.updateCoffee(
                            reference.coffeeId,
                            {
                                paymentId: id,
                                active: true,
                            }
                        );

                        this.coffeeService.createImageShare(coffee);

                        if (reference.QR) {
                            const socket = this.socketService.sockets[
                                reference.coffeeId
                            ];

                            socket.emit("sendToThankYouPage", {
                                coffeeId: reference.coffeeId,
                            });

                            socket.disconnect();

                            delete this.socketService.sockets[
                                reference.coffeeId
                            ];
                        }

                        this.telegram.sendTelegramMessage(
                            `Cafecito | ☕️ New Payment | Name: ${coffee.name} | Message: ${coffee.message} | Count: ${coffee.countCoffees}`
                        );
                    }
                }
            }

            return res.json({});
        } catch (e) {
            return res.json({});
        }
    };
}

module.exports = MercadoPagoController;
