import { apiEndpoint, setApiBasLink } from '../lib/helpers/generalFunctions';
import apiRoot  from '../lib/constants/api';


interface DispatchObj {
	type: string;
	payload?: any;
	meta?: any;
}
type dispatch = (obj: DispatchObj) => any;

export const adminLoginActionTypes = {
  START: 'ADMIN_LOGIN_START',
  ERROR: 'ADMIN_LOGIN_ERROR',
  SUCCESS: 'ADMIN_LOGIN_SUCCESS',
};

export function adminLogin(link: object, data: object) {
  const endpoint = setApiBasLink(link, apiRoot.ADMIN_LOGIN);

  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      data,
      adminLoginActionTypes
    );
  };
}