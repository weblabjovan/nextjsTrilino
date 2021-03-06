import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt'; 
import Reservation from '../../../server/models/reservation';
import User from '../../../server/models/users';
import Conversation from '../../../server/models/conversation';
import connectToDb  from '../../../server/helpers/db';
import MyCriptor from '../../../server/helpers/MyCriptor';
import { generateString, encodeId, decodeId, setToken, verifyToken, defineUserLanguage }  from '../../../server/helpers/general';
import { sendEmail, sendMessageNotification }  from '../../../server/helpers/email';
import { isUserRegDataValid, dataHasValidProperty, isConversationMessageLimited } from '../../../server/helpers/validations';
import { isEmpty, isMoreThan, isLessThan, isOfRightCharacter, isMatch, isPib, isEmail } from '../../../lib/helpers/validations';
import { setUpLinkBasic } from '../../../lib/helpers/generalFunctions';
import { getLanguage } from '../../../lib/language';
import Keys from '../../../server/keys';

export default async (req: NextApiRequest, res: NextApiResponse ) => {



	//////////////////////////////////////   SAVE   ///////////////////////////////////////////////



	if (req.query.operation === 'save') {
		const { firstName, lastName, phoneCode, terms, language, origin } = req.body;
		const contactEmail = req.body['email'];
		const contactPhone = req.body['phone'];
		const userlanguage = defineUserLanguage(language);
		const dictionary = getLanguage(userlanguage);

		if (isUserRegDataValid(req.body)) {
  		try{
  			await connectToDb(req.headers.host);
  			const myCriptor = new MyCriptor();

  			const replica = await User.findOne({ contactEmail: myCriptor.encrypt(contactEmail, false) });
  			if (replica) {
		    	return res.status(401).send({ endpoint: 'users', operation: 'save', success: false, code: 2, error: 'validation error', message: dictionary['apiUserSaveCode2'] });
				}else{
					
	    		const country = 'Serbia';
	    		const passProvided = false;
	    		const verified = true;
	    		const passSafetyCode = generateString(7);

	    		const newUser = new User({ firstName: myCriptor.encrypt(firstName, true), lastName: myCriptor.encrypt(lastName, true), contactEmail: myCriptor.encrypt(contactEmail, false), contactPhone: myCriptor.encrypt(contactPhone, true), phoneCode, verified, passProvided, userlanguage, passSafetyCode, origin });
	    		
	    		const userBack = await newUser.save();
	    		const sender = {name:'Trilino', email:'no.reply@trilino.com'};
  				const to = [{name:firstName, email: contactEmail }];
  				const bcc = null;
  				const templateId = origin === 'regpage' ? 4 : 5;

  				const page = decodeId(generateString, userBack._id);
  				const link = `${req.headers.origin}/password?language=${language}&page=${page}&type=user`;

  				const params = { title: `${firstName} ${dictionary['emailUserRegisterTitle']}`, text: `${dictionary['emailUserRegisterText']}`, code: `${dictionary['emailPartnerRegisterCode']} ${passSafetyCode}`, link: link, button: `${dictionary['emailPartnerRegisterButton']}`};
  				const email = { sender, to, bcc, templateId, params };

					const emailSe =	await sendEmail(email);

		    	return res.status(200).json({ endpoint: 'users', operation: 'save', success: true, code: 1, page });
				}
  		}catch(err){
  			return res.status(500).send({ endpoint: 'users', operation: 'save', success: false, code: 4, error: 'db error', message: err  });
  		}
		}else{
	    return res.status(401).send({ endpoint: 'users', operation: 'save', success: false, code: 3, error: 'validation error', message: dictionary['apiUserSaveCode5']  });
		}
	  	
	}




	//////////////////////////////////////   GET   ///////////////////////////////////////////////




	if (req.query.operation === 'get') {
		const userlanguage = defineUserLanguage(req['query']['language']);
		const dictionary = getLanguage(userlanguage);

		if (req['query']['type'] === 'verification') {
			let userId = req['query']['user'].toString();

			if (req['query']['encoded']) {
				userId = encodeId(userId);
			}

			try{
				await connectToDb(req.headers.host);
				const user = await User.findById(userId, '-password');

				if (user) {
					return res.status(200).json({ endpoint: 'users', operation: 'get', success: true, code: 1, user: user });
				}else{
					return res.status(404).json({ endpoint: 'users', operation: 'get', success: false, code: 2, error: 'selection error', message: dictionary['apiPartnerGetCode2'] });
				}
			}catch(err){
				return res.status(500).send({ endpoint: 'users', operation: 'get', success: false, code: 3, error: 'db error', message: err  });
			}
		}
		
	}



	//////////////////////////////////////   UPDATE   ///////////////////////////////////////////////




	if (req.query.operation === 'update') {
		if (!dataHasValidProperty(req.body, ['param', 'data', 'type'])) {
			return res.status(500).send({ endpoint: 'users', operation: 'update', success: false, code: 10, error: 'basic validation error'  });
		}else{
			const { param, data, type } = req.body;
			const userlanguage = defineUserLanguage(data.language);
			const dictionary = getLanguage(userlanguage);

			if (type === 'password') {
				if (isEmpty(data.password) || !isMoreThan(data.password, 7) || !isLessThan(data.password, 17) || !isOfRightCharacter(data.password) || isEmpty(data.confirmation) || !isMatch(data.password, data.confirmation) || isEmpty(data.code)) {
					return res.status(500).json({ endpoint: 'users', operation: 'update', success: false, code: 2, error: 'password data validation error', message: dictionary['apiPartnerUpdatePassCode2'] });
				}else{
					try{
						await connectToDb(req.headers.host);
						const salt = await bcrypt.genSalt(10);
						const passHash = await bcrypt.hash(data.password, salt);
						const id = encodeId(data.id);
						const user = await User.findOneAndUpdate({ '_id': id, 'passSafetyCode': data.code }, {"$set" : { passSafetyCode : '', password: passHash, passProvided: true } }, { new: true }).select('-password');
						if (user) {
							const token = data.token ? setToken('user', decodeId(generateString, user._id)) : null;
							return res.status(200).json({ endpoint: 'users', operation: 'update', success: true, code: 1, token });
						}else{
							return res.status(404).json({ endpoint: 'users', operation: 'update', success: false, code: 3, error: 'selection error', message: dictionary['apiUserUpdatePassCode3'] });
						}
					}catch(err){
						return res.status(500).send({ endpoint: 'users', operation: 'update', success: false, code: 4, error: 'db error', message: err  });
					}
				}
			}

			if (type === 'passwordChange') {
				if (!isEmail(data['email']) || !data['language']) {
					return res.status(400).json({ endpoint: 'users', operation: 'update', success: false, code: 2, error: 'validation error', message: dictionary['apiPartnerUpdatePassCode2'] });
				}else{
					try{
						await connectToDb(req.headers.host);
						const myCriptor = new MyCriptor();
						const user = await User.findOne({ contactEmail: myCriptor.encrypt(data['email'], false) });

						if (user) {
							const passSafetyCode = generateString(8);
							const update = await User.findOneAndUpdate({ '_id': user._id }, {"$set" : { passSafetyCode } }, { new: true }).select('-password');
							const sender = {name:'Trilino', email:'no.reply@trilino.com'};
		  				const to = [{name: `${myCriptor.decrypt(user.firstName, true)} ${myCriptor.decrypt(user.lastName, true)}`, email: myCriptor.decrypt(user.contactEmail, false) }];
		  				const bcc = null;
		  				const templateId = 4;
		  				const page = decodeId(generateString, user._id);
		  				const link = `${req.headers.origin}/password?language=${data['language']}&page=${page}&type=user&change=true`;

		  				const params = { title: `${myCriptor.decrypt(user.firstName, true)} ${dictionary['emailPartnerForgotPassTitle']}`, text: `${dictionary['emailPartnerForgotPassText']}`, code: `${dictionary['emailPartnerForgotPassCode']} ${passSafetyCode}`, link: link, button: `${dictionary['emailPartnerForgotPassButton']}`};
		  				const emailObj = { sender, to, bcc, templateId, params };
		  				const emailSe =	await sendEmail(emailObj);
	  					return res.status(200).json({ endpoint: 'users', operation: 'update', success: true, code: 1 });
						}else{
							return res.status(404).json({ endpoint: 'users', operation: 'update', success: false, code: 3, error: 'selection error', message: dictionary['apiUserUpdateReqPassCode3'] });
						}
					}catch(err){
						return res.status(500).json({ endpoint: 'users', operation: 'update', success: false, code: 4, error: 'server error', message: err });
					}
				}
			}
		}
	}




	//////////////////////////////////////   GET MY CONVERSATIONS   ///////////////////////////////////////////////


	if (req.query.operation === 'getMyConversations') {
		if (!dataHasValidProperty(req.body, ['language'])) {
			return res.status(500).send({ endpoint: 'users', operation: 'getMyConversations', success: false, code: 10, error: 'basic validation error'  });
		}else{
			const token = req.headers.authorization;
			const userlanguage = defineUserLanguage(req.body['language']);
			const dictionary = getLanguage(userlanguage);

			if (!isEmpty(token)) {
				
				try{
					await connectToDb(req.headers.host);
					const decoded = verifyToken(token);
					const userId = encodeId(decoded['sub']); 
					const user = await User.findById(userId, '-password');
					const today = new Date();

					if (user) {
						const conversations = await Conversation.find({ user: userId, status: 'active', validUntil: { "$gt": today }});
						return res.status(200).json({ endpoint: 'users', operation: 'getMyConversations', success: true, code: 1, conversations });
					}else{
						return res.status(404).json({ endpoint: 'users', operation: 'getMyConversations', success: false, code: 2, error: 'selection error', message: dictionary['apiPartnerAuthCode2'] });
					}
				}catch(err){
					return res.status(500).json({ endpoint: 'users', operation: 'getMyConversations', success: false, code: 3, error: 'selection error', message: dictionary['apiPartnerAuthCode2'] });
				}
			
			}else{
				return res.status(404).json({ endpoint: 'users', operation: 'getMyConversations', success: false, code: 4, error: 'selection error', message: dictionary['apiPartnerAuthCode2'] });
			}
		}
	}



	//////////////////////////////////////   USER SEND MESSAGE   ///////////////////////////////////////////////


	if (req.query.operation === 'sendMessage') {
		if (!dataHasValidProperty(req.body, ['language', 'time', 'message', 'id'])) {
			return res.status(500).send({ endpoint: 'users', operation: 'sendMessage', success: false, code: 10, error: 'basic validation error'  });
		}else{
			const  {language, time, message, id} = req.body;
			const token = req.headers.authorization;
			const userlanguage = defineUserLanguage(language);
			const dictionary = getLanguage(userlanguage);
			const today = new Date();

			if (!isEmpty(token)) {
				try{
					await connectToDb(req.headers.host);
					const decoded = verifyToken(token);
					const userId = encodeId(decoded['sub']); 
					const user = await User.findById(userId, '-password');

					if (user) {
						const lookupPar = { 
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

						const lookupRes = { 
							from: 'reservations', 
							let: { reservation: '$reservation'}, //
							pipeline: [
								{ $addFields: { "reservation": { "$toString": "$_id" }}},
			          { $match:
			             { 
			             		$expr: { $eq: [ "$$reservation", "$reservation" ] }
			             }
			          }
			        ],
			        as: "reservationObj"
						};

						const ObjectId = mongoose.Types.ObjectId;
						const converItem = await Conversation.aggregate([{ $match: {"_id": ObjectId(id) }}, {$lookup: lookupPar}, {$project: {'password': 0}}, {$lookup: lookupRes}]);
						if (!isConversationMessageLimited(converItem[0], 'user')) {
							await Conversation.findOneAndUpdate({"_id": id}, { "$push": {"messages": {"sender": 'user', "time": time, "message": message}}});
							await sendMessageNotification('partner', converItem[0], message, req.headers.host);
						}
						const conversations = await Conversation.find({ user: userId, status: 'active', validUntil: { "$gt": today }});
						return res.status(200).json({ endpoint: 'users', operation: 'sendMessage', success: true, code: 1, conversations });
					}else{
						return res.status(404).json({ endpoint: 'users', operation: 'sendMessage', success: false, code: 2, error: 'selection error', message: dictionary['apiPartnerAuthCode2'] });
					}
				}catch(err){
					return res.status(500).json({ endpoint: 'users', operation: 'sendMessage', success: false, code: 3, error: 'selection error', message: dictionary['apiPartnerAuthCode2'] });
				}
			
			}else{
				return res.status(404).json({ endpoint: 'users', operation: 'sendMessage', success: false, code: 4, error: 'selection error', message: dictionary['apiPartnerAuthCode2'] });
			}
		}
	}




	//////////////////////////////////////   LOGIN   ///////////////////////////////////////////////



	if (req.query.operation === 'login') {

		if (!dataHasValidProperty(req.body, ['email', 'password', 'language'])) {
			return res.status(404).json({ endpoint: 'users', operation: 'login', success: false, code: 10, error: 'basic validation error' });
		}else{
			const { email, password, language } = req.body;
			const dictionary = getLanguage(language);

			if (isEmpty(password)) {
				res.status(400).send({ endpoint: 'users', operation: 'login', success: false, code: 4, error: 'validation error', message: dictionary['apiPartnerLoginCode4']  });
			}else{
				try{
					await connectToDb(req.headers.host);
					const myCriptor = new MyCriptor();
					const user = await User.findOne({contactEmail: myCriptor.encrypt(email, false)});
					if (user) {
						if (user.passProvided) {
							const match = await bcrypt.compare(password, user.password);
							
							if (match) {
								const token = setToken('user', decodeId(generateString, user._id));
								return res.status(200).json({ endpoint: 'users', operation: 'update', success: true, code: 1, token });
							}else{
								return res.status(404).json({ endpoint: 'users', operation: 'login', success: false, code: 2, error: 'selection error', message: dictionary['apiUserLoginCode2'] });
							}
						}else{
							return res.status(404).json({ endpoint: 'users', operation: 'login', success: false, code: 5, error: 'selection error', message: dictionary['apiUserLoginCode5'] });
						}
					}else{
						return res.status(404).json({ endpoint: 'users', operation: 'login', success: false, code: 3, error: 'selection error', message: dictionary['apiUserLoginCode3'] });
					}
				}catch(err){
					return res.status(500).send({ endpoint: 'users', operation: 'login', success: false, code: 6, error: 'db error', message: err  });
				}
			}
		}
	}




	//////////////////////////////////////   AUTH   ///////////////////////////////////////////////




	if (req.query.operation === 'auth') {
		const userlanguage = defineUserLanguage(req['query']['language']);
		const dictionary = getLanguage(userlanguage);

		let token = null;

		if (req['query']['userAuth']) {
			token = req['query']['userAuth'];
		}else{
			token = req.headers.authorization;
		}

		if (!isEmpty(token)) {
				
			try{
				await connectToDb(req.headers.host);
				const decoded = verifyToken(token);
				const userId = encodeId(decoded['sub']); 
				const user = await User.findById(userId, '-password');
				if (user) {
					return res.status(200).json({ endpoint: 'users', operation: 'auth', success: true, code: 1, message: dictionary['apiPartnerAuthCode1'] });
				}else{
					return res.status(500).json({ endpoint: 'users', operation: 'auth', success: false, code: 2, error: 'selection error', message: dictionary['apiPartnerAuthCode2'] });
				}
			}catch(err){
				return res.status(500).json({ endpoint: 'users', operation: 'auth', success: false, code: 3, error: 'selection error', message: dictionary['apiPartnerAuthCode2'] });
			}
			
		}else{
			return res.status(500).json({ endpoint: 'users', operation: 'auth', success: false, code: 4, error: 'selection error', message: dictionary['apiPartnerAuthCode2'] });
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