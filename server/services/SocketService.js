class SocketService {
    constructor(io) {
        this.io = io;
        this.sockets = {};

        this.initialize();
    }

    initialize = () => {
        this.io.sockets.on("connection", (socket) => {
            socket.on("assignCoffeeId", (data) => {
                this.sockets[data.coffeeId] = socket;
            });
        });
    };
}

module.exports = SocketService;
