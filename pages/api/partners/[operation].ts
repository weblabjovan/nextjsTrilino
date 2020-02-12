import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt'; 
import Partner from '../../../server/models/partner';
import Reservation from '../../../server/models/reservation';
import connectToDb  from '../../../server/helpers/db';
import { generateString, encodeId, decodeId, setToken, verifyToken, createSearchQuery, setDateForServer, getFreeTermPartners, calculatePartnerCapacity, preparePartnerForLocation, preparePartnerForReservation, isUrlTermValid }  from '../../../server/helpers/general';
import { sendEmail }  from '../../../server/helpers/email';
import { isPartnerRegDataValid, isGeneralDataValid, isCateringDataValid, isDecorationDataValid, isPartnerForActivation, dataHasValidProperty, isReservationPartnerDataValid, isGetMultiplePartnersDataValid, isGetSinglePartnerDataValid } from '../../../server/helpers/validations';
import { isEmpty, isMoreThan, isLessThan, isOfRightCharacter, isMatch, isPib, isEmail } from '../../../lib/helpers/validations';
import { setUpLinkBasic } from '../../../lib/helpers/generalFunctions';
import DateHandler from '../../../lib/classes/DateHandler';
import { getLanguage } from '../../../lib/language';

export default async (req: NextApiRequest, res: NextApiResponse ) => {



	//////////////////////////////////////   SAVE   ///////////////////////////////////////////////




	if (req.query.operation === 'save') {
		const { name, taxNum, city, contactPerson, contactEmail, contactPhone, language } = req.body;
		const userlanguage = language;
		const dictionary = getLanguage(language);

		if (isPartnerRegDataValid(req.body)) {
  		try{
  			await connectToDb(req.headers.host);
  			const replica = await Partner.findOne({ taxNum });
  			if (replica) {
		    	return res.status(401).send({ endpoint: 'partners', operation: 'save', success: false, code: 2, error: 'validation error', message: dictionary['apiPartnerSaveCode2'] });
				}else{

	    		const country = 'Serbia';
	    		const district = '0';
	    		const created = new Date();
	    		const passProvided = false;
	    		const verified = false;
	    		const passSafetyCode = generateString(8);

	    		const newPartner = new Partner({ name, taxNum, city, district, contactPerson, contactEmail, contactPhone, verified, country, created, passProvided, userlanguage, passSafetyCode });
	    		
	    		const par = await newPartner.save();

	    		const sender = {name:'Trilino', email:'no.reply@trilino.com'};
  				const to = [{name:contactPerson, email:contactEmail }];
  				const bcc = null;
  				const templateId = 2;

  				const page = decodeId(generateString, par._id);
  				const link = `${req.headers.origin}/emailVerification?language=${language}&page=${page}&type=partner`;

  				const params = { title: `${name} ${dictionary['emailPartnerRegisterTitle']}`, text: `${dictionary['emailPartnerRegisterText']}`, code: `${dictionary['emailPartnerRegisterCode']} ${passSafetyCode}`, link: link, button: `${dictionary['emailPartnerRegisterButton']}`};
  				const email = { sender, to, bcc, templateId, params };

				const emailSe =	await sendEmail(email);

		    	return res.status(200).json({ endpoint: 'partners', operation: 'save', success: true, code: 1 });
				}
  		}catch(err){
  			return res.status(500).send({ endpoint: 'partners', operation: 'save', success: false, code: 4, error: 'db error', message: err  });
  		}
		}else{
	    return res.status(401).send({ endpoint: 'partners', operation: 'save', success: false, code: 3, error: 'validation error', message: dictionary['apiPartnerSaveCode5']  });
		}
	  	
	}



	//////////////////////////////////////   GET   ///////////////////////////////////////////////




	if (req.query.operation === 'get'){
		const { type } = req.body;
		const userlanguage = req['query']['language'] ? req['query']['language'].toString() : 'sr';
		const dictionary = getLanguage(userlanguage);
		const multiple = req['query']['multiple'] ? true : false;

		if (multiple) {
			if (!isGetMultiplePartnersDataValid(req['query'])) {
				return res.status(404).json({ endpoint: 'partners', operation: 'get multiple', success: false, code: 3,  message: 'invalid query data' });
			}else{
				const query = createSearchQuery(req['query']);
				const dateString = req['query']['date'] as string;
				const dateHandler = new DateHandler(req['query']['date']);
				const queryDate = dateHandler.formatDateString('server');
				const lookup = { 
					from: 'reservations', 
					let: { partnerId: '$_id'},
					pipeline: [
						{ $addFields: { "partnerId": { "$toObjectId": "$partner" }}},
	          { $match:
	             { $expr:
	                { $and:
	                   [
	                     { $eq: [ "$partnerId",  "$$partnerId" ] }
	                   ]
	                }
	             }
	          },
	          { $match: { "date": queryDate }}
	        ],
	        as: "reservations"
				};

				try{
					await connectToDb(req.headers.host);
					const partnersOne = await Partner.aggregate([{ $match: query }, {$lookup: lookup}, {$project: {'password': 0, 'passSafetyCode': 0, 'passProvided': 0, 'verified': 0 }} ]);
					const partners = getFreeTermPartners(partnersOne, dateString);
					return res.status(200).json({ endpoint: 'partners', operation: 'get multiple', success: true, code: 1, partners,  message: 'Ok' });
				}catch(err){
					return res.status(500).json({ endpoint: 'partners', operation: 'get multiple', success: false, code: 2,  message: req['query'] });
				}
			}
		}else{
			if (type === 'profile') {
				const token = req.headers.authorization;
				if (!isEmpty(token)) {
					try{
						await connectToDb(req.headers.host);
						const decoded = verifyToken(token);
						const partnerId = encodeId(decoded['sub']);

						const partner = await Partner.findById(partnerId, '-password -passSafetyCode -passProvided -verified');
						if (partner) {
							return res.status(200).json({ endpoint: 'partners', operation: 'get profile', success: true, code: 1,  message: dictionary['apiPartnerAuthCode1'], partner });
						}else{
							return res.status(404).json({ endpoint: 'partners', operation: 'auth', success: false, code: 2, error: 'selection error', message: dictionary['apiPartnerAuthCode2'] });
						}
					}catch(err){
						return res.status(401).json({ endpoint: 'partners', operation: 'get profile', success: false, code: 3, error: 'auth error', message: err });
					}
				}else{
					return res.status(401).json({ endpoint: 'partners', operation: 'get profile', success: false, code: 4, error: 'auth error', message: dictionary['apiPartnerAuthCode2'] });
				}
			}else if (req['query']['type'] === 'reservation') {
				console.log('ovde 1111')
				if (!isReservationPartnerDataValid(req['query'])) {
					return res.status(404).send({ endpoint: 'partners', operation: 'get', success: false, code: 4, error: 'validation error', message: 'send data is not valid' });
				}else{
					let partnerId = req['query']['partner'].toString();

					if (req['query']['encoded']) {
						partnerId = encodeId(partnerId);
					}

					try{
						await connectToDb(req.headers.host);
						const partnerOne = await Partner.findById(partnerId).select('-password -passSafetyCode -passProvided -verified');
						if (partnerOne) {
							if (!isUrlTermValid(partnerOne['general']['rooms'], req['query'])) {
								return res.status(404).send({ endpoint: 'partners', operation: 'get', success: false, code: 4, error: 'validation error', message: 'send data is not valid 1' });
							}else{
								const dateHandler = new DateHandler(req['query']['date']);
								const queryDate = dateHandler.formatDateString('server');
								const reservations = await Reservation.find({partner: partnerId, active: true, date: queryDate, room: req['query']['room'], to: req['query']['to'], from: req['query']['from'] });
								if (reservations.length) {
									return res.status(404).send({ endpoint: 'partners', operation: 'get', success: false, code: 4, error: 'validation error', message: 'send data is not valid 2' });
								}else{
									const partnerRes = preparePartnerForReservation(partnerOne, req['query']);
									return res.status(200).json({ endpoint: 'partners', operation: 'get', success: true, code: 1, partner: partnerRes });
								}
							}
						}else{
							return res.status(404).json({ endpoint: 'partners', operation: 'get', success: false, code: 2, error: 'selection error', message: dictionary['apiPartnerGetCode2'] });
						}
					}catch(err){
						return res.status(500).send({ endpoint: 'partners', operation: 'get', success: false, code: 3, error: 'db error', message: err  });
					}
				}
			}else{
				if (!isGetSinglePartnerDataValid(req['query'])) {
					return res.status(404).json({ endpoint: 'partners', operation: 'get', success: false, code: 2, error: 'validation error', message: 'invalid data sent' });
				}else{
					let partnerId = req['query']['partner'].toString();

					if (req['query']['encoded']) {
						partnerId = encodeId(partnerId);
					}

					try{
						let partner = null;
						if (req['query']['date']) {
							const dateString = req['query']['date'] as string;
							const dateHandler = new DateHandler(req['query']['date']);
							const queryDate = dateHandler.formatDateString('server');
							const lookup = { 
								from: 'reservations', 
								let: { partnerId: '$_id'},
								pipeline: [
									{ $addFields: { "partnerId": { "$toObjectId": "$partner" }}},
				          { $match:
				             { $expr:
				                { $and:
				                   [
				                     { $eq: [ "$partnerId",  "$$partnerId" ] }
				                   ]
				                }
				             }
				          },
				          { $match: { "date": queryDate }},
				          { $match: { "active": true }},
				        ],
				        as: "reservations"
							};

							await connectToDb(req.headers.host);
							const ObjectId = mongoose.Types.ObjectId;
							const Agregate = await Partner.aggregate([{ $match: { '_id': ObjectId(partnerId) } }, {$lookup: lookup}, {$project: {'password': 0, 'passSafetyCode': 0, 'passProvided': 0, 'verified': 0 }}]);
							partner = preparePartnerForLocation(Agregate[0], dateString);
						}else{
							await connectToDb(req.headers.host);
							partner = await Partner.findById(partnerId, '-password');
						}
						
						if (partner) {
							return res.status(200).json({ endpoint: 'partners', operation: 'get', success: true, code: 1, partner: partner });
						}else{
							return res.status(404).json({ endpoint: 'partners', operation: 'get', success: false, code: 2, error: 'selection error', message: dictionary['apiPartnerGetCode2'] });
						}
					}catch(err){
						return res.status(500).send({ endpoint: 'partners', operation: 'get', success: false, code: 3, error: 'db error', message: err  });
					}
				}
			}
		}
	}


	//////////////////////////////////////   UPDATE   ///////////////////////////////////////////////



	if (req.query.operation === 'update'){
		if (!dataHasValidProperty(req.body, ['param', 'data', 'type'])) {
			return res.status(500).send({ endpoint: 'partners', operation: 'update', success: false, code: 10, error: 'basic validation error'  });
		}else{
			const { param, data, type } = req.body;
			const dictionary = getLanguage(data.language);

			if (type === 'verification') {
				if (!dataHasValidProperty(data, ['id', 'options'])) {
					return res.status(404).json({ endpoint: 'partners', operation: 'update', success: false, code: 4, error: 'validation error' });
				}else{
					const { id, options} = data;
					try{
						await connectToDb(req.headers.host);
						const partnerId = encodeId(id);
						const partner = await Partner.findOneAndUpdate({ '_id': partnerId }, {"$set" : options }, { new: true }).select('-password');
						
						if (partner) {
							return res.status(200).json({ endpoint: 'partners', operation: 'update', success: true, code: 1, partner: partner });
						}else{
							return res.status(404).json({ endpoint: 'partners', operation: 'update', success: false, code: 2, error: 'selection error', message: dictionary['apiPartnerUpdateVeriCode2'] });
						}
					}catch(err){
						return res.status(500).send({ endpoint: 'partners', operation: 'update', success: false, code: 3, error: 'db error', message: err  });
					}
				}
				
			}

			if (type === 'password') {
				if (isEmpty(data.password) || !isMoreThan(data.password, 7) || !isLessThan(data.password, 17) || !isOfRightCharacter(data.password) || isEmpty(data.confirmation) || !isMatch(data.password, data.confirmation) || isEmpty(data.code)) {
					return res.status(500).json({ endpoint: 'partners', operation: 'update', success: false, code: 2, error: 'password data validation error', message: dictionary['apiPartnerUpdatePassCode2'] });
				}else{
					try{
						await connectToDb(req.headers.host);
						const salt = await bcrypt.genSalt(10);
						const passHash = await bcrypt.hash(data.password, salt);
						const id = encodeId(data.id);
						const partner = await Partner.findOneAndUpdate({ '_id': id, 'passSafetyCode': data.code }, {"$set" : { passSafetyCode : '', password: passHash, passProvided: true } }, { new: true }).select('-password');
						if (partner) {
							return res.status(200).json({ endpoint: 'partners', operation: 'update', success: true, code: 1, partner: partner });
						}else{
							return res.status(404).json({ endpoint: 'partners', operation: 'update', success: false, code: 3, error: 'selection error', message: dictionary['apiPartnerUpdatePassCode3'] });
						}
					}catch(err){
						return res.status(500).send({ endpoint: 'partners', operation: 'update', success: false, code: 4, error: 'db error', message: err  });
					}
				
				}
			}

			if (type === 'passwordChange') {
				if (!isPib(data['taxNum'], 'sr') || !isEmail(data['email'])) {
					return res.status(400).json({ endpoint: 'partners', operation: 'update', success: false, code: 2, error: 'validation error', message: dictionary['apiPartnerUpdatePassCode2'] });
				}else{
					try{
						await connectToDb(req.headers.host);
						const partner = await Partner.findOne({ taxNum: data['taxNum'], contactEmail: data['email'] });

						if (partner) {
							const passSafetyCode = generateString(8);
							const update = await Partner.findOneAndUpdate({ '_id': partner._id }, {"$set" : { passSafetyCode } }, { new: true }).select('-password');
							const sender = {name:'Trilino', email:'no.reply@trilino.com'};
		  				const to = [{name: partner.contactPerson, email: partner.contactEmail }];
		  				const bcc = null;
		  				const templateId = 2;

		  				const page = decodeId(generateString, partner._id);
		  				const link = `${req.headers.origin}/password?language=${data['language']}&page=${page}&type=partner`;

		  				const params = { title: `${partner['name']} ${dictionary['emailPartnerForgotPassTitle']}`, text: `${dictionary['emailPartnerForgotPassText']}`, code: `${dictionary['emailPartnerForgotPassCode']} ${passSafetyCode}`, link: link, button: `${dictionary['emailPartnerForgotPassButton']}`};
		  				const email = { sender, to, bcc, templateId, params };

		  				const emailSe =	await sendEmail(email);
	  					return res.status(200).json({ endpoint: 'partners', operation: 'update', success: true, code: 1 });
						}else{
							return res.status(404).json({ endpoint: 'partners', operation: 'update', success: false, code: 3, error: 'selection error', message: dictionary['apiPartnerUpdateReqPassCode3'] });
						}
					}catch(err){
						return res.status(500).json({ endpoint: 'partners', operation: 'update', success: false, code: 4, error: 'server error', message: err });
					}
				}
			}

			if (type == 'general') {
				const token = req.headers.authorization;
				if (!isEmpty(token)) {
					if (!isGeneralDataValid(data['general'])) {
						return res.status(500).json({ endpoint: 'partners', operation: 'validation', success: false, code: 5, error: 'validation error', message: dictionary['apiPartnerSaveCode5'] });
					}
					try{
						await connectToDb(req.headers.host);
						const decoded = verifyToken(token);
						const partnerId = encodeId(decoded['sub']);
						const partnerFrontObj = data['partner'];
						partnerFrontObj['general'] = data['general'];
						const district = data['partner']['district'];
						if (data['general']['ageFrom']) {
							data['general']['ageFrom'] = parseInt(data['general']['ageFrom']);
						}
						if (data['general']['ageTo']) {
							data['general']['ageTo'] = parseInt(data['general']['ageTo']);
						}
						if (data['general']['rooms']) {
							data['general']['capacity'] = calculatePartnerCapacity(data['general']['rooms']);
						}
						

						const partner = await Partner.findOneAndUpdate({ '_id': partnerId }, {"$set" : { district, general: data['general'], forActivation: isPartnerForActivation(partnerFrontObj) } }, { new: true }).select('-password');
						if (partner) {
							return res.status(200).json({ endpoint: 'partners', operation: 'update general', success: true, code: 1,  message: dictionary['apiPartnerAuthCode1'], partner });
						}else{
							return res.status(500).json({ endpoint: 'partners', operation: 'auth', success: false, code: 2, error: 'selection error', message: dictionary['apiPartnerAuthCode2'] });
						}
					}catch(err){
						return res.status(401).json({ endpoint: 'partners', operation: 'update general', success: false, code: 3, error: 'auth error', message: err });
					}
				}else{
					return res.status(401).json({ endpoint: 'partners', operation: 'update general', success: false, code: 4, error: 'auth error', message: dictionary['apiPartnerAuthCode2'] });
				}
			}

			if (type == 'offer') {
				const token = req.headers.authorization;
				if (!isEmpty(token)) {
					if (!Array.isArray(data['offer']) || !Array.isArray(data['addon'])) {
						return res.status(500).json({ endpoint: 'partners', operation: 'validation', success: false, code: 2, error: 'validation error', message: dictionary['apiPartnerSaveCode5'] });
					}
					try{
						await connectToDb(req.headers.host);
						const decoded = verifyToken(token);
						const partnerId = encodeId(decoded['sub']);
						const partnerFrontObj = data['partner'];
						partnerFrontObj['contentOffer'] = data['offer'];
						partnerFrontObj['contentAddon'] = data['addon'];

						const partner = await Partner.findOneAndUpdate({ '_id': partnerId }, {"$set" : { contentOffer: data['offer'], contentAddon: data['addon'], forActivation: isPartnerForActivation(partnerFrontObj) } }, { new: true }).select('-password');
						if (partner) {
							return res.status(200).json({ endpoint: 'partners', operation: 'update offer', success: true, code: 1,  message: dictionary['apiPartnerAuthCode1'], partner });
						}else{
							return res.status(500).json({ endpoint: 'partners', operation: 'auth', success: false, code: 2, error: 'selection error', message: dictionary['apiPartnerAuthCode2'] });
						}
					}catch(err){
						return res.status(401).json({ endpoint: 'partners', operation: 'update offer', success: false, code: 3, error: 'auth error', message: err });
					}
				}else{
					return res.status(401).json({ endpoint: 'partners', operation: 'update offer', success: false, code: 4, error: 'auth error', message: dictionary['apiPartnerAuthCode2'] });
				}
			}

			if (type == 'catering') {
				const token = req.headers.authorization;
				if (!isEmpty(token)) {
					if (!isCateringDataValid(data['catering'])) {
						return res.status(500).json({ endpoint: 'partners', operation: 'validation', success: false, code: 2, error: 'validation error', message: dictionary['apiPartnerSaveCode5'] });
					}
					try{
						await connectToDb(req.headers.host);
						const decoded = verifyToken(token);
						const partnerId = encodeId(decoded['sub']);
						const partnerFrontObj = data['partner'];
						partnerFrontObj['catering'] = data['catering'];

						const partner = await Partner.findOneAndUpdate({ '_id': partnerId }, {"$set" : { catering: data['catering'], forActivation: isPartnerForActivation(partnerFrontObj) } }, { new: true }).select('-password');
						if (partner) {
							return res.status(200).json({ endpoint: 'partners', operation: 'update catering', success: true, code: 1,  message: dictionary['apiPartnerAuthCode1'], partner });
						}else{
							return res.status(500).json({ endpoint: 'partners', operation: 'auth', success: false, code: 2, error: 'selection error', message: dictionary['apiPartnerAuthCode2'] });
						}
					}catch(err){
						return res.status(401).json({ endpoint: 'partners', operation: 'update catering', success: false, code: 3, error: 'auth error', message: err });
					}
				}else{
					return res.status(401).json({ endpoint: 'partners', operation: 'update catering', success: false, code: 4, error: 'auth error', message: dictionary['apiPartnerAuthCode2'] });
				}
			}


			if (type == 'decoration') {
				const token = req.headers.authorization;
				if (!isEmpty(token)) {
					if (!isDecorationDataValid(data['decoration'])) {
						return res.status(500).json({ endpoint: 'partners', operation: 'validation', success: false, code: 2, error: 'validation error', message: dictionary['apiPartnerSaveCode5'] });
					}
					try{
						await connectToDb(req.headers.host);
						const decoded = verifyToken(token);
						const partnerId = encodeId(decoded['sub']);
						const partner = await Partner.findOneAndUpdate({ '_id': partnerId }, {"$set" : { decoration: data['decoration'] } }, { new: true }).select('-password');
						if (partner) {
							return res.status(200).json({ endpoint: 'partners', operation: 'update decoration', success: true, code: 1,  message: dictionary['apiPartnerAuthCode1'], partner });
						}else{
							return res.status(500).json({ endpoint: 'partners', operation: 'auth', success: false, code: 2, error: 'selection error', message: dictionary['apiPartnerAuthCode2'] });
						}
					}catch(err){
						return res.status(401).json({ endpoint: 'partners', operation: 'update decoration', success: false, code: 3, error: 'auth error', message: err });
					}
				}else{
					return res.status(401).json({ endpoint: 'partners', operation: 'update decoration', success: false, code: 4, error: 'auth error', message: dictionary['apiPartnerAuthCode2'] });
				}
			}
		}
	}



	//////////////////////////////////////   LOGIN   ///////////////////////////////////////////////



	

	if (req.query.operation === 'login') {

		if (!dataHasValidProperty(req.body, ['taxNum', 'password', 'language'])) {
			return res.status(404).json({ endpoint: 'partners', operation: 'login', success: false, code: 10, error: 'basic validation error' });
		}else{
			const { taxNum, password, language } = req.body;
			const dictionary = getLanguage(language);

			if (!isPib(taxNum, 'sr') || isEmpty(password)) {
				res.status(400).send({ endpoint: 'partners', operation: 'login', success: false, code: 4, error: 'validation error', message: dictionary['apiPartnerLoginCode4']  });
			}else{
				try{
					await connectToDb(req.headers.host);
					const partner = await Partner.findOne({taxNum});
					if (partner) {
						if (partner.passProvided) {
							const match = await bcrypt.compare(password, partner.password);
							
							if (match) {
								const token = setToken('partner', decodeId(generateString, partner._id));
								return res.status(200).json({ endpoint: 'partners', operation: 'update', success: true, code: 1, token: token });
							}else{
								return res.status(404).json({ endpoint: 'partners', operation: 'login', success: false, code: 2, error: 'selection error', message: dictionary['apiPartnerLoginCode2'] });
							}
						}else{
							return res.status(404).json({ endpoint: 'partners', operation: 'login', success: false, code: 5, error: 'selection error', message: dictionary['apiPartnerLoginCode5'] });
						}
					}else{
						return res.status(404).json({ endpoint: 'partners', operation: 'login', success: false, code: 3, error: 'selection error', message: dictionary['apiPartnerLoginCode3'] });
					}
				}catch(err){
					return res.status(500).send({ endpoint: 'partners', operation: 'login', success: false, code: 6, error: 'db error', message: err  });
				}
			}
		}
	}



	//////////////////////////////////////   AUTH   ///////////////////////////////////////////////





	if (req.query.operation === 'auth') {
		const userlanguage = req['query']['language'] ? req['query']['language'].toString() : 'sr';
		const dictionary = getLanguage(userlanguage);

		const token = req.headers.authorization;
		if (!isEmpty(token)) {
				
			try{
				await connectToDb(req.headers.host);
				const decoded = verifyToken(token);
				const partnerId = encodeId(decoded['sub']); 
				const partner = await Partner.findById(partnerId, '-password');
				if (partner) {
					return res.status(200).json({ endpoint: 'partners', operation: 'auth', success: true, code: 1, message: dictionary['apiPartnerAuthCode1'] });
				}else{
					return res.status(500).json({ endpoint: 'partners', operation: 'auth', success: false, code: 2, error: 'selection error', message: dictionary['apiPartnerAuthCode2'] });
				}
			}catch(err){
				return res.status(500).json({ endpoint: 'partners', operation: 'auth', success: false, code: 3, error: 'selection error', message: dictionary['apiPartnerAuthCode2'] });
			}
			
		}else{
			return res.status(500).json({ endpoint: 'partners', operation: 'auth', success: false, code: 4, error: 'selection error', message: dictionary['apiPartnerAuthCode2'] });
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