// const nodeHtmlToImage = require("node-html-to-image");

// nodeHtmlToImage({
//     output: "./public/imagesCoffee/image.png",
//     html: `<html>
//       <head>
//         <style>
//           body {
//             width: 200px;
//             height: 200px;
//             color: red;
//           }
//         <style>
//         </style>
//       </head>
//       <body>Hello world!</body>
//     </html>
//     `
// }).then(() => console.log("The image was created successfully!"));

class CoffeeController {
    constructor(telegram, coffeeService, mercadoPagoService) {
        this.telegram = telegram;
        this.coffeeService = coffeeService;
        this.mercadoPagoService = mercadoPagoService;

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
        const { name, message, countCoffees } = req.body;

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

        const paymentLink = await this.mercadoPagoService.createPayment(
            "Cafecito | Damián Catanzaro",
            this.coffeePrice * countCoffees,
            result._id
        );

        return res.json({
            mercadoPagoLink: paymentLink,
        });
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
        const coffees = await this.coffeeService.getCoffees();

        let countCoffees = 0;

        coffees.map(coffe => {
            countCoffees += coffe.countCoffees;
        });

        return res.json({ coffees, countCoffees });
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
