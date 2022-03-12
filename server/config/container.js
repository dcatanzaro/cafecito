const awilix = require("awilix");
const CoffeeController = require("../controllers/CoffeeController");
const MercadoPagoController = require("../controllers/MercadoPagoController");
const CoffeeService = require("../services/CoffeeService");
const SocketService = require("../services/SocketService");
const Telegram = require("../services/Telegram");
const server = require("../../server");
const io = require("socket.io")(server);
const { asClass, asValue } = awilix;

const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY,
});

container.register({
    coffeController: asClass(CoffeeController),
    mercadoPagoController: asClass(MercadoPagoController),
    coffeeService: asClass(CoffeeService),
    socketService: asClass(SocketService),
    io: asValue(io),
    telegram: asClass(Telegram),
});

module.exports = container;
