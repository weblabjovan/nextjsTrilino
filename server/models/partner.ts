import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const partnerSchema = new Schema({
	name: {type: String, required: true},
	taxNum: {type: Number, required: true},
	city: {type: String, required: true},
	district: {type: String, required: true},
	country: String,
	contactPerson: {type: String, required: true},
	contactEmail: {type: String, required: true},
	contactPhone: {type: String, required: true},
	password: String,
	passProvided: {type: Boolean, required: true},
	passSafetyCode: {type: String, required: true},
	userlanguage: {type: String, required: true},
	verified: {type: Boolean, required: true},
	created: {type: Date, required: true},
	general:{ type: Object},
	contentOffer:[{ type: Number }],
	contentAddon:[{ type: Object }],
	catering: { type: Object},
	decoration: { type: Object},
	photos: [{ type: Object }],
	forActivation: {type: Boolean, required: true, default: false},
	active: {type: Boolean, required: true, default: false},
	map: { type: Object},
	activationDate: String,
}, {timestamps: true});

export default mongoose.models.Partner || mongoose.model('Partner', partnerSchema);