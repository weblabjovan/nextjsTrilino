import { isMobile, apiEndpoint } from '../lib/helpers/generalFunctions';
import apiRoot  from '../lib/constants/api';


interface DispatchObj {
	type: string;
	payload?: any;
	meta?: any;
}
type dispatch = (obj: DispatchObj) => any;

export const registratePartnerActionTypes = {
  START: 'PARTNER_REGISTRATE_START',
  ERROR: 'PARTNER_REGISTRATE_ERROR',
  SUCCESS: 'PARTNER_REGISTRATE_SUCCESS',
};

export function registratePartner(data: object) {

  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      apiRoot.PARTNERS_SAVE,
      data,
      registratePartnerActionTypes
    );
  };
}