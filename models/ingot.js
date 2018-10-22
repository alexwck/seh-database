const mongoose = require("mongoose");

let ingotSchema = new mongoose.Schema({
    order: {
        type: String,
        uppercase: true,
        required: "Order cannot be left blank.",
        match: [/^[a-z]{3}([a-z]| )\d{3}$/i, "Please fill in valid format for order"]
    },
    lot: {
        type: String,
        uppercase: true,
        required: "Lot cannot be left blank.",
        match: [/^[a-z\d]{5}$/i, "Please fill in valid format for lot"]
    },
    grinding: {
        grDate: {
            type: String
        },
        machine: {
            type: String,
            uppercase: true,
        },
        drawingNo:{
            type: String
        },
        maker:{
            type: String
        },
        grpcs: {
            type: Number,
            min: [0, 'It cannot be less than 0pcs'],
            max: [999, 'It cannot be more than 999pcs']
        },
        whlLife: {
            type: Number,
            min: [0, 'It cannot be less than 0'],
            max: [9999, 'It cannot be more than 9999'],
            default: 0
        },
        groove: {
            type: Number,
            min: [0, 'It cannot be less than 0'],
            max: [3, 'It cannot be more than 3'],
            default: 0,
        },
        opt1: {
            type: String,
        },
        opt2:{
            type: String,
        },
        grcf: {
            type: Number,
            min: [0, 'It cannot be less than 0pcs'],
            max: [999, 'It cannot be more than 999pcs']
        },
        grbrk: {
            type: Number,
            min: [0, 'It cannot be less than 0pcs'],
            max: [999, 'It cannot be more than 999pcs']
        },
        grcrk: {
            type: Number,
            min: [0, 'It cannot be less than 0pcs'],
            max: [999, 'It cannot be more than 999pcs']
        },
        grout: {
            type: Number,
            min: [0, 'It cannot be less than 0pcs'],
            max: [999, 'It cannot be more than 999pcs']
        },
        grdam: {
            type: Number,
            min: [0, 'It cannot be less than 0pcs'],
            max: [999, 'It cannot be more than 999pcs']
        },
        groth: {
            type: Number,
            min: [0, 'It cannot be less than 0pcs'],
            max: [999, 'It cannot be more than 999pcs']
        }
    }
});

var Ingot = mongoose.model("Ingot", ingotSchema.index({order:1, lot:1}));

module.exports = Ingot;