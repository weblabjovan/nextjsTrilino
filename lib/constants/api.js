const APIRoot =  'http://localhost:3000/api';

const API = {

	PARTNERS_SAVE: '/partners/save/',

};

Object.keys(API).map((key) => API[key] = `${ APIRoot }${ API[key] }`);

export default API;
