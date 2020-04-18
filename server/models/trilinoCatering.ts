import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const cateringSchema = new Schema({
	reservation: {type: String, required: true},
	content: {type: Object, required: true},
	active: {type: Boolean, required: true},
	status: {type: String, required: true},
	price: {type: Number, required: true},
	deliveryDate: {type: String, required: true},
	deliveryTime: {type: String, required: true},
	deliveryFullDate: {type: Date, required: true},
	transactionResult: String,
	transactionId: String,
	transactionAuthCode: String,
	transactionProcReturnCode: String,
	transactionDate: String,
	transactionMdStatus: String,
	transactionErrMsg: String,
}, {timestamps: true});

cateringSchema.index({'reservation': 1});

export default mongoose.models.Catering || mongoose.model('Catering', cateringSchema);