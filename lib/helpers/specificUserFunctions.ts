import genOptions from '../constants/generalOptions';
import { isEmpty } from './validations';
import { setUpLinkBasic, getCookie } from './generalFunctions';
import fetch from 'isomorphic-unfetch';
import nextCookie from 'next-cookies';
import Crypto from 'crypto';



export const isUserLogged = async (href: any): Promise<boolean> => {
	const link = setUpLinkBasic(href);
  const token = getCookie('trilino-user-token');

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

export const getUserToken = (context: any): string => {
	const allCookies = nextCookie(context);
	const token = allCookies['trilino-user-token'] ? allCookies['trilino-user-token'] : '';
	return token;
}

export const prepareObjForUserReservation = (obj: string, data: Array<object>): object => {
	const result = {};

	if (obj === 'catering') {
		for (var i = 0; i < data.length; ++i) {
			result[data[i]['regId']] = data[i]['quantity'].toString();
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
