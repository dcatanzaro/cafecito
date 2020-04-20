const dotenv = require("dotenv");
const isDev = process.env.NODE_ENV !== "production";

const envFile = isDev ? `.env.${process.env.NODE_ENV}` : ".env";
dotenv.config({ path: envFile });

const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const next = require("next");
const routes = require("./routes");

const nextApp = next({ dev: isDev });
const handler = routes.getRequestHandler(nextApp);
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

        console.log(botId, chatId, message);

        if (!botId || !chatId) {
            return;
        }

        const telegramMsg = encodeURIComponent(message);

        const url = `https://api.telegram.org/${botId}/sendMessage?chat_id=${chatId}&text=${telegramMsg}`;
        axios.get(url);
    }
}

const telegram = new Telegram();

const SocketService = require("./server/services/SocketService");
const SocketServiceInstance = new SocketService(io);

SocketServiceInstance.initialize();

const MercadoPagoService = require("./server/services/MercadoPagoService");
const MercadoPagoServiceInstance = new MercadoPagoService();

const CoffeeService = require("./server/services/CoffeeService");
const CoffeeServiceInstance = new CoffeeService();

const MercadoPagoController = require("./server/controllers/MercadoPagoController");
const MercadoPagoInstance = new MercadoPagoController(
    CoffeeServiceInstance,
    MercadoPagoServiceInstance,
    SocketServiceInstance,
    telegram
);

MercadoPagoInstance.createStore();
MercadoPagoInstance.deleteAllPosOld();

setInterval(() => {
    MercadoPagoInstance.deleteAllPosOld();
}, 1000 * 60 * 10);

const CoffeeController = require("./server/controllers/CoffeeController");
const CoffeeInstance = new CoffeeController(
    telegram,
    CoffeeServiceInstance,
    MercadoPagoInstance
);

CoffeeInstance.getCoffeesWithoutImages();

nextApp.prepare().then(() => {
    app.use("/static", express.static("public"));

    app.use(compression());

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.post("/api/send_coffee", CoffeeInstance.sendCoffee);
    app.post("/api/send_answer", CoffeeInstance.sendAnswer);
    app.post("/api/delete_coffee", CoffeeInstance.deleteCoffee);
    app.get("/api/coffees", CoffeeInstance.getCoffees);

    app.get(
        "/api/get_payment_by_coffe/:id",
        CoffeeInstance.getPaymentByCoffeId
    );

    app.post("/api/ipn", MercadoPagoInstance.savePayment);

    app.get("*", (req, res) => {
        return handler(req, res);
    });

    server.listen(process.env.PORT, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${process.env.PORT}`);
    });

    console.log(
        `Server started on port ${process.env.PORT} | Url: ${process.env.URL}`
    );
});
