import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt'; 
import Reservation from '../../../server/models/reservation';
import Partner from '../../../server/models/partner';
import User from '../../../server/models/users';
import Catering from '../../../server/models/trilinoCatering';
import connectToDb  from '../../../server/helpers/db';
import generalOptions from '../../../lib/constants/generalOptions';
import { generateString, encodeId, decodeId, setToken, verifyToken, extractRoomTerms, getFreeTerms, setDateTime, setReservationDateForBase, setDateForServer, sortCateringTypes, unCoverMyEmail, myDecrypt }  from '../../../server/helpers/general';
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
											user: reservation['user'],
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
				const queryDate = setDateForServer(date).toISOString().substring(0,19);
				try{
					await connectToDb(req.headers.host);
					const query = await Reservation.find({partner, date: queryDate});
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
					const roomObj = getArrayObjectByFieldValue(partner['general']['rooms'], 'regId', one['room']);
					console.log('1')
					const sender = {name:'Trilino', email:'no.reply@trilino.com'};
					console.log(myDecrypt(user['firstName']));
					console.log(unCoverMyEmail(user['contactEmail']));
					const userTo = [{name: myDecrypt(user['firstName']), email: unCoverMyEmail(user['contactEmail']) }];
					console.log('2')
					const bcc = null;
					const userTemplateId = 6;
					const userParams = { 
						title: confirm ? dictionary['paymentUserEmailTitleTrue'] : dictionary['paymentUserEmailTitleFalse'], 
						reservationTitle: dictionary['paymentUserEmailResSub'], 
						partnerName: `${dictionary['paymentUserEmailPartnerName']} ${partner['name']}`, 
						address: `${dictionary['paymentUserEmailAddress']} ${partner['general']['address']}, ${getGeneralOptionLabelByValue(generalOptions['cities'], partner['city'])}`, 
						date: `${dictionary['paymentUserEmailDate']} ${allDate}, ${one['from']} - ${one['double'] ? double['to'] : one['to']}`, 
						room: `${dictionary['paymentUserEmailRoom']} ${roomObj['name']}`, 
						fullPrice: confirm ? `${dictionary['paymentUserEmailFullPriceTrue']} ${(one['price'] - one['deposit']).toFixed(2)}` : `${dictionary['paymentUserEmailFullPriceFalse']} ${one['price'].toFixed(2)}`, 
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
					console.log('3')
	  			const userEmail = { sender, to: userTo, bcc, templateId: userTemplateId, params: userParams };
	  			console.log('4')
					const emailSeUser =	await sendEmail(userEmail);
					console.log('5')
					if (confirm) {
						const partnerSender = {name:'Trilino', email:'no.reply@trilino.com'};
						const partnerTo = [{name: partner['name'], email: partner['contactEmail'] }];
						const partnerTemplateId = 7;

						let cateringMsg = '';
						Object.keys(one['food']).map( key => {
							let i = getArrayIndexByFieldValue(partner['catering']['deals'], 'regId', key);
							if (i !== -1) {
								cateringMsg = `${cateringMsg}${cateringMsg ? ',' : ''} ${dictionary['paymentPartnerEmailCateringDeal'] + (i+1) + ' x ' + one['food'][key] + dictionary['paymentPartnerEmailCateringPerson'] }`;
							}
						});

						let decorationMsg = '';
						Object.keys(one['decoration']).map( key => {
							const find = getObjectFieldByFieldValue(partner['decoration'], 'regId', key);
							if (find) {
								decorationMsg = `${decorationMsg}${decorationMsg ? ',' : ''} ${generalOptions['decorType'][find['value']]['name_'+language]}`;
							}
						});

						let addonMsg = '';
						Object.keys(one['animation']).map( key => {
							const find = getObjectFieldByFieldValue(partner['contentAddon'], 'regId', key);
							if (find) {
								addonMsg = `${addonMsg}${addonMsg ? ',' : ''} ${find['name']}`;
							}
						});

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