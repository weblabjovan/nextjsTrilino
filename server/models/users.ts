import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	city: String,
	country: String,
	contactEmail: {type: String, required: true},
	contactPhone: {type: String, required: true},
	phoneCode: {type: String, required: true},
	password: String,
	passProvided: {type: Boolean, required: true},
	passSafetyCode: {type: String, required: true},
	userlanguage: {type: String, required: true},
	verified: {type: Boolean, required: true},
	origin: String,
	viber: Object,
}, {timestamps: true});

userSchema.index({'email': 1});

export default mongoose.models.User || mongoose.model('User', userSchema);