const APIRoot =  'http://localhost:3000/api';

const API = {

	PARTNERS_SAVE: '/partners/save/',
	PARTNERS_LOGIN: '/partners/login/',
	PARTNERS_GET: '/partners/get/',
	PARTNERS_UPDATE: '/partners/update/',
	PARTNERS_AUTH: '/partners/auth/',
};

Object.keys(API).map((key) => API[key] = `${ APIRoot }${ API[key] }`);

export default API;
