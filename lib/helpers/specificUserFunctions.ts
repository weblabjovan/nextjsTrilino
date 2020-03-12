import genOptions from '../constants/generalOptions';
import { isEmpty } from './validations';
import { setUpLinkBasic } from './generalFunctions';
import fetch from 'isomorphic-unfetch';
import nextCookie from 'next-cookies';





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

export const getUserToken = (context: any): string => {
	const allCookies = nextCookie(context);
	const token = allCookies['trilino-user-token'] ? allCookies['trilino-user-token'] : '';
	return token;
}