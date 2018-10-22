const mongoose = require("mongoose");
//Wheel - Serial Number, Batch Number

let wheelSchema = new mongoose.Schema({
    serialNo: {
        type: String
    },
    batchNo: {
        type: String,
        default: 0
    },
    ingots: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ingot' }],
    isCompleted:{
        type: Boolean,
        default: false
    },
},{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

var Wheel = mongoose.model("Wheel", wheelSchema);

module.exports = Wheel;