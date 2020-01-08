import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt'; 
import Reservation from '../../../server/models/reservation';
import Partner from '../../../server/models/partner';
import connectToDb  from '../../../server/helpers/db';
import { generateString, encodeId, decodeId, setToken, verifyToken }  from '../../../server/helpers/general';
import { sendEmail }  from '../../../server/helpers/email';
import { isReservationSaveDataValid,  isReservationStillAvailable } from '../../../server/helpers/validations';
import { isEmpty, isMoreThan, isLessThan, isOfRightCharacter, isMatch, isPib, isEmail } from '../../../lib/helpers/validations';
import { setUpLinkBasic } from '../../../lib/helpers/generalFunctions';
import { getLanguage } from '../../../lib/language';
import Keys from '../../../server/keys';

export default async (req: NextApiRequest, res: NextApiResponse ) => {

	if (req.query.operation === 'login') {
		const { user, pass } = req.body;

		try{
			if (user === Keys.ADMIN_USER && pass === Keys.ADMIN_PASS) {
				const token = setToken('partner', decodeId(generateString, pass));
				return res.status(200).json({ endpoint: 'admin', operation: 'login', success: true, code: 1, token });
			}else{
				return res.status(404).json({ endpoint: 'admin', operation: 'login', success: false, code: 2, error: 'auth error' });
			}
		}catch(err){
			return res.status(404).json({ endpoint: 'admin', operation: 'login', success: false, code: 3, error: err });
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