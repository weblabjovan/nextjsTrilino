import { NextApiRequest, NextApiResponse } from 'next';
import Partner from '../../../server/models/partner';
import mongoose from 'mongoose';
import connectToDb  from '../../../server/helpers/db';
import { isPartnerRegDataValid } from '../../../server/helpers/validations';

export default async (req: NextApiRequest, res: NextApiResponse ) => {

	const { name, taxNum, city, contactPerson, contactEmail, contactPhone } = req.body;

	if (req.query.operation === 'save') {

		await connectToDb();

		if (isPartnerRegDataValid(req.body)) {
  		try{
  			const replica = await Partner.findOne({ taxNum });
  			if (replica) {
		    	return res.status(401).send({ endpoint: 'partners', operation: 'save', success: false, code: 2, error: 'validation error', message: `Partner with this Tax Number already exists in our records. Please procees to login.`  });
				}else{
		    	try{
		    		const newPartner = new Partner({ name, taxNum, city, contactPerson, contactEmail, contactPhone });
		    		await newPartner.save();
			    	return res.status(200).json({ endpoint: 'partners', operation: 'save', success: true, code: 1 });

		    	}catch(err){
		    		return res.status(500).send({ endpoint: 'partners', operation: 'save', success: false, code: 5, error: 'db error', message: err  });
		    	}
				}
  		}catch(err){
  			return res.status(500).send({ endpoint: 'partners', operation: 'save', success: false, code: 4, error: 'db error', message: err  });
  		}
		}else{
	    return res.status(401).send({ endpoint: 'partners', operation: 'save', success: false, code: 3, error: 'validation error', message: `Entered data are not valid, please try again.`  });
		}
	  	
	}


	process.on('SIGINT', function(){
      mongoose.connection.close(function(){
          console.log("Mongoose default connection is disconnected due to application termination");
          process.exit(0)
      });
  });
	
}