import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt'; 
import Reservation from '../../../server/models/reservation';
import Partner from '../../../server/models/partner';
import connectToDb  from '../../../server/helpers/db';
import { generateString, encodeId, decodeId, setToken, verifyToken, extractRoomTerms, getFreeTerms, setDateTime, setReservationDateForBase, setDateForServer }  from '../../../server/helpers/general';
import { sendEmail }  from '../../../server/helpers/email';
import { isReservationSaveDataValid,  isReservationStillAvailable, dataHasValidProperty } from '../../../server/helpers/validations';
import { isEmpty, isMoreThan, isLessThan, isOfRightCharacter, isMatch, isPib, isEmail } from '../../../lib/helpers/validations';
import { setUpLinkBasic } from '../../../lib/helpers/generalFunctions';
import { getLanguage } from '../../../lib/language';

export default async (req: NextApiRequest, res: NextApiResponse ) => {

	if (req.query.operation === 'save') {
		if (!dataHasValidProperty(req.body, ['reservation', 'language', 'type'])) {
			return res.status(401).json({ endpoint: 'reservations', operation: 'save', success: false, code: 10, error: 'basic validation error' });
		}else{
			const { reservation, language, type } = req.body;
			const dictionary = getLanguage(language);
			const token = req.headers.authorization;

			try{
				await connectToDb(req.headers.host);
				if (type === 'partner' || type === 'user') {
					if (!isEmpty(token)) {
						const decoded = verifyToken(token);
						const identifierId = encodeId(decoded['sub']);
						const identifier = await Partner.findById(identifierId, '-password -passSafetyCode -passProvided -verified');

						let identification = false;
						if (type === 'partner') {
							if (identifier['_id'] == reservation['partner']) {
								identification = true;
							}
						}

						if (identification) {
							if (isReservationSaveDataValid(reservation)) {
								const reservations = await Reservation.find({ 'date': reservation['date'], 'partner': reservation['partner'], 'room': reservation['room']['value'], active: true }, { new: true }).select('from to _id');
								if (isReservationStillAvailable(reservation, reservations)) {
									let arr = [];
									const main = {
										partner: reservation['partner'],
										type: reservation['type'],
										room: reservation['room']['value'],
										date: reservation['date'].substring(0,19),
										from: reservation['from'],
										fromDate: setDateTime(reservation['date'], reservation['from']),
										to: reservation['to'],
										toDate: setDateTime(reservation['date'], reservation['to']),
										double: reservation['double'],
										user: reservation['user'],
										userName: reservation['userName'],
										guest: reservation['guest'],
										food: reservation['food'],
										animation: reservation['animation'],
										decoration: reservation['decoration'],
										comment: reservation['comment'],
										termPrice: reservation['termPrice'],
								    animationPrice: reservation['animationPrice'],
								    decorationPrice: reservation['decorationPrice'],
								    foodPrice: reservation['foodPrice'],
								    price: reservation['price'],
								    deposit: reservation['deposit'],
										active: true,
									}
									arr.push(main);
									if (reservation['double']) {
										const double = {
											partner: reservation['partner'],
											type: reservation['type'],
											room: reservation['room']['value'],
											date: reservation['date'].substring(0,19),
											from: reservation['terms'][reservation['term']['value'] + 1]['from'],
											fromDate: setDateTime(reservation['date'], reservation['terms'][reservation['term']['value'] + 1]['from']),
											to: reservation['terms'][reservation['term']['value'] + 1]['to'],
											toDate: setDateTime(reservation['date'], reservation['terms'][reservation['term']['value'] + 1]['to']),
											double: reservation['double'],
											user: reservation['user'],
											userName: reservation['userName'],
											guest: reservation['guest'],
											food: reservation['food'],
											animation: reservation['animation'],
											decoration: reservation['decoration'],
											comment: reservation['comment'],
											active: true,
										}
										arr.push(double);
									}

									const reserve = await Reservation.create(arr);
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
					const query = await Reservation.find({partner, room, "fromDate": {"$gte": setReservationDateForBase(dates['start']), "$lt":setReservationDateForBase(dates['end'])}});
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
						const deleteFunc = await Reservation.deleteOne({ _id: id });
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