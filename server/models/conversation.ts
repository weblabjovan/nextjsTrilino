import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
	reservation: {type: String, required: true},
	user: {type: String, required: true},
	partner: {type: String, required: true},
	partnerName: {type: String, required: true},
	userName: {type: String, required: true},
	messages: [{ type: Object }],
	validUntil: {type: Date, required: true},
	status: {type: String, required: true},

}, {timestamps: true});

conversationSchema.index({'user': 1});
conversationSchema.index({'partner': 1});
conversationSchema.index({'reservation': 1});

export default mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);