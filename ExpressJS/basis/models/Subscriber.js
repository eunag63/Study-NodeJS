const mongoose = require("mongoose");

const subSchema = new mongoose.Schema({
    userTo: {
        type: Schema.Type.ObjectId,
        ref: 'User'
    },
    userFrom: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

subSchema.set("toJSON", {
    virtuals: true,
})

module.exports = mongoose.model("Subscriber", subSchema);