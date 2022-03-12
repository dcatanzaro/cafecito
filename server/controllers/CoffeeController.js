const _ = require("lodash");

class CoffeeController {
    constructor({ telegram, coffeeService, mercadoPagoController }) {
        this.telegram = telegram;
        this.coffeeService = coffeeService;
        this.mercadoPagoController = mercadoPagoController;

        this.coffeePrice = 50;
    }

    sendAnswer = async (req, res) => {
        const { answer, idCoffee, password } = req.body;

        if (password != process.env.PASSWORD_EDITOR) {
            return res.json({});
        }

        const result = await this.coffeeService.saveAnswer(answer, idCoffee);

        return res.json(result);
    };

    sendCoffee = async (req, res) => {
        const { name, message, countCoffees, QR } = req.body;

        if (name.length > 500 || message.length > 500) {
            return res.json({
                err: "Invalid length",
            });
        }

        this.telegram.sendTelegramMessage(
            `Cafecito | ☕️ New coffee | Name: ${name} | Message: ${message} | Count: ${countCoffees}`
        );

        const result = await this.coffeeService.saveCoffee({
            name,
            message,
            countCoffees,
            active: false,
        });

        const body = {};

        body.mercadoPagoLink = await this.mercadoPagoController.createPayment(
            "Cafecito | Damián Catanzaro",
            this.coffeePrice * countCoffees,
            result._id
        );

        if (QR) {
            const qrImage = await this.mercadoPagoController.createQR(
                "Cafecito | Damián Catanzaro",
                this.coffeePrice * countCoffees,
                result._id
            );

            body.qr = _.get(qrImage, "pos.qr.image");
            body.coffeeId = result._id;
        }

        return res.json(body);
    };

    deleteCoffee = async (req, res) => {
        const { idCoffee, password } = req.body;

        if (password != process.env.PASSWORD_EDITOR) {
            return res.json({});
        }

        const result = await this.coffeeService.deleteCoffee(idCoffee);

        return res.json(result);
    };

    getCoffees = async (req, res) => {
        const query = { active: true, deleted: null };

        const coffees = await this.coffeeService.getCoffees(query);

        let countCoffees = 0;

        coffees.map((coffe) => {
            countCoffees += coffe.countCoffees;
        });

        return res.json({ coffees, countCoffees });
    };

    getCoffeesWithoutImages = async () => {
        const query = { active: true, deleted: null, imageCreated: null };

        const coffees = await this.coffeeService.getCoffees(query);

        this.processImage(coffees);
    };

    processImage = async (coffees, count = 0) => {
        if (coffees[count]) {
            await this.coffeeService.createImageShare(coffees[count]);

            count++;

            this.processImage(coffees, count);
        }
    };

    getPaymentByCoffeId = async (req, res) => {
        const coffeId = req.params.id;

        const coffee = await this.coffeeService.getCoffee(coffeId);

        if (coffee && coffee.active) {
            return res.json({
                showThankYou: true,
            });
        }

        return res.json({});
    };
}

module.exports = CoffeeController;
