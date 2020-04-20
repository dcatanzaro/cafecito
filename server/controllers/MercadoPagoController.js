class MercadoPagoController {
    constructor(mercadoPagoService) {
        this.mercadoPagoService = mercadoPagoService;

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

        console.log(req.query);

        try {
            if (topic == "payment") {
                const payment = await this.mercadoPagoService.getPayment(id);

                console.log(payment);

                if (payment.status === "approved") {
                    const reference = JSON.parse(payment.external_reference);

                    console.log(reference);

                    if (reference.coffeeId) {
                        const coffee = await this.coffeeService.updateCoffee(
                            reference.coffeeId,
                            {
                                paymentId: id,
                                active: true,
                            }
                        );

                        this.coffeeService.createImageShare(coffee);

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
