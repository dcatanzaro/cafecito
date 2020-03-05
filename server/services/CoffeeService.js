const Coffee = require("../models/coffee");

class CoffeeService {
    getCoffee = async (id, data) => {
        const result = await Coffee.findOne({ _id: id }).lean();

        return result;
    };

    saveAnswer = async (answer, idCoffee) => {
        const result = await Coffee.updateOne(
            { _id: idCoffee },
            { $set: { answer } }
        );

        return result;
    };

    saveCoffee = async data => {
        const coffee = new Coffee(data);

        const result = await coffee.save();

        return result;
    };

    updateCoffee = async (id, data) => {
        const result = await Coffee.findOneAndUpdate(
            { _id: id },
            { $set: data }
        ).lean();

        return result;
    };

    deleteCoffee = async (idCoffee, password) => {
        if (password != process.env.PASSWORD_EDITOR) {
            return res.json({});
        }

        const result = await Coffee.updateOne(
            { _id: idCoffee },
            { $set: { deleted: true } }
        );

        return res.json(result);
    };

    getCoffees = async () => {
        const query = { active: true, deleted: null };

        const coffees = await Coffee.find(query).sort({
            createdAt: -1
        });

        return coffees;
    };
}

module.exports = CoffeeService;
