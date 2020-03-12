const routes = require("next-routes");

module.exports = routes()
    .add("customCoffee", "/custom-coffee")
    .add("home", "/:coffee(coffee)?/:id?");
