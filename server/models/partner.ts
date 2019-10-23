import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const partnerSchema = new Schema({
	name: {type: String, required: true},
	taxNum: {type: Number, required: true},
	city: {type: String, required: true},
	contactPerson: {type: String, required: true},
	contactEmail: {type: String, required: true},
	contactPhone: {type: String, required: true},

});

export default mongoose.models.Partner || mongoose.model('Partner', partnerSchema);