'use strict'
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let SimcardSchema = new Schema({
	phoneno: {type: String, required: true, index: {unique: true}},
	iccid: String,
	imsi: String,
	cardtype: {_id: {type: Schema.Types.ObjectId, ref: 'Cardtype'}, name: String},
	cardpackage: {_id: {type: Schema.Types.ObjectId, ref: 'Package'}, name: String, totalGprs: Number, fee: Number},
	prestorePeriod: Number,
	feeStartDate: Date,
	feeEndDate: Date,
	testDay: Number,
	quietDay: Number,
    apiacct: {_id: {type: Schema.Types.ObjectId, ref: 'Apiacct'}, name: String},
	sms: Boolean,
	call: Boolean,
	dialMinute: Number,
	calledMinute: Number,
	belongUser: [{_id: {type: Schema.Types.ObjectId, ref: 'Order'}, selled: Boolean}],
	belongOrder: [{type: Schema.Types.ObjectId}],
    totalUsedGprs: Number,
    history: [{month: String, usedGprs: Number}],
	orderDate: Date
});

module.exports = mongoose.model('Simcard', SimcardSchema);