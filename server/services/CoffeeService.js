const Coffee = require("../models/coffee");
const nodeHtmlToImage = require("node-html-to-image");
const fs = require("fs");

class CoffeeService {
    getCoffee = async id => {
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

    deleteCoffee = async idCoffee => {
        const result = await Coffee.updateOne(
            { _id: idCoffee },
            { $set: { deleted: true } }
        );

        return result;
    };

    getCoffees = async query => {
        const coffees = await Coffee.find(query).sort({
            createdAt: -1,
        });

        return coffees;
    };

    createImageShare = async coffee => {
        const shareHtml = await new Promise((resolve, reject) => {
            fs.readFile(`./server/config/share.html`, "utf8", (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });

        const result = await nodeHtmlToImage({
            output: `./public/imagesCoffee/${coffee._id}.png`,
            html: shareHtml,
            content: {
                name: coffee.name ? coffee.name : "Anónimo",
                countCoffees: `regaló ${coffee.countCoffees} ${
                    coffee.countCoffees > 1 ? "cafés" : "café"
                }`,
                message: coffee.message,
            },
            puppeteerArgs: {
                args: [
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--enable-font-antialiasing",
                    "--font-render-hinting=none",
                ],
            },
        });

        this.updateCoffee(coffee._id, { imageCreated: true });

        return result;
    };
}

module.exports = CoffeeService;
