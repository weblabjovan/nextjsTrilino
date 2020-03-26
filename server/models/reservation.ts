import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
	partner: {type: String, required: true},
	type: {type: String, required: true},
	room: {type: String, required: true},
	date: {type: String, required: true},
	from: {type: String, required: true},
	fromDate: {type: Date, required: true},
	to: {type: String, required: true},
	toDate: {type: Date, required: true},
	double: {type: Boolean, required: true},
	user: String,
	userName: String,
	guest: {type: String, required: true},
	food: {type: Object, required: true},
	animation: {type: Object, required: true},
	decoration: {type: Object, required: true},
	comment: String,
	active: {type: Boolean, required: true},
	termPrice: Number,
	animationPrice: Number,
	decorationPrice: Number,
	foodPrice: Number,
	price: Number,
	deposit: Number,
	trilinoCatering: String,
	confirmed: Boolean,
	payment: String,
	transactionId: String,
	transactionCard: String,
	transactionAuthCode: String,
	transactionProcReturnCode: String,
	transactionDate: String,
	transactionMdStatus: String,
	transactionErrMsg: String,
	trilino: Boolean,
	doubleReference: {type: String, required: true},
	doubleNumber: Number,
}, {timestamps: true});

reservationSchema.index({'date': 1});
reservationSchema.index({'partner': 1});

export default mongoose.models.Reservation || mongoose.model('Reservation', reservationSchema);