import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt'; 
import Reservation from '../../../server/models/reservation';
import Partner from '../../../server/models/partner';
import User from '../../../server/models/users';
import Catering from '../../../server/models/trilinoCatering';
import connectToDb  from '../../../server/helpers/db';
import MyCriptor from '../../../server/helpers/MyCriptor';
import generalOptions from '../../../lib/constants/generalOptions';
import { generateString, encodeId, decodeId, setToken, verifyToken, extractRoomTerms, getFreeTerms, setDateTime, setReservationDateForBase, setDateForServer, sortCateringTypes, prepareReservationsForUserList, setCateringString, setDecorationString, setAddonString, getCancelPolicy, setReservationTimeString, packReservationwithDouble }  from '../../../server/helpers/general';
import { sendEmail }  from '../../../server/helpers/email';
import { isReservationSaveDataValid,  isReservationStillAvailable, dataHasValidProperty, isReservationConfirmDataValid } from '../../../server/helpers/validations';
import { isEmpty, isMoreThan, isLessThan, isOfRightCharacter, isMatch, isPib, isEmail } from '../../../lib/helpers/validations';
import { setUpLinkBasic, getArrayIndexByFieldValue, getArrayObjectByFieldValue, getObjectFieldByFieldValue } from '../../../lib/helpers/generalFunctions';
import { getGeneralOptionLabelByValue } from '../../../lib/helpers/specificPartnerFunctions';
import { getLanguage } from '../../../lib/language';
import DateHandler from '../../../lib/classes/DateHandler';
import Keys from '../../../server/keys';

export default async (req: NextApiRequest, res: NextApiResponse ) => {

	//////////////////////////////////////   SAVE   ///////////////////////////////////////////////


	if (req.query.operation === 'save') {
		if (!dataHasValidProperty(req.body, ['reservation', 'language', 'type'])) {
			return res.status(401).json({ endpoint: 'reservations', operation: 'save', success: false, code: 10, error: 'basic validation error' });
		}else{
			const { reservation, language, type } = req.body;
			const dictionary = getLanguage(language);
			const token = req.headers.authorization;
			let identifierId = '';

			try{
				await connectToDb(req.headers.host);
				if (type === 'partner' || type === 'user') {
					if (!isEmpty(token)) {
						

						let identification = false;
						if (type === 'partner') {
							const decoded = verifyToken(token);
							identifierId = encodeId(decoded['sub']);
							const identifier = await Partner.findById(identifierId, '-password -passSafetyCode -passProvided -verified');

							if (identifier['_id'] == reservation['partner']) {
								identification = true;
							}
						}

						if (type === 'user') {
							const decoded = verifyToken(token);
							identifierId = encodeId(decoded['sub']);
							const identifier = await User.findById(identifierId, '-password -passSafetyCode -passProvided');

							if (identifier) {
								identification = true;
							}
						}

						if (identification) {
							if (isReservationSaveDataValid(reservation)) {
								const reservations = await Reservation.find({ 'date': reservation['date'], 'partner': reservation['partner'], 'room': reservation['room']['value'], active: true }, { new: true }).select('from to _id');
								if (isReservationStillAvailable(reservation, reservations)) {
									const dateString = reservation['date'].substring(0,19);
									const dateHandler = new DateHandler(dateString);
									const catering = sortCateringTypes(reservation['food']);
									const doubleReference = generateString(17);

									let arr = [];
									const main = {
										partner: reservation['partner'],
										type: reservation['type'],
										room: reservation['room'],
										date: dateString,
										from: reservation['from'],
										fromDate: dateHandler.getDateWithTimeForServer(reservation['from']),
										to: reservation['to'],
										toDate: dateHandler.getDateWithTimeForServer(reservation['to']),
										double: reservation['double'],
										user: type === 'user' ? identifierId : reservation['user'],
										userName: reservation['userName'],
										guest: reservation['guest'],
										food: catering['partner'],
										animation: reservation['animation'],
										decoration: reservation['decoration'],
										comment: reservation['comment'],
										termPrice: reservation['termPrice'],
								    animationPrice: reservation['animationPrice'],
								    decorationPrice: reservation['decorationPrice'],
								    foodPrice: reservation['foodPrice'],
								    price: reservation['price'],
								    doubleReference: doubleReference,
								    deposit: reservation['deposit'],
								    trilinoPrice: reservation['trilinoPrice'],
								    trilino: Object.keys(catering['trilino']).length ? true : false,
								    doubleNumber: 1,
										active: true,
									};
									if (type === 'user') {
										main['confirmed'] = false;
									}
									arr.push(main);

									if (reservation['double']) {

										if (!reservation['terms']) {
											if (reservation['potentialDouble']) {
												if (!reservation['potentialDouble']['from'] || !reservation['potentialDouble']['to'] || !reservation['potentialDouble']['price']) {
													return res.status(401).json({ endpoint: 'reservations', operation: 'save', success: false, code: 8, error: 'double term error', message: dictionary['apiPartnerLoginCode4'] });
												}else{
													const diff = dateHandler.getDifferenceBetweenTwoTimes(reservation['to'], reservation['potentialDouble']['from'])
													if (diff < 30 || diff > 60) {
														return res.status(401).json({ endpoint: 'reservations', operation: 'save', success: false, code: 8, error: 'double term error', message: dictionary['apiPartnerLoginCode4'] });
													}
												}
												
											}else{
												return res.status(401).json({ endpoint: 'reservations', operation: 'save', success: false, code: 8, error: 'double term error', message: dictionary['apiPartnerLoginCode4'] });
											}
										}

										dateHandler.setNewDateString(dateString);

										const double = {
											partner: reservation['partner'],
											type: reservation['type'],
											room: reservation['room'],
											date: reservation['date'].substring(0,19),
											from: reservation['terms'] ? reservation['terms'][reservation['term']['value'] + 1]['from'] : reservation['potentialDouble']['from'],
											fromDate: reservation['terms'] ? dateHandler.getDateWithTimeForServer(reservation['terms'][reservation['term']['value'] + 1]['from']) : dateHandler.getDateWithTimeForServer(reservation['potentialDouble']['from']),
											to: reservation['terms'] ? reservation['terms'][reservation['term']['value'] + 1]['to'] : reservation['potentialDouble']['to'],
											toDate: reservation['terms'] ? dateHandler.getDateWithTimeForServer(reservation['terms'][reservation['term']['value'] + 1]['to']) : dateHandler.getDateWithTimeForServer(reservation['potentialDouble']['to']) ,
											double: reservation['double'],
											user: type === 'user' ? identifierId : reservation['user'],
											userName: reservation['userName'],
											guest: reservation['guest'],
											food: reservation['food'],
											animation: reservation['animation'],
											decoration: reservation['decoration'],
											comment: reservation['comment'],
											doubleReference: doubleReference,
											doubleNumber: 2,
											active: true,
										}
										arr.push(double);
									}

									const reserve = await Reservation.create(arr);
									
									if (Object.keys(catering['trilino']).length) {
										const newCateringBase = [{ reservation: reserve[0]['_id'], content: catering['trilino'], active: true, price: reservation['trilinoPrice'], status: 'ordered', deliveryDate: reservation['date'].substring(0,19), deliveryTime: reservation['from'], deliveryFullDate: dateHandler.getDateWithTimeForServer(reservation['from'])}];
										const newCatering = await Catering.create(newCateringBase);
									}
									
									return res.status(200).json({ endpoint: 'reservations', operation: 'save', success: true, code: 1, reservation: reserve  });
								}else{
									return res.status(404).json({ endpoint: 'reservations', operation: 'save', success: false, code: 2, error: 'validation error', message: 'Reservation for the same term was done by someone else in the mean time.' });
								}
							}else{
								return res.status(401).json({ endpoint: 'reservations', operation: 'save', success: false, code: 4, error: 'validation error', message: dictionary['apiPartnerLoginCode4'] });
							}		
						}else{
							return res.status(401).json({ endpoint: 'reservations', operation: 'save', success: false, code: 7, error: 'validation error', message: dictionary['apiPartnerLoginCode4'] });
						}
					}else{
						return res.status(401).json({ endpoint: 'reservations', operation: 'save', success: false, code: 6, error: 'validation error', message: dictionary['apiPartnerLoginCode4'] });
					}
				}else{
					return res.status(401).send({ endpoint: 'reservations', operation: 'save', success: false, code: 5, error: 'db error', message: dictionary['apiPartnerLoginCode4']  });
				}
			}catch(err){
				return res.status(500).send({ endpoint: 'reservations', operation: 'save', success: false, code: 3, error: 'db error', message: err  });
			}
		}
		
	}


	//////////////////////////////////////   GET FREE TERMS   ///////////////////////////////////////////////




	if (req.query.operation === 'getFreeTerms') {
		if (!dataHasValidProperty(req.body, ['date', 'language', 'partner', 'room'])) {
			return res.status(404).json({ endpoint: 'reservations', operation: 'availableTerms', success: false, code: 4, error: 'basic validation error' });
		}else{
			const { date, partner, room, language } = req.body;
			const dictionary = getLanguage(language);
			const dateString = date.substring(0,19);

			try{
				await connectToDb(req.headers.host);
					const reservations = await Reservation.find({ 'date': dateString, 'partner': partner, 'room': room, active: true }, { new: true }).select('from to _id active');
					const partnerObj = await Partner.findOne({'_id': partner});
					const d = new Date(dateString);
					const roomTerms = partnerObj['general'] ? extractRoomTerms(partnerObj['general']['rooms'], room, d.getDay()) : null;
					const freeTerms = getFreeTerms(reservations, roomTerms);

				
				if (reservations && partner) {
					if (roomTerms) {
						return res.status(200).json({ endpoint: 'reservations', operation: 'availableTerms', success: true, code: 1, freeTerms: freeTerms });
					}else{
						return res.status(404).json({ endpoint: 'reservations', operation: 'availableTerms', success: false, code: 4, error: 'selection error', message: dictionary['apiPartnerUpdateVeriCode2'] });
					}
				}else{
					return res.status(404).json({ endpoint: 'reservations', operation: 'availableTerms', success: false, code: 2, error: 'selection error', message: dictionary['apiPartnerUpdateVeriCode2'] });
				}
			}catch(err){
				return res.status(500).send({ endpoint: 'reservations', operation: 'availableTerms', success: false, code: 3, error: 'db error', message: err  });
			}
		}
	}


	//////////////////////////////////////   GETONE   ///////////////////////////////////////////////


	if (req.query.operation === 'getOne') {
		if (!req['query']['id'] || !req['query']['language']) {
			return res.status(404).json({ endpoint: 'reservations', operation: 'getOne', success: false, code: 4, error: 'basic validation error' });
		}else{
			const dictionary = getLanguage(`req['query']['language']`);

			try{
				await connectToDb(req.headers.host);
				const one = await Reservation.findOne({"_id": req['query']['id']})
				if (one) {
					return res.status(200).json({ endpoint: 'reservations', operation: 'getOne', success: true, code: 1, reservation: one });
				}else{
					return res.status(404).json({ endpoint: 'reservations', operation: 'getOne', success: false, code: 2, error: 'selection error', message: dictionary['apiPartnerUpdateVeriCode2'] });
				}
			}catch(err){
				return res.status(500).send({ endpoint: 'reservations', operation: 'getOne', success: false, code: 3, error: 'db error', message: err  });
			}
		}
		
	}



	//////////////////////////////////////   GET   ///////////////////////////////////////////////



	if (req.query.operation === 'get') {
		if (!dataHasValidProperty(req.body, ['type', 'language'])) {
			return res.status(404).json({ endpoint: 'reservations', operation: 'get', success: false, code: 10, error: 'basic validation error' });
		}else{
			const { language, type } = req.body;
			const dictionary = getLanguage(language);

			if (type === 'partner') {
				const { partner, room, dates } = req.body;
				try{
					await connectToDb(req.headers.host);
					const query = await Reservation.find({partner, room, active: true, "fromDate": {"$gte": setReservationDateForBase(dates['start']), "$lt":setReservationDateForBase(dates['end'])}}).select('-trilinoCatering -confirmed -payment -transactionId -transactionCard -transactionAuthCode -transactionProcReturnCode -transactionMdStatus -transactionErrMsg -trilino ');
					if (query) {
						return res.status(200).json({ endpoint: 'reservations', operation: 'get', success: true, code: 1, reservations: query });
					}else{
						return res.status(404).json({ endpoint: 'reservations', operation: 'get', success: false, code: 2, error: 'selection error', message: dictionary['apiPartnerUpdateVeriCode2'] });
					}
					
				}catch(err){
					return res.status(500).send({ endpoint: 'reservations', operation: 'get', success: false, code: 3, error: 'db error', message: err  });
				}
			}

			if (type === 'user') {
				const {partner, date} = req.body;
				const dateHandler = new DateHandler(date);
				const queryDate = dateHandler.formatDateString('server');
				
				try{
					await connectToDb(req.headers.host);
					const query = await Reservation.find({partner, date: queryDate}).select('-trilinoCatering -confirmed -payment -transactionId -transactionCard -transactionAuthCode -transactionProcReturnCode -transactionMdStatus -transactionErrMsg -trilino ');
					if (query) {
						return res.status(200).json({ endpoint: 'reservations', operation: 'get', success: true, code: 1, reservations: query });
					}else{
						return res.status(404).json({ endpoint: 'reservations', operation: 'get', success: false, code: 2, error: 'selection error', message: dictionary['apiPartnerUpdateVeriCode2'] });
					}
					
				}catch(err){
					return res.status(500).send({ endpoint: 'reservations', operation: 'get', success: false, code: 3, error: 'db error', message: err  });
				}
			}
		}
	}


//////////////////////////////////////   GETFORUSER   ///////////////////////////////////////////////

	if (req.query.operation === 'getForUser') {
		const token = req.headers.authorization;
		if (!token) {
			return res.status(401).json({ endpoint: 'reservations', operation: 'getForUser', success: false, code: 4, error: 'auth error', message: 'unauthorized user'  });
		}else{
			if (!dataHasValidProperty(req.body, ['type', 'language'])) {
				return res.status(404).json({ endpoint: 'reservations', operation: 'get', success: false, code: 5, error: 'basic validation error' });
			}else{
				const { language, type } = req.body;
				const dictionary = getLanguage(language);

				const decoded = verifyToken(token);
				const userId = encodeId(decoded['sub']);

				try{
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
					await connectToDb(req.headers.host);
					const reservationsDb = await Reservation.aggregate([{ $match: {"user": userId} }, {$lookup: lookup}, {$project: {'transactionCard': 0, 'partnerObj.contactPhone': 0, 'partnerObj.password': 0, 'partnerObj.contactEmail': 0, 'partnerObj.contactPerson': 0, 'partnerObj.taxNum': 0, 'partnerObj.photos': 0, 'partnerObj.passSafetyCode': 0, 'partnerObj.map': 0,}} ]);
					const reservations = prepareReservationsForUserList(reservationsDb);

					if (reservations) {
						return res.status(200).json({ endpoint: 'reservations', operation: 'getForUser', success: true, code: 1, reservations });
					}else{
						return res.status(404).json({ endpoint: 'reservations', operation: 'getForUser', success: false, code: 2, error: 'selection error', message: dictionary['apiPartnerUpdateVeriCode2'] });
					}
				}catch(err){
					return res.status(500).send({ endpoint: 'reservations', operation: 'getForUser', success: false, code: 3, error: 'db error', message: err  });
				}
			}
		}
	}



	//////////////////////////////////////   DELETE   ///////////////////////////////////////////////



	if (req.query.operation === 'delete') {
		if (!dataHasValidProperty(req.body, ['id', 'language', 'partner'])) {
			return res.status(401).json({ endpoint: 'reservations', operation: 'delete', success: false, code: 10, error: 'basic validation error' });
		}else{
			const { id, partner, language } = req.body;
			const dictionary = getLanguage(language);
			const token = req.headers.authorization;

			try{
				await connectToDb(req.headers.host);
				if (!isEmpty(token)) {
					const decoded = verifyToken(token);
					const identifierId = encodeId(decoded['sub']);
					const identifier = await Partner.findById(identifierId, '-password -passSafetyCode -passProvided -verified');

					let identification = false;
					if (identifier['_id'] == partner) {
						identification = true;
					}

					if (identification) {
						const deleteFunc = await Reservation.deleteMany({ partner: identifier['_id'], double: identifier['double']  });
						return res.status(200).json({ endpoint: 'reservations', operation: 'delete', success: true, code: 1, result: deleteFunc });
					}else{
						return res.status(401).json({ endpoint: 'reservations', operation: 'delete', success: false, code: 2, error: 'validation error', message: dictionary['apiPartnerLoginCode4'] });
					}
				}else{
					return res.status(401).json({ endpoint: 'reservations', operation: 'delete', success: false, code: 4, error: 'validation error', message: dictionary['apiPartnerLoginCode4'] });
				}
			}catch(err){
				return res.status(500).send({ endpoint: 'reservations', operation: 'delete', success: false, code: 3, error: 'db error', message: err  });
			}
		}
	}



	//////////////////////////////////////   CANCEL   ///////////////////////////////////////////////



	if (req.query.operation === 'cancel') {
		if (!dataHasValidProperty(req.body, ['id', 'language', 'doubleReference'])) {
			return res.status(401).json({ endpoint: 'reservations', operation: 'cancel', success: false, code: 7, error: 'basic validation error' });
		}else{
			const { id, language, doubleReference } = req.body;
			const dictionary = getLanguage(language);
			const token = req.headers.authorization;

			try{
				await connectToDb(req.headers.host);
				if (!isEmpty(token)) {
					const decoded = verifyToken(token);
					const identifierId = encodeId(decoded['sub']);
					const userObj = await User.findById(identifierId, '-password');
					const today = new Date();

					if (userObj) {
						const resArr = await Reservation.find({'doubleReference': doubleReference, 'type': 'user', 'fromDate':{'$gt': today}});
						const result = packReservationwithDouble(resArr);

						if (result['_id'] == id) {
							const partner = await Partner.findById(result['partner'], '-password -passSafetyCode -passProvided -verified');
							if (partner) {
								const policy = getCancelPolicy(result);
								const cancel = await Reservation.where({ 'user': userObj['_id'], doubleReference: result['doubleReference'] }).updateMany({ $set: { active: false, canceled: true, cancelDate: today, return: policy['free'], returnPrice: policy['free'] ? (result['deposit'] * 0.95) : 0 }});
								
								const myCriptor = new MyCriptor();
								const roomObj = getArrayObjectByFieldValue(partner['general']['rooms'], 'regId', result['room']);
								const dateStr = setReservationTimeString(result);
								const sender = {name:'Trilino', email:'no.reply@trilino.com'};
								const bcc = null;
								const userTemplateId = 8;
								const partnerTemplateId = 9;
								const userTo = [{name: `${myCriptor.decrypt(userObj.firstName, true)} ${myCriptor.decrypt(userObj.lastName, true)}`, email: myCriptor.decrypt(userObj.contactEmail, false) }];
								const partnerTo = [{name: partner['name'], email: partner['contactEmail'] }];

								const userParams = {
									title: 'Otkazivanje rezervacije',
									text: 'Žao nam je što ste morali da otkažete ovu rezervaciju. Sada ovaj termin na datoj lokaciji postaje slobodan i dostupan drugima na potencijalnu rezervaciju. U nastavku možete videti osnovne podatke o otkazivanju a sve dodatno možete pratiti preko vašeg korisničkog profila.',
									orderId: `${dictionary['paymentUserEmailOrderId']} ${result['_id']}`,
									date: `${dictionary['paymentUserEmailDate']} ${dateStr}`,
									partner: `${dictionary['paymentUserEmailPartnerName']} ${partner['name']}`,
									returnPolicy: policy['free'] ? 'Povraćaj depozita: Ispunjeni su uslovi za puni povraćaj depozita. U narednih 7 dana možete očekivati vraćena sredstva uz troškove obrade 2% - 5% od iznosa depozita.' : 'Povraćaj depozita: Na žalost uslovi za povraćaj depozita nisu ispunjeni.',
									returnPrice: `Iznos povraćaja: ${policy['free'] ? (result['deposit'] * 0.95) : 0}`,
									finish: 'Vaš Trilino.'
								};

								const partnerParams = {
									title: 'Korisnik je otkazao rezervaciju',
									text: 'U nastavku možete videti osnovne podatke o rezervaciji koju je korisnik otkazao. Sada ovaj termin postaje slobodan i dostupan za buduću potencijalnu rezervaciju.',
									date: `${dictionary['paymentUserEmailDate']} ${dateStr}`,
									room: `${dictionary['paymentUserEmailRoom']} ${roomObj['name']}`, 
									guest: `${dictionary['paymentPartnerEmailCelebrant']} ${result['guest']}`,
									returnPolicy: policy['free'] ? 'Povraćaj depozita: Ispunjeni su uslovi za puni povraćaj depozita. Korisniku će biti vraćen depozit u roku od 7 dana.' : 'Povraćaj depozita: Uslovi za povraćaj depozita nisu ispunjeni.',
									finish: 'Vaš Trilino.'
								}

								const userEmail = { sender, to: userTo, bcc, templateId: userTemplateId, params: userParams };
								const partnerEmail = { sender, to: partnerTo, bcc, templateId: partnerTemplateId, params: partnerParams };
								await sendEmail(userEmail);
								await sendEmail(partnerEmail);

								return res.status(200).json({ endpoint: 'reservations', operation: 'cancel', success: true, code: 1, result: cancel });
							}else{
								return res.status(401).json({ endpoint: 'reservations', operation: 'cancel', success: false, code: 2, error: 'sent data error', message: dictionary['apiPartnerLoginCode4'] });
							}
						}else{
							return res.status(401).json({ endpoint: 'reservations', operation: 'cancel', success: false, code: 3, error: 'sent data error', message: dictionary['apiPartnerLoginCode4'] });
						}
					}else{
						return res.status(401).json({ endpoint: 'reservations', operation: 'cancel', success: false, code: 4, error: 'sent data error', message: dictionary['apiPartnerLoginCode4'] });
					}
				}else{
					return res.status(401).json({ endpoint: 'reservations', operation: 'cancel', success: false, code: 5, error: 'auth error', message: dictionary['apiPartnerLoginCode4'] });
				}
			}catch(err){
				return res.status(500).send({ endpoint: 'reservations', operation: 'cancel', success: false, code: 6, error: 'db error', message: err  });
			}
		}
	}



	//////////////////////////////////////   CONFIRM   ///////////////////////////////////////////////


	if (req.query.operation === 'confirm') {
		if (!isReservationConfirmDataValid(req.body)) {
			return res.status(404).json({ endpoint: 'reservations', operation: 'confirm', success: false, code: 4, error: 'basic validation error' });
		}else{
			const { id, transId, card, transDate, transAuth, transProc, transMd, error, confirm, payment, language } = req.body;
			const dictionary = getLanguage(language);
			let trilinoCat = false;
			let double = false;

			try{
				await connectToDb(req.headers.host);
				const one = await Reservation.findOneAndUpdate({"_id": id}, {"$set" : {transactionId: transId, transactionCard: card, transactionAuthCode: transAuth, transactionProcReturnCode: transProc, transactionMdStatus: transMd, transactionDate: transDate, confirmed: confirm, active: confirm, transactionErrMsg: error } }, { new: true });
				const partner = await Partner.findById(one['partner'], '-password -passSafetyCode -passProvided -verified');
				const user = await User.findById(one['user'], '-password -passSafetyCode -passProvided');
				if (one['double']) {
					double = await Reservation.findOneAndUpdate({"doubleReference": one['doubleReference'], "deposit": {"$exists": false}}, {"$set" : {transactionId: transId, transactionCard: card, transactionAuthCode: transAuth, transactionProcReturnCode: transProc, transactionMdStatus: transMd, transactionDate: transDate, confirmed: confirm, active: confirm, transactionErrMsg: error } }, { new: true });
				}
				if (one['trilino']) {
					trilinoCat = await Catering.findOneAndUpdate({"reservation": one['_id']}, {"$set" : {active: confirm, status: confirm ? 'confirmed' : 'declined'} }, { new: true });
				}

				let flag = false;

				if (one) {
					if (one['trilino']) {
						if (trilinoCat) {
							if (one['double']) {
								if (double) {
									flag = true;
								}
							}else{
								flag = true;
							}
						}
					}else{
						if (one['double']) {
							if (double) {
								flag = true;
							}
						}else{
							flag = true;
						}
					}
				}
				
				
				if (flag) {
					const allDate = `${one['date'].substring(0, 10).split('-')[2]}.${one['date'].substring(0, 10).split('-')[1]}.${one['date'].substring(0, 10).split('-')[0]}`;
					const myCriptor = new MyCriptor();
					const roomObj = getArrayObjectByFieldValue(partner['general']['rooms'], 'regId', one['room']);
					const sender = {name:'Trilino', email:'no.reply@trilino.com'};

					const userTo = [{name: `${myCriptor.decrypt(user.firstName, true)} ${myCriptor.decrypt(user.lastName, true)}`, email: myCriptor.decrypt(user.contactEmail, false) }];

					const bcc = null;
					const userTemplateId = 6;
					const userParams = { 
						title: confirm ? dictionary['paymentUserEmailTitleTrue'] : dictionary['paymentUserEmailTitleFalse'], 
						reservationTitle: dictionary['paymentUserEmailResSub'], 
						partnerName: `${dictionary['paymentUserEmailPartnerName']} ${partner['name']}`, 
						address: `${dictionary['paymentUserEmailAddress']} ${partner['general']['address']}, ${getGeneralOptionLabelByValue(generalOptions['cities'], partner['city'])}`, 
						date: `${dictionary['paymentUserEmailDate']} ${allDate}, ${one['from']} - ${one['double'] ? double['to'] : one['to']}`, 
						room: `${dictionary['paymentUserEmailRoom']} ${roomObj['name']}`, 
						fullPrice: confirm ? `${dictionary['paymentUserEmailFullPriceTrue']} ${(one['price'] - one['deposit'] - one['trilinoPrice']).toFixed(2)}` : `${dictionary['paymentUserEmailFullPriceFalse']} ${one['price'].toFixed(2)}`, 
						deposit: confirm ? `${dictionary['paymentUserEmailDepositTrue']} ${one['deposit'].toFixed(2)}` : `${dictionary['paymentUserEmailDepositFalse']}`, 
						transactionTitle: dictionary['paymentUserEmailTransSub'], 
						orderId: `${dictionary['paymentUserEmailOrderId']} ${one['_id']}`, 
						authCode: `${dictionary['paymentUserEmailAuthCode']} ${one['transactionAuthCode']}`, 
						paymentStatus: `${dictionary['paymentUserEmailPaymentStatus']} ${confirm ? dictionary['paymentUserEmailPaymentStatusTrue'] : dictionary['paymentUserEmailPaymentStatusFalse']}`, 
						transactionId: `${dictionary['paymentUserEmailTransactionId']} ${one['transactionId']}`, 
						transactionDate: `${dictionary['paymentUserEmailTransactionDate']} ${one['transactionDate']}`, 
						mdStatus: `${dictionary['paymentUserEmailMdStatus']} ${one['transactionMdStatus']}`, 
						finish: confirm ? dictionary['paymentUserEmailFinishTrue'] : dictionary['paymentUserEmailFinishFalse']
					};
	  			const userEmail = { sender, to: userTo, bcc, templateId: userTemplateId, params: userParams };
					const emailSeUser =	await sendEmail(userEmail);
					if (confirm) {
						const partnerTo = [{name: partner['name'], email: partner['contactEmail'] }];
						const partnerTemplateId = 7;

						let cateringMsg = setCateringString(one, partner);

						let decorationMsg = setDecorationString(one, partner);

						let addonMsg = setAddonString(one, partner);

						const partnerParams = { 
							title: dictionary['paymentPartnerEmailTitle'], 
							sub: dictionary['paymentPartnerEmailSub'], 
							date: `${dictionary['paymentUserEmailDate']} ${allDate}, ${one['from']} - ${one['double'] ? double['to'] : one['to']}`, 
							room: `${dictionary['paymentUserEmailRoom']} ${roomObj['name']}`, 
							guest: `${dictionary['paymentPartnerEmailCelebrant']} ${one['guest']}`, 
							catering: `${dictionary['paymentPartnerEmailCatering']} ${cateringMsg}`, 
							decoration: `${dictionary['paymentPartnerEmailDecoration']} ${decorationMsg}`, 
							addons: `${dictionary['paymentPartnerEmailAddon']} ${addonMsg}`, 
							onsitePrice: `${dictionary['paymentPartnerEmailPrice']} ${(one['price'] - one['deposit']).toFixed(2)}`,
							finish: dictionary['paymentPartnerEmailFinish']
						};
		  			const partnerEmail = { sender, to: partnerTo, bcc, templateId: partnerTemplateId, params: partnerParams };
						const emailSePartner = await sendEmail(partnerEmail);
					}

					return res.status(200).json({ endpoint: 'reservations', operation: 'confirm', success: true, code: 1, reservation: userParams });
				}else{
					return res.status(404).json({ endpoint: 'reservations', operation: 'confirm', success: false, code: 2, error: 'selection error', message: dictionary['apiPartnerUpdateVeriCode2'] });
				}
			}catch(err){
				return res.status(500).send({ endpoint: 'reservations', operation: 'confirm', success: false, code: 3, error: 'db error', message: err  });
			}
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