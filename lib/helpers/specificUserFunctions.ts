import genOptions from '../constants/generalOptions';
import { isEmpty } from './validations';
import { setUpLinkBasic } from './generalFunctions';
import fetch from 'isomorphic-unfetch';
import nextCookie from 'next-cookies';
import Crypto from 'crypto';


export const isUserLogged = async (context: any): Promise<boolean> => {
	const link = setUpLinkBasic({path: context.asPath, host: context.req.headers.host});
	const allCookies = nextCookie(context);
  const token = allCookies['trilino-user-token'];

  if (token) {
  	try{
	    const apiUrl = `${link["protocol"]}${link["host"]}/api/users/auth/?language=${link['queryObject']['language']}`;
	      const response = await fetch(apiUrl, {
	      credentials: 'include',
	      headers: {
	        Authorization: `${token}`
	      }
	    });

	    if (response.status === 200) {
	    	return true;
	    }else{
	    	return false;
	    }
	  }catch(err){
	    return false;
	  }
  }else{
  	return false;
  }
}

export const isUserLoggedOutsideCall = async (context: any): Promise<boolean> => {
	const link = setUpLinkBasic({path: context.asPath, host: context.req.headers.host});

  try{
    const apiUrl = `${link["protocol"]}${link["host"]}/api/users/auth/?userAuth=${link['queryObject']['userAuth']}&language=${link['queryObject']['language']}`;
      const response = await fetch(apiUrl);
    if (response.status === 200) {
    	return true;
    }else{
    	return false;
    }
  }catch(err){
    return false;
  }
}

export const testForRes = async (context: any): Promise<any> => {
	const link = setUpLinkBasic({path: context.asPath, host: context.req.headers.host});

  try{
    const apiUrl = `${link["protocol"]}${link["host"]}/api/reservations/sendCateringReminder/`;
    const response = await fetch(apiUrl);

    return response;
  }catch(err){
    return err;
  }
}

export const getUserToken = (context: any): string => {
	const allCookies = nextCookie(context);
	const token = allCookies['trilino-user-token'] ? allCookies['trilino-user-token'] : '';
	return token;
}

export const prepareObjForUserReservation = (obj: string, data: Array<object>): object => {
	const result = {};

	if (obj === 'catering') {
		for (var i = 0; i < data.length; ++i) {
			if (typeof data[i]['quantity'] === 'string') {
				if (parseInt(data[i]['quantity']) > 0) {
					result[data[i]['regId']] = data[i]['quantity'];
				}
			}

			if (typeof data[i]['quantity'] === 'number') {
				if (data[i]['quantity'] > 0) {
					result[data[i]['regId']] = data[i]['quantity'].toString();
				}
			}
			
		}
	}else{
		for (var i = 0; i < data.length; ++i) {
			if (data[i]['type'] === obj) {
				result[data[i]['regId']] = true;
			}
		}
	}

	return result;
}
