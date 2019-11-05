import request from 'superagent';
import cookie from 'js-cookie';
import LinkClass from '../classes/Link';

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
    req.set('Authorization: Bearer jovansjzrhbsgtgzsjkaoutesvbshdj');
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
  cookie.set(name, data, { expires });
}

export const unsetCookie = (name: string): void => {
  cookie.remove(name);
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