'use strict'
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ChargeorderSchema = new Schema({
	orderno: {type: String, required: true, index: {unique: true}},
	phoneInfo: {_id: {type: Schema.Types.ObjectId, ref: 'Simcard'}, phoneno: String, cardpackage: {name: String, fee: Number}},
	exFeeEndDate: Date,
	newFeeEndDate: Date,
	statusCode: Number,
	fee: Number,
	orderTime: Date
});

module.exports = mongoose.model('Chargeorder', ChargeorderSchema);