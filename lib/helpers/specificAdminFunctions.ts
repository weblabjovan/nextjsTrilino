import { calculateActivationProcess } from './specificPartnerFunctions';
import { setUpLinkBasic, getServerHost } from './generalFunctions';
import fetch from 'isomorphic-unfetch';
import nextCookie from 'next-cookies';


export const decoratePartners = (partners: Array<object>): Array<object> => {
	for (var i = 0; i < partners.length; ++i) {
		addActivationPercent(partners[i]);
	}

	return partners;
}

export const addActivationPercent = (partner: object): object => {
	partner['activationPercent'] = calculateActivationProcess(partner);

	return partner;
}

export const changePartnerListItem = (partner: object, list: Array<object>): Array<object> => {
	for (var i = 0; i < list.length; ++i) {
		if (partner['_id'] === list[i]['_id']) {
			list[i] = addActivationPercent(partner);
			break;
		}
	}

	return list;
}

export const findPartnerFromTheList = (partnerId: string, list: Array<object>): object | null => {
	for (var i = 0; i < list.length; ++i) {
		if (list[i]['_id'] === partnerId) {
			return list[i];
		}
	}

	return null;
}

export const getPhotoNumbers = (partner: object): object => {
	const numArr = [];
	let largest = 1;
	if (partner['photos']) {
		if (Array.isArray(partner['photos'])) {
			for (var i = 0; i < partner['photos'].length; ++i) {
				const config = partner['photos'][i]['name'].split('/');
				numArr.push(parseInt(config[1].substr(5)));
			}
		}
	}

	if (numArr.length) {
		largest = Math.max(...numArr) + 1;
	}

	return {numArr, largest};
}

export const setUpPhotosForSave = (partner: object, photoName: string): Array<object> => {
	const newPartner = {... partner};
	if (newPartner['photos']) {
		newPartner['photos'].push({name: photoName, main: false, selection: false});
	}else{
		newPartner['photos'] = [{name: photoName, main: false, selection: false}];
	}

	return newPartner['photos'];
}

export const getPartnerMainPhoto = (partner: object): null | object => {
	if (partner['photos']) {
		if (Array.isArray(partner['photos'])) {
			for (var i = 0; i < partner['photos'].length; ++i) {
				if (partner['photos'][i]['main']) {
					return partner['photos'][i];
				}
			}
		}
	}

	return null;
}

export const getNumberOfPartnerSelectionPhotos = (partner: object): number => {
	let num = 0;

	if (partner['photos']) {
		if (Array.isArray(partner['photos'])) {
			for (var i = 0; i < partner['photos'].length; ++i) {
				if (partner['photos'][i]['selection']) {
					num = ++num;
				}
			}
		}
	}

	return num;
}

export const setPhotosForDelete = (photos: Array<object>, photo: string): Array<object> => {
	const list = [...photos];
	let index = -1;
	for (var i = 0; i < list.length; ++i) {
		if (list[i]['name'] === photo) {
			index = i;
			break
		}
	}

	if (index > -1) {
		list.splice(index, 1);
	}

	return list;
}

export const isDevEnvLogged = async (context: any): Promise<boolean> => {
	const link = setUpLinkBasic({path: context.asPath, host: context.req.headers.host});
	const host = getServerHost(link['host']);
	
	if (host === 'dev' || host === 'test') {
		const allCookies = nextCookie(context);
    	const devAuth = allCookies['trilino-dev-auth'];
	    if (devAuth) {
	      try{
	        const apiUrl = `${link["protocol"]}${link["host"]}/api/admin/devAuth/`;
	        const response = await fetch(apiUrl, {
	          credentials: 'include',
	          headers: {
	            Authorization: `${devAuth}`
	          }
	        });

	        if (response['status'] === 200) {
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
	}else{
		return true;
	}
}

export const isAdminLogged = async (context: any): Promise<boolean> => {
	const link = setUpLinkBasic({path: context.asPath, host: context.req.headers.host});
	const allCookies = nextCookie(context);
  const token = allCookies['trilino-admin-token'];

  if (token) {
  	try{
	    const apiUrl = `${link["protocol"]}${link["host"]}/api/admin/auth/`;
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

export const getAdminToken = (context: any): string => {
	const allCookies = nextCookie(context);
	const token = allCookies['trilino-admin-token'] ? allCookies['trilino-admin-token'] : '';
	return token;
}