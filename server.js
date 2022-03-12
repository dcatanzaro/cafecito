const dotenv = require("dotenv");
const isDev = process.env.NODE_ENV !== "production";

const envFile = isDev ? `.env.${process.env.NODE_ENV}` : ".env";
dotenv.config({ path: envFile });

const express = require("express");
const app = express();
const server = require("http").Server(app);

const next = require("next");
const routes = require("./routes");

const nextApp = next({ dev: isDev });
const handler = routes.getRequestHandler(nextApp);
const bodyParser = require("body-parser");
const compression = require("compression");

const mongoose = require("mongoose");

const container = require("./server/config/container");

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

const MercadoPagoInstance = container.resolve("mercadoPagoController");

MercadoPagoInstance.createStore();
MercadoPagoInstance.deleteAllPosOld();

setInterval(() => {
    MercadoPagoInstance.deleteAllPosOld();
}, 1000 * 60 * 10);

const CoffeeInstance = container.resolve("coffeeController");

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

module.exports = server;
