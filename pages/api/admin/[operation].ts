import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import AWS from 'aws-sdk';
import bcrypt from 'bcrypt'; 
import Reservation from '../../../server/models/reservation';
import Partner from '../../../server/models/partner';
import connectToDb  from '../../../server/helpers/db';
import { generateString, encodeId, decodeId, setToken, verifyToken, getBasicForSerialGenerator, setUserNameOnAdminFinObject }  from '../../../server/helpers/general';
import { sendEmail }  from '../../../server/helpers/email';
import { isPartnerPhotoSaveDataValid, dataHasValidProperty, isPartnerMapSaveDataValid } from '../../../server/helpers/validations';
import { isEmpty, isMoreThan, isLessThan, isOfRightCharacter, isMatch, isPib, isEmail } from '../../../lib/helpers/validations';
import { setUpLinkBasic } from '../../../lib/helpers/generalFunctions';
import { getLanguage } from '../../../lib/language';
import Keys from '../../../server/keys';
import DateHandler from '../../../lib/classes/DateHandler';

const s3 = new AWS.S3({
	accessKeyId: Keys.AWS_PARTNER_PHOTO_ACCESS_KEY,
	secretAccessKey: Keys.AWS_PARTNER_PHOTO_SECRET_ACCESS_KEY,
	signatureVersion: 'v4',
	region: 'eu-central-1'
});

export default async (req: NextApiRequest, res: NextApiResponse ) => {

	if (req.query.operation === 'login') {
		
		if (!dataHasValidProperty(req.body, ['user', 'pass'])) {
			return res.status(404).json({ endpoint: 'admin', operation: 'login', success: false, code: 4, error: 'validation error' });
		}else{
			const { user, pass } = req.body;
			try{
				if (user === Keys.ADMIN_USER && pass === Keys.ADMIN_PASS) {
					const token = setToken('admin', decodeId(generateString, pass));
					return res.status(200).json({ endpoint: 'admin', operation: 'login', success: true, code: 1, token });
				}else{
					return res.status(404).json({ endpoint: 'admin', operation: 'login', success: false, code: 2, error: 'auth error' });
				}
			}catch(err){
				return res.status(404).json({ endpoint: 'admin', operation: 'login', success: false, code: 3, error: err });
			}
		}

		
	}


	if (req.query.operation === 'devLogin') {
		const { pass } = req.body;
		if (!dataHasValidProperty(req.body, ['pass'])) {
			return res.status(404).json({ endpoint: 'admin', operation: 'devAuth', success: false, code: 4, error: 'data valifation error' });
		}else{
			try{
				if (pass === Keys.ADMIN_BASIC_DEV_STRING) {
					const token = setToken('admin', decodeId(generateString, Keys.ADMIN_BASIC_DEV_KEY));
					return res.status(200).json({ endpoint: 'admin', operation: 'devAuth', success: true, code: 1, token });
				}else{
					return res.status(404).json({ endpoint: 'admin', operation: 'devAuth', success: false, code: 2, error: 'dev auth error' });
				}
			}catch(err){
				return res.status(404).json({ endpoint: 'admin', operation: 'devAuth', success: false, code: 3, error: err });
			}
		}

		
	}


	if (req.query.operation === 'partners') {
		const token = req.headers.authorization;

		if (!isEmpty(token)) {
			try{
				const decoded = verifyToken(token);
				const admin = encodeId(decoded['sub']);
				
				if ( admin === Keys.ADMIN_PASS) {
					if (!dataHasValidProperty(req.body, ['field', 'term'])) {
						return res.status(404).json({ endpoint: 'admin', operation: 'partners', success: false, code: 6, error: 'validation error', message: 'not valid data' });
					}else{
						const { field, term } = req.body;
						await connectToDb(req.headers.host);
						const partners = field !== '' && term !== '' ? await Partner.find({[field]: { '$regex': term, '$options': 'i'}}).select('-password') : await Partner.find({}).select('-password');
						if (partners) {
							return res.status(200).json({ endpoint: 'admin', operation: 'partners', success: true, code: 1, partners });
						}else{
							return res.status(404).json({ endpoint: 'admin', operation: 'partners', success: false, code: 2, error: 'auth error', message: 'no partner selection' });
						}
					}
					
				}else{
					return res.status(404).json({ endpoint: 'admin', operation: 'partners', success: false, code: 5, error: 'auth error', message: 'not valid admin' });
				}
			}catch(err){
				return res.status(500).json({ endpoint: 'admin', operation: 'partners', success: false, code: 3, error: 'selection error', message:'verification problem' });
			}
		}else{
			return res.status(500).json({ endpoint: 'admin', operation: 'partners', success: false, code: 4, error: 'selection error', message:'no auth token' });
		}
	}

	if (req.query.operation === 'partnerActivate') {
		const token = req.headers.authorization;

		if (!isEmpty(token)) {
			try{
				const decoded = verifyToken(token);
				const admin = encodeId(decoded['sub']); 
				
				if ( admin === Keys.ADMIN_PASS) {
					if (!dataHasValidProperty(req.body, ['id', 'active'])) {
						return res.status(404).json({ endpoint: 'admin', operation: 'partnerActivate', success: false, code: 6, error: 'validation error' });
					}else{
						const { id, active } = req.body;
						await connectToDb(req.headers.host);
						const partner = await Partner.findOneAndUpdate({ '_id': id }, {"$set" : { active } }, { new: true }).select('-password');
						if (partner) {
							return res.status(200).json({ endpoint: 'admin', operation: 'partnerActivate', success: true, code: 1, partner });
						}else{
							return res.status(404).json({ endpoint: 'admin', operation: 'partnerActivate', success: false, code: 2, error: 'auth error', message: 'no partner selection' });
						}
					}
					
				}else{
					return res.status(404).json({ endpoint: 'admin', operation: 'partnerActivate', success: false, code: 5, error: 'auth error', message: 'not valid admin' });
				}
			}catch(err){
				return res.status(500).json({ endpoint: 'admin', operation: 'partnerActivate', success: false, code: 3, error: 'selection error', message:'verification problem' });
			}
		}else{
			return res.status(500).json({ endpoint: 'admin', operation: 'partnerActivate', success: false, code: 4, error: 'selection error', message:'no auth token' });
		}
	}

	if (req.query.operation === 'photoPresign') {
		const token = req.headers.authorization;

		if (!isEmpty(token)) {
			try{
				const decoded = verifyToken(token);
				const admin = encodeId(decoded['sub']);
				
				if ( admin === Keys.ADMIN_PASS) {
					if (!dataHasValidProperty(req.body, ['partner', 'num'])) {
						return res.status(404).json({ endpoint: 'admin', operation: 'photoPresign', success: false, code: 6, error: 'validation error' });
					}else{
						const  { partner, num } = req.body;

						const key = `${partner}/${generateString(5)}${num}.jpg`;
						const url = s3.getSignedUrl('putObject', 
						{
							Bucket: 'trilino-partner-photo-bucket',
							ContentType: 'image/jpeg',
							Key: key
						});

						if (url) {
							return res.status(200).json({ endpoint: 'admin', operation: 'photoPresign', success: true, code: 1, data: { key, url } });
						}else{
							return res.status(404).json({ endpoint: 'admin', operation: 'photoPresign', success: false, code: 2, error: 'auth error', message: 'not valid url' });
						}
					}
				}else{
					return res.status(404).json({ endpoint: 'admin', operation: 'photoPresign', success: false, code: 5, error: 'auth error', message: 'not valid admin' });
				}
			}catch(err){
				return res.status(500).json({ endpoint: 'admin', operation: 'photoPresign', success: false, code: 3, error: 'selection error', message:'verification problem' });
			}
		}else{
			return res.status(500).json({ endpoint: 'admin', operation: 'photoPresign', success: false, code: 4, error: 'selection error', message:'no auth token' });
		}
	}

	if (req.query.operation === 'partnerPhotoDelete') {
		const token = req.headers.authorization;

		if (!isEmpty(token)) {
			try{
				const decoded = verifyToken(token);
				const admin = encodeId(decoded['sub']);
				
				if ( admin === Keys.ADMIN_PASS) {
					if (!dataHasValidProperty(req.body, ['partnerId', 'photos', 'photo'])) {
						return res.status(404).json({ endpoint: 'admin', operation: 'partnerPhotoDelete', success: false, code: 7, error: 'validation error' });
					}else{
						const  { partnerId, photos, photo } = req.body;
						const del = await s3.deleteObject( 
						{
							Bucket: 'trilino-partner-photo-bucket',
							Key: photo
						});

						if (del) {
							await connectToDb(req.headers.host);
							const partner = await Partner.findOneAndUpdate({ '_id': partnerId }, {"$set" : { photos } }, { new: true }).select('-password');

							if (partner) {
								return res.status(200).json({ endpoint: 'admin', operation: 'partnerPhotoDelete', success: true, code: 1, partner });
							}else{
								return res.status(404).json({ endpoint: 'admin', operation: 'partnerPhotoDelete', success: false, code: 6, error: 'auth error', message: 'not valid partner' });
							}
						}else{
							return res.status(404).json({ endpoint: 'admin', operation: 'partnerPhotoDelete', success: false, code: 2, error: 'auth error', message: 'photo has not been deleted' });
						}
					}
					
				}else{
					return res.status(404).json({ endpoint: 'admin', operation: 'partnerPhotoDelete', success: false, code: 5, error: 'auth error', message: 'not valid admin' });
				}
			}catch(err){
				return res.status(500).json({ endpoint: 'admin', operation: 'partnerPhotoDelete', success: false, code: 3, error: 'selection error', message:'verification problem' });
			}
		}else{
			return res.status(500).json({ endpoint: 'admin', operation: 'partnerPhotoDelete', success: false, code: 4, error: 'selection error', message:'no auth token' });
		}
	}

	if (req.query.operation === 'devAuth') {
		const token = req.headers.authorization;
		
		if (!isEmpty(token)) {
			try{
				const decoded = verifyToken(token);
				const admin = encodeId(decoded['sub']); 
				if ( admin === Keys.ADMIN_BASIC_DEV_KEY) {
					return res.status(200).json({ endpoint: 'admin', operation: 'devAuth', success: true, code: 1, message: 'ok' });
				}else{
					return res.status(404).json({ endpoint: 'admin', operation: 'devAuth', success: false, code: 2, error: 'devAuth error', message: 'not valid dev' });
				}
			}catch(err){
				return res.status(500).json({ endpoint: 'admin', operation: 'devAuth', success: false, code: 3, error: 'selection error', message:'verification problem' });
			}
		}else{
			return res.status(500).json({ endpoint: 'admin', operation: 'devAuth', success: false, code: 4, error: 'selection error', message:'no auth token' });
		}
		
	}

	if (req.query.operation === 'auth') {
		const token = req.headers.authorization;
		
		if (!isEmpty(token)) {
			try{
				const decoded = verifyToken(token);
				const admin = encodeId(decoded['sub']); 
				if ( admin === Keys.ADMIN_PASS) {
					return res.status(200).json({ endpoint: 'admin', operation: 'auth', success: true, code: 1, message: 'ok' });
				}else{
					return res.status(404).json({ endpoint: 'admin', operation: 'auth', success: false, code: 2, error: 'auth error', message: 'not valida admin' });
				}
			}catch(err){
				return res.status(500).json({ endpoint: 'admin', operation: 'auth', success: false, code: 3, error: 'selection error', message:'verification problem' });
			}
		}else{
			return res.status(500).json({ endpoint: 'admin', operation: 'auth', success: false, code: 4, error: 'selection error', message:'no auth token' });
		}
	}

	if (req.query.operation === 'partnerFieldObjectSave') {
		const token = req.headers.authorization;
		
		if (!isEmpty(token)) {
			try{
				const decoded = verifyToken(token);
				const admin = encodeId(decoded['sub']); 
				if ( admin === Keys.ADMIN_PASS) {

					if (!req.body['partnerId'] || !req.body['field'] || !req.body['value']) {
						return res.status(404).json({ endpoint: 'admin', operation: 'partnerMapSave', success: false, code: 6, error: 'auth error', message: 'request data not valid' });
					}else{
						const {partnerId, field, value } = req.body;
						await connectToDb(req.headers.host);
						const partner = await Partner.findOneAndUpdate({ '_id': partnerId }, {"$set" : { [field]: value } }, { new: true }).select('-password');

						if (partner) {
							return res.status(200).json({ endpoint: 'admin', operation: 'partnerMapSave', success: true, code: 1, partner });
						}else{
							return res.status(404).json({ endpoint: 'admin', operation: 'partnerMapSave', success: false, code: 2, error: 'auth error', message: 'not valida partner id' });
						}
					}
				}else{
					return res.status(404).json({ endpoint: 'admin', operation: 'partnerMapSave', success: false, code: 5, error: 'auth error', message: 'not valida admin' });
				}
			}catch(err){
				return res.status(500).json({ endpoint: 'admin', operation: 'partnerMapSave', success: false, code: 3, error: 'selection error', message:'verification problem' });
			}
		}else{
			return res.status(500).json({ endpoint: 'admin', operation: 'partnerMapSave', success: false, code: 4, error: 'selection error', message:'no auth token' });
		}
	}

	if (req.query.operation === 'partnerPhotoSave') {
		const token = req.headers.authorization;
		
		if (!isEmpty(token)) {
			try{
				const decoded = verifyToken(token);
				const admin = encodeId(decoded['sub']); 
				if ( admin === Keys.ADMIN_PASS) {
					if (!req.body.partnerId || !req.body.photos) {
						return res.status(404).json({ endpoint: 'admin', operation: 'partnerPhotoSave', success: false, code: 6, error: 'auth error', message: 'request data not valida' });
					}else{
						const {partnerId, photos } = req.body;
						await connectToDb(req.headers.host);
						const partner = await Partner.findOneAndUpdate({ '_id': partnerId }, {"$set" : { photos } }, { new: true }).select('-password');

						if (partner) {
							return res.status(200).json({ endpoint: 'admin', operation: 'partnerPhotoSave', success: true, code: 1, partner });
						}else{
							return res.status(404).json({ endpoint: 'admin', operation: 'partnerPhotoSave', success: false, code: 2, error: 'auth error', message: 'not valida partner id' });
						}
					}
				}else{
					return res.status(404).json({ endpoint: 'admin', operation: 'partnerPhotoSave', success: false, code: 5, error: 'auth error', message: 'not valida admin' });
				}
			}catch(err){
				return res.status(500).json({ endpoint: 'admin', operation: 'partnerPhotoSave', success: false, code: 3, error: 'selection error', message:'verification problem' });
			}
		}else{
			return res.status(500).json({ endpoint: 'admin', operation: 'partnerPhotoSave', success: false, code: 4, error: 'selection error', message:'no auth token' });
		}
	}


	if (req.query.operation === 'searchFin') {
		const token = req.headers.authorization;
		
		if (!isEmpty(token)) {
			try{
				const decoded = verifyToken(token);
				const admin = encodeId(decoded['sub']); 
				if ( admin === Keys.ADMIN_PASS) {
					if (!req.body['year'] || !req.body['month'] || !req.body['type'] || !Number.isInteger(req.body['year']) || !Number.isInteger(req.body['month']) || !Number.isInteger(req.body['type'])) {
						return res.status(404).json({ endpoint: 'admin', operation: 'searchFin', success: false, code: 5, error: 'data error', message: 'request data not valid' });
					}else{
						const {year, month, partner, type } = req.body;
						await connectToDb(req.headers.host);
						const dateHandler = new DateHandler();
						const monthDates = dateHandler.getMonthStopStartDates(month, year);
						let reservations = [];
						const lookup = { 
							from: 'partners', 
							let: { partner: '$partner'}, //
							pipeline: [
								{ $addFields: { "partner": { "$toString": "$_id" }}},
			          { $match:
			             { 
			             		$expr: { $eq: [ "$$partner", "$partner" ] }
			             }
			          }
			        ],
			        as: "partnerObj"
						};

						const lookup1 = { 
							from: 'users', 
							let: { user: '$user'}, //
							pipeline: [
								{ $addFields: { "user": { "$toString": "$_id" }}},
			          { $match:
			             { 
			             		$expr: { $eq: [ "$$user", "$user" ] }
			             }
			          }
			        ],
			        as: "userObj"
						};

						const dateLook = type === 1 ? 'toDate' : 'createdAt';

						if (partner) {
							reservations = await Reservation.aggregate([{ $match: { 'type': 'user', 'doubleNumber': 1, 'active': true, 'confirmed': true, 'partner': partner, [dateLook]: { '$gte': monthDates['start'], '$lt': monthDates['end'] }}}, {$lookup: lookup}, {$lookup: lookup1}, {$project: {'transactionCard': 0, 'partnerObj.password': 0, 'partnerObj.contactEmail': 0, 'partnerObj.contactPerson': 0, 'partnerObj.photos': 0, 'partnerObj.passSafetyCode': 0, 'partnerObj.map': 0 }}, { $sort : { [dateLook] : 1 } }]);
						}else{
							reservations = await Reservation.aggregate([{ $match: { 'type': 'user', 'doubleNumber': 1, 'active': true, 'confirmed': true, [dateLook]: { '$gte': monthDates['start'], '$lt': monthDates['end'] }}}, {$lookup: lookup}, {$lookup: lookup1}, {$project: {'transactionCard': 0, 'partnerObj.password': 0, 'partnerObj.contactEmail': 0, 'partnerObj.contactPerson': 0, 'partnerObj.photos': 0, 'partnerObj.passSafetyCode': 0, 'partnerObj.map': 0 }}, { $sort : { [dateLook] : 1 } }]);
						}
						
						const arr = setUserNameOnAdminFinObject(reservations);

						return res.status(200).json({ endpoint: 'admin', operation: 'searchFin', success: true, code: 1, reservations: arr });
					}
				}else{
					return res.status(404).json({ endpoint: 'admin', operation: 'searchFin', success: false, code: 2, error: 'auth error', message: 'not valida admin' });
				}
			}catch(err){
				return res.status(500).json({ endpoint: 'admin', operation: 'searchFin', success: false, code: 3, error: 'selection error', message:'verification problem' });
			}
		}else{
			return res.status(500).json({ endpoint: 'admin', operation: 'searchFin', success: false, code: 4, error: 'auth error', message:'no auth token' });
		}
	}


	if (req.query.operation === 'generateSerialNums') {
		const token = req.headers.authorization;
		
		if (!isEmpty(token)) {
			try{
				const decoded = verifyToken(token);
				const admin = encodeId(decoded['sub']); 
				if ( admin === Keys.ADMIN_PASS) {
					if (!req.body['year'] || !req.body['month'] || !req.body['type'] || !Number.isInteger(req.body['year']) || !Number.isInteger(req.body['month']) || !Number.isInteger(req.body['type'])) {
						return res.status(404).json({ endpoint: 'admin', operation: 'generateSerialNums', success: false, code: 6, error: 'data error', message: 'request data not valid' });
					}else{
						const {year, month, partner, type } = req.body;
						await connectToDb(req.headers.host);
						const dateHandler = new DateHandler();
						const monthDates = dateHandler.getMonthStopStartDates(month, year);

						const lookup = { 
							from: 'partners', 
							let: { partner: '$partner'}, //
							pipeline: [
								{ $addFields: { "partner": { "$toString": "$_id" }}},
			          { $match:
			             { 
			             		$expr: { $eq: [ "$$partner", "$partner" ] }
			             }
			          }
			        ],
			        as: "partnerObj"
						};

						const lookup1 = { 
							from: 'users', 
							let: { user: '$user'}, //
							pipeline: [
								{ $addFields: { "user": { "$toString": "$_id" }}},
			          { $match:
			             { 
			             		$expr: { $eq: [ "$$user", "$user" ] }
			             }
			          }
			        ],
			        as: "userObj"
						};

						const dateLook = type === 1 ? 'toDate' : 'createdAt';
						const genType = type === 1 ? 'invoiceNumber' : 'preInvoiceNumber';
						const prefix = type === 1 ? 'INV' : 'PNV';

						const reservations = await Reservation.aggregate([{ $match: { 'type': 'user', 'doubleNumber': 1, 'active': true, 'confirmed': true, [dateLook]: { '$gte': monthDates['start'], '$lt': monthDates['end'] }}}, {$lookup: lookup}, {$lookup: lookup1}, {$project: {'transactionCard': 0, 'partnerObj.password': 0, 'partnerObj.contactEmail': 0, 'partnerObj.contactPerson': 0, 'partnerObj.photos': 0, 'partnerObj.passSafetyCode': 0, 'partnerObj.map': 0 }}, { $sort : { [dateLook] : 1 } }]);
						const genInfo = getBasicForSerialGenerator(reservations, genType);

						if (genInfo['ids'].length) {
							const ops = genInfo['ids'].map((item, index) => { 
								const newNum = genInfo['num'] + index + 1;
								const newgen = `${prefix}-${month}-${newNum}`;
						    return { 
					        "updateOne": { 
				            "filter": { 
				              "_id": item,
				            },              
				            "update": { "$set": { [genType]: newgen } } 
					        }         
						    }    
							});

							const callback = (err, r) => {
								if (err) {
									console.log(err);
								}else{
									// console.log(r.matchedCount);
							  //   console.log(r.modifiedCount);
								}  
							}

							await Reservation.bulkWrite(ops, callback);
							const result = await Reservation.aggregate([{ $match: { 'type': 'user', 'doubleNumber': 1, 'active': true, 'confirmed': true, [dateLook]: { '$gte': monthDates['start'], '$lt': monthDates['end'] }}}, {$lookup: lookup}, {$lookup: lookup1}, {$project: {'transactionCard': 0, 'partnerObj.password': 0, 'partnerObj.contactEmail': 0, 'partnerObj.contactPerson': 0, 'partnerObj.photos': 0, 'partnerObj.passSafetyCode': 0, 'partnerObj.map': 0 }}, { $sort : { [dateLook] : 1 } }]);
							const arr1 = setUserNameOnAdminFinObject(result);

							return res.status(200).json({ endpoint: 'admin', operation: 'generateSerialNums', success: true, code: 1, reservations: arr1 });
						}else{
							const arr = setUserNameOnAdminFinObject(reservations);
							return res.status(200).json({ endpoint: 'admin', operation: 'generateSerialNums', success: true, code: 2, reservations: arr });
						}
					}
				}else{
					return res.status(404).json({ endpoint: 'admin', operation: 'generateSerialNums', success: false, code: 3, error: 'auth error', message: 'not valida admin' });
				}
			}catch(err){
				return res.status(500).json({ endpoint: 'admin', operation: 'generateSerialNums', success: false, code: 4, error: 'selection error', message:'verification problem' });
			}
		}else{
			return res.status(500).json({ endpoint: 'admin', operation: 'generateSerialNums', success: false, code: 5, error: 'auth error', message:'no auth token' });
		}
	}



	process.on('unhandledRejection', function(err) {
	    console.log(err);
	});

	process.on('SIGINT', function(){
      mongoose.connection.close(function(){
          console.log("Mongoose default connection is disconnected due to application termination");
          process.exit(0)
      });
  });
	
}