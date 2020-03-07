import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import AWS from 'aws-sdk';
import bcrypt from 'bcrypt'; 
import Reservation from '../../../server/models/reservation';
import Partner from '../../../server/models/partner';
import connectToDb  from '../../../server/helpers/db';
import { generateString, encodeId, decodeId, setToken, verifyToken }  from '../../../server/helpers/general';
import { sendEmail }  from '../../../server/helpers/email';
import { isPartnerPhotoSaveDataValid, dataHasValidProperty, isPartnerMapSaveDataValid } from '../../../server/helpers/validations';
import { isEmpty, isMoreThan, isLessThan, isOfRightCharacter, isMatch, isPib, isEmail } from '../../../lib/helpers/validations';
import { setUpLinkBasic } from '../../../lib/helpers/generalFunctions';
import { getLanguage } from '../../../lib/language';
import Keys from '../../../server/keys';

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

	if (req.query.operation === 'partnerMapSave') {
		const token = req.headers.authorization;
		
		if (!isEmpty(token)) {
			try{
				const decoded = verifyToken(token);
				const admin = encodeId(decoded['sub']); 
				if ( admin === Keys.ADMIN_PASS) {

					if (false) {
						return res.status(404).json({ endpoint: 'admin', operation: 'partnerMapSave', success: false, code: 6, error: 'auth error', message: 'request data not valida' });
					}else{
						const {partnerId, map } = req.body;
						await connectToDb(req.headers.host);
						const partner = await Partner.findOneAndUpdate({ '_id': partnerId }, {"$set" : { map } }, { new: true }).select('-password');

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

					if (!isPartnerMapSaveDataValid(req.body)) {
						return res.status(404).json({ endpoint: 'admin', operation: 'partnerPhotoSave', success: false, code: 6, error: 'auth error', message: 'request data not valida' });
					}else{
						const {partnerId, map } = req.body;
						await connectToDb(req.headers.host);
						const partner = await Partner.findOneAndUpdate({ '_id': partnerId }, {"$set" : { map } }, { new: true }).select('-password');

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