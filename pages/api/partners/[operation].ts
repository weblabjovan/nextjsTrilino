import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt'; 
import Partner from '../../../server/models/partner';
import connectToDb  from '../../../server/helpers/db';
import { generateString, encodeId, decodeId, setToken, verifyToken }  from '../../../server/helpers/general';
import { sendEmail }  from '../../../server/helpers/email';
import { isPartnerRegDataValid } from '../../../server/helpers/validations';
import { isEmpty, isMoreThan, isLessThan, isOfRightCharacter, isMatch, isPib } from '../../../lib/helpers/validations';
import { setUpLinkBasic } from '../../../lib/helpers/generalFunctions';
import { getLanguage } from '../../../lib/language';

export default async (req: NextApiRequest, res: NextApiResponse ) => {

	if (req.query.operation === 'save') {
		const { name, taxNum, city, contactPerson, contactEmail, contactPhone, language } = req.body;
		const userlanguage = language;
		const dictionary = getLanguage(language);

		await connectToDb();

		if (isPartnerRegDataValid(req.body)) {
  		try{
  			const replica = await Partner.findOne({ taxNum });
  			if (replica) {
		    	return res.status(401).send({ endpoint: 'partners', operation: 'save', success: false, code: 2, error: 'validation error', message: dictionary['apiPartnerSaveCode2'] });
				}else{
		    	try{
		    		const country = 'Serbia';
		    		const created = new Date();
		    		const passProvided = false;
		    		const verified = false;
		    		const passSafetyCode = generateString(8);

		    		const newPartner = new Partner({ name, taxNum, city, contactPerson, contactEmail, contactPhone, verified, country, created, passProvided, userlanguage, passSafetyCode });
		    		
		    		const par = await newPartner.save();

		    		const sender = {name:'Trilino', email:'no.reply@trilino.com'};
	  				const to = [{name:contactPerson, email:contactEmail }];
	  				const bcc = null;
	  				const templateId = 2;

	  				const page = decodeId(generateString, par._id);
	  				const link = `${req.headers.origin}/emailVerification?language=${language}&page=${page}&type=partner`;

	  				const params = { title: "Registracija partnera", text: `Testni tekst za slanje emaila, jednokratni sigurnosni kod:  ${passSafetyCode}`, link: link};
	  				const email = { sender, to, bcc, templateId, params };
  				await sendEmail(email);
			    	return res.status(200).json({ endpoint: 'partners', operation: 'save', success: true, code: 1 });

		    	}catch(err){
		    		return res.status(500).send({ endpoint: 'partners', operation: 'save', success: false, code: 5, error: 'db error', message: err  });
		    	}
			}
  		}catch(err){
  			return res.status(500).send({ endpoint: 'partners', operation: 'save', success: false, code: 4, error: 'db error', message: err  });
  		}
		}else{
	    return res.status(401).send({ endpoint: 'partners', operation: 'save', success: false, code: 3, error: 'validation error', message: dictionary['apiPartnerSaveCode5']  });
		}
	  	
	}

	if (req.query.operation === 'get'){
		await connectToDb();

		const userlanguage = req['query']['language'] ? req['query']['language'].toString() : 'sr';
		const dictionary = getLanguage(userlanguage);
		let partnerId = req['query']['partner'].toString();

		if (req['query']['encoded']) {
			partnerId = encodeId(partnerId);
		}

		try{
			const partner = await Partner.findById(partnerId, '-password');
			if (partner) {
				return res.status(404).json({ endpoint: 'partners', operation: 'get', success: true, code: 1, partner: partner });
			}else{
				return res.status(404).json({ endpoint: 'partners', operation: 'get', success: false, code: 2, error: 'selection error', message: dictionary['apiPartnerGetCode2'] });
			}
		}catch(err){
			return res.status(500).send({ endpoint: 'partners', operation: 'get', success: false, code: 3, error: 'db error', message: err  });
		}
	}

	if (req.query.operation === 'update'){
		await connectToDb();
		const { param, data, type } = req.body;
		const dictionary = getLanguage(data.language);

		if (type === 'verification') {
			try{
				const id = encodeId(data.id);
				const partner = await Partner.findOneAndUpdate({ '_id': id }, {"$set" : data.options }, { new: true }).select('-password -_id');
				
				if (partner) {
					return res.status(200).json({ endpoint: 'partners', operation: 'update', success: true, code: 1, partner: partner });
				}else{
					return res.status(404).json({ endpoint: 'partners', operation: 'update', success: false, code: 2, error: 'selection error', message: dictionary['apiPartnerUpdateVeriCode2'] });
				}
			}catch(err){
				return res.status(500).send({ endpoint: 'partners', operation: 'update', success: false, code: 3, error: 'db error', message: err  });
			}
		}

		if (type === 'password') {
			if (isEmpty(data.password) || !isMoreThan(data.password, 7) || !isLessThan(data.password, 17) || !isOfRightCharacter(data.password) || isEmpty(data.confirmation) || !isMatch(data.password, data.confirmation) || isEmpty(data.code)) {
				return res.status(500).json({ endpoint: 'partners', operation: 'update', success: false, code: 2, error: 'password data validation error', message: dictionary['apiPartnerUpdatePassCode2'] });
			}else{
				try{
					const salt = await bcrypt.genSalt(10);
					const passHash = await bcrypt.hash(data.password, salt);
					const id = encodeId(data.id);
					const partner = await Partner.findOneAndUpdate({ '_id': id, 'passSafetyCode': data.code }, {"$set" : { passSafetyCode : '', password: passHash, passProvided: true } }, { new: true }).select('-password -_id');
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
	}

	if (req.query.operation === 'login') {
		await connectToDb();
		const { taxNum, password, language } = req.body;

		const dictionary = getLanguage(language);

		if (!isPib(taxNum, 'sr') || isEmpty(password)) {
			res.status(400).send({ endpoint: 'partners', operation: 'login', success: false, code: 4, error: 'validation error', message: dictionary['apiPartnerLoginCode4']  });
		}else{
			try{
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

	if (req.query.operation === 'auth') {
		await connectToDb();

		const userlanguage = req['query']['language'] ? req['query']['language'].toString() : 'sr';
		const dictionary = getLanguage(userlanguage);

		const token = req.headers.authorization;
		if (!isEmpty(token)) {
				
			try{
				const decoded = verifyToken(token);
				const partnerId = encodeId(decoded['sub']); 
				const partner = await Partner.findById(partnerId, '-password');
				if (partner) {
					return res.status(200).json({ endpoint: 'partners', operation: 'auth', success: true, code: 1, error: 'selection error', message: dictionary['apiPartnerAuthCode1'] });
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



	process.on('SIGINT', function(){
      mongoose.connection.close(function(){
          console.log("Mongoose default connection is disconnected due to application termination");
          process.exit(0)
      });
  });
	
}