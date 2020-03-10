const routes = require("next-routes");

module.exports = routes().add("home", "/:coffee(coffee)?/:id?");
