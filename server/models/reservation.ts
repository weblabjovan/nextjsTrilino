import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
	partner: String,
	type: String,
	room: String,
	date: String,
	from: String,
	fromDate: Date,
	to: String,
	toDate: Date,
	double: Boolean,
	user: String,
	userName: String,
	guest: String,
	food: Object,
	animation: Object,
	decoration: Object,
	comment: String,
	active: Boolean,
	termPrice: Number,
	animationPrice: Number,
	decorationPrice: Number,
	foodPrice: Number,
	price: Number,
	deposit: Number,
}, {timestamps: true});

reservationSchema.index({'date': 1});
reservationSchema.index({'partner': 1});

export default mongoose.models.Reservation || mongoose.model('Reservation', reservationSchema);