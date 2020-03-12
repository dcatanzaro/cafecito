const dotenv = require("dotenv");
const isDev = process.env.NODE_ENV !== "production";

const envFile = isDev ? `.env.${process.env.NODE_ENV}` : ".env";
dotenv.config({ path: envFile });

const next = require("next");
const routes = require("./routes");

const app = next({ dev: isDev });
const handler = routes.getRequestHandler(app);
const bodyParser = require("body-parser");
const axios = require("axios");
const compression = require("compression");

const mongoose = require("mongoose");

let urlMongo = "";

if (process.env.DB_USER) {
    urlMongo = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin&w=1`;
} else {
    urlMongo = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
}

mongoose.set("useCreateIndex", true);

mongoose.connect(urlMongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

class Telegram {
    sendTelegramMessage(message) {
        const botId = process.env.TELEGRAM_BOTID;
        const chatId = process.env.TELEGRAM_CHATID;

        if (!botId || !chatId) {
            return;
        }

        const telegramMsg = encodeURIComponent(message);

        const url = `https://api.telegram.org/${botId}/sendMessage?chat_id=${chatId}&text=${telegramMsg}`;
        axios.get(url);
    }
}

const telegram = new Telegram();

const MercadoPagoService = require("./server/services/MercadoPagoService");
const MercadoPagoServiceInstance = new MercadoPagoService();

const CoffeeService = require("./server/services/CoffeeService");
const CoffeeServiceInstance = new CoffeeService();

const CoffeeController = require("./server/controllers/CoffeeController");
const CoffeeInstance = new CoffeeController(
    telegram,
    CoffeeServiceInstance,
    MercadoPagoServiceInstance
);

CoffeeInstance.getCoffeesWithoutImages();

const express = require("express");

app.prepare().then(() => {
    const server = express();

    server.use("/static", express.static("public"));

    server.use(compression());

    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(bodyParser.json());

    server.post("/api/send_coffee", CoffeeInstance.sendCoffee);
    server.post("/api/send_answer", CoffeeInstance.sendAnswer);
    server.post("/api/delete_coffee", CoffeeInstance.deleteCoffee);
    server.get("/api/coffees", CoffeeInstance.getCoffees);

    server.get(
        "/api/get_payment_by_coffe/:id",
        CoffeeInstance.getPaymentByCoffeId
    );

    server.post("/api/ipn", CoffeeInstance.savePayment);

    server.use(handler);

    server.listen(process.env.PORT);

    console.log(
        `Server started on port ${process.env.PORT} | Url: ${process.env.URL}`
    );
});
