const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const coffeeSchema = new Schema(
    {
        name: String,
        message: String,
        countCoffees: Number,
        answer: String,
        paymentId: String,
        active: Boolean,
        imageCreated: Boolean,
        deleted: Boolean,
    },
    {
        timestamps: true,
    }
);

coffeeSchema.index({ createdAt: -1, active: 1 });

module.exports = mongoose.model("coffees", coffeeSchema);
