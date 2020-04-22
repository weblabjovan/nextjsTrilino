import request from 'superagent';
import cookie from 'js-cookie';
import LinkClass from '../classes/Link';
import { languageList } from '../language/locale';


export const setApiBasLink = (linkObj: object, route: string): string => {
  const base = `${linkObj['protocol']}${linkObj['host']}/api`;
  const url = `${base}${route}`;

  return url;
}

export const isMobile = (userAgent: string): boolean => {

	let isMobile = false;

	if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0,4))) { 
	    isMobile = true;
	}

	return isMobile;
}

export const changeLanguagePath = (path: string, lang: string, newLang: string): string =>{
	if (path === '/') {
		return `/?language=${newLang}`;
	}else{
		let newPath = path;

		if (path.indexOf('language=') !== -1) {
			if (lang === 'sr') {
				newPath = path.replace("language=sr", `language=${newLang}`);
			}
			if (lang === 'en') {
				newPath = path.replace("language=en", `language=${newLang}`);
			}
		}

		return newPath;
	} 
}

export const parseUrl = (url:string):object => {
  const result = {path:'', query:{}};
  const initial = url.split('?');
  result.path = initial[0];
  result.query = {};
  const second = initial[1].split('&');
  second.forEach((query) => {
      const ar = query.split('=');
      result.query[ar[0]] = ar[1];
  });

  return result;
}

export const sendFile =  ( 
    dispatch: any, 
    endpoint: string,
    file: any,
    actionTypes: any
  ): any => 
{

  dispatch({ type: actionTypes.START });
  const req = request.put(endpoint);

  req.set("Content-Type", file['type'] )
  .send(file)
  .end((error, res) => {
    if (error) {
      dispatch({
        type: actionTypes.ERROR,
        payload: error,
        requestData : file
      });

    } else if (res) {
      if (res.error) {
        dispatch({
          type: actionTypes.ERROR,
          payload: 'Unexpected error!',
          requestData : file
        });
      } else if (res.status !== 200) {
        dispatch({
          type: actionTypes.ERROR,
          payload: { status: res.status, text: res.text, body: res.body },
          requestData : file
        });
      } else {
        dispatch({
          type: actionTypes.SUCCESS,
          payload: { status: res.status, text: res.text, body: res.body },
          requestData : file
        });
      }
    }
  });
}

export const apiEndpoint = (
  dispatch: any,
  endpoint: string,
  data: any,
  actionTypes: any,
  callback: any = null,
  isFileRequest: any = false,
  requestType: string = "POST",
  auth: any = null ): any =>
{

  dispatch({ type: actionTypes.START });

  const req = requestType == "POST" ? request.post(endpoint) : request.get(endpoint);

  if (isFileRequest) {
    const files = [...data.files];
    files.map((file) => {
      req.attach('uploadFiles', file, file.name);
    });
  } else if (requestType == "GET"){
	  req.query(data).send();
  } else {
	  req.send(data);
  }
  if (auth) {
    req.set('Authorization', `${auth}` );
  }
  return req.set('Accept', 'application/json')
  .end((error, res) => {
    if (error) {
      dispatch({
        type: actionTypes.ERROR,
        payload: error,
        requestData : data
      });

    } else if (res) {
      const response = JSON.parse(res.text);
      if (res.error) {
        dispatch({
          type: actionTypes.ERROR,
          payload: 'Unexpected error!',
          requestData : data
        });
      } else if (res.text.length === 0) {
        dispatch({
          type: actionTypes.ERROR,
          payload: 'Error: Empty response!',
          requestData : data
        });
      } else {
        dispatch({
          type: actionTypes.SUCCESS,
          payload: isFileRequest ? { data, response } : response,
          requestData : data
        });
        if (typeof callback === 'function') {
          callback(response);
        }
      }
    }
  });
}

export const setCookie = (data: any, name: string, expires: number): void => {
  if (name === 'trilino-user-token') {
    unsetCookie('trilino-partner-token');
  }
  if (name === 'trilino-partner-token') {
    unsetCookie('trilino-user-token');
  }
  cookie.set(name, data, { expires });
}

export const unsetCookie = (name: string): void => {
  cookie.remove(name);
}

export const getCookie = (cookieName: string): string => {
  const name = cookie.get(cookieName);
  return name;
}

export const setUpLinkBasic = (url: string | object): object => {
  const linkClass = new LinkClass();

  if (typeof url === 'string') {
    linkClass.generateLinkFromUrl(url);
  }else{
    linkClass.generateLinkFromContext(url);
  }
  
  const link = linkClass.getParsedUrl();

  return link;
}

export const getArrayObjectByFieldValue = (arr: Array<object>, field: string, value: string): null | object => {
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i][field]) {
      if (arr[i][field] === value) {
        return arr[i];
      }
    }
  }

  return null;
}

export const getArrayIndexByFieldValue = (arr: Array<object>, field: string, value: string): number => {
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i][field]) {
      if (arr[i][field] === value) {
        return i;
      }
    }
  }

  return -1;
}

export const getObjectFieldByFieldValue = (obj: object, field: string, value: string): null | object => {

  for(let key in obj){
    if (obj[key][field] === value) {
      return obj[key];
    }
  }

  return null;
}

export const setGetQuery = (type: string, data: object): string => {
  if (type === 'search') {
    return setSearchQuery(data);
  }

  return '';
}

const setSearchQuery = (data: object): string => {
  data['multiple'] = true;
  data['offer'] = data['offer'] ? data['offer'].toString().replace(/,/g, '%') : null;
  return JSON.stringify(data).replace(/"/g, '').replace(/:/g, '=').replace(/,/g, '&').replace(/{|}/g, '');
}

export const setUrlString = (name: string): string => {
  const newName = name.toLowerCase();
  const split  = newName.split(' ');
  let res = '';

  if (split.length > 1) {
    res = split.join('-');
  }else{
    res = split[0];
  }

  return res;

}

export const defineLanguage = (language: string | string[] | null | undefined): string => {
  if (language) {
    if (languageList.indexOf(language.toString()) !== -1) {
      return language.toString();
    }
  }

  return 'sr';
}

export const isTrilinoCatering = (regId: string): boolean => {
  const cateringCodes = ['0000000000001', '0000000000002'];

  if (cateringCodes.indexOf(regId) === -1) {
    return false;
  }

  return true;
}

export const currencyFormat = (num: number): string => {
  const ra = new Number(num);
  return ra.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export const errorExecute = (window: any, error: boolean): void => {
  if (error) {
    const link = setUpLinkBasic(window.location.href);
    const lang = link['queryObject']['language'] ? link['queryObject']['language'] : 'sr';
    window.location.href = `${link['protocol']}${link['host']}/?page=error&language=${lang}&error=1`;
  }
}

export const getOrgPageName = (orgRoot: string, pageName: string): string => {
  return pageName ? pageName : orgRoot;
}

export const getOrgHead = (orgRoot: string, pageName: string): object => {
  if (orgRoot === 'home') {
    const page = pageName ? pageName : orgRoot;
    if (page === 'home') {
      return{ title: 'headTitleIndex', description: 'headDescriptionIndex'};
    }
    if (page === 'contact') {
      return{ title: 'headTitleContact', description: 'headDescriptionContact'};
    }
    if (page === 'terms') {
      return{ title: 'headTitleTerms', description: 'headDescriptionTerms'};
    }
    if (page === 'partnership') {
      return{ title: 'headTitlePartnership', description: 'headDescriptionPartnership'};
    }
    if (page === 'payments') {
      return{ title: 'headTitleOnlinePayments', description: 'headDescriptionOnlinePayments'};
    }
    if (page === 'error') {
      return{ title: 'headTitleErrorPage', description: 'headDescriptionErrorPage'};
    }
    if (page === 'faq') {
      return{ title: 'headTitleFaqPage', description: 'headDescriptionFaqPage'};
    }
    if (page === 'privacy') {
      return{ title: 'headTitlePrivacyPage', description: 'headDescriptionPrivacyPage'};
    }
  }

  if (orgRoot === 'login') {
    const page = pageName ? pageName : 'user';
    if (page === 'user') {
      return{ title: 'headTitleLogin', description: 'headDescriptionLogin'};
    }

    if (page === 'partner') {
      return{ title: 'headTitlePartnershipLogin', description: 'headDescriptionPartnershipLogin'};
    }

    if (page === 'dev') {
      return{ title: 'headTitleDevLogin', description: 'headDescriptionDevLogin'};
    }

    if (page === 'admin') {
      return{ title: 'headTitleAdminLogin', description: 'headDescriptionAdminLogin'};
    }
  }

  if (orgRoot === 'payment') {
    const page = pageName ? pageName : '';
    if (page === 'reservationSuccess') {
      return{ title: 'headTitlePaymentSuccess', description: 'headDescriptionPaymentSuccess'};
    }

    if (page === 'reservationFailure') {
      return{ title: 'headTitlePaymentFailure', description: 'headDescriptionPaymentFailure'};
    }

    if (page === 'cateringSuccess') {
      return{ title: 'headTitleCateringPayment', description: 'headDescriptionCateringPayment'};
    }
  }

  return{ title: '', description: ''};
}

export const getServerHost = (host: string): string => {

  if (host === 'dev.trilino.com' || host.indexOf('trilino-dev') !== -1 || host === 'www.dev.trilino.com') {
   return 'dev';
  }

  if (host === 'test.trilino.com' || host.indexOf('trilino-test') !== -1 || host === 'www.test.trilino.com') {
    return 'test';
  }

  if (host === 'trilino.com' || host.indexOf('trilino-prod') !== -1 || host === 'www.trilino.com') {
    return 'prod';
  }

  return 'local';
}