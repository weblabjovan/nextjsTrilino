import { isMobile, apiEndpoint, setApiBasLink } from '../lib/helpers/generalFunctions';
import apiRoot  from '../lib/constants/api';


interface DispatchObj {
	type: string;
	payload?: any;
	meta?: any;
}
type dispatch = (obj: DispatchObj) => any;

export const changeSingleFieldActionType = {
  SUCCESS: 'CHANGE_PARTNER_FIELD_SUCCESS',
};

export function changeSinglePartnerField(field: string, value: any) {

  return function (dispatch: dispatch) {
    dispatch({
      meta: {field: field, source: 'partner'},
      type: changeSingleFieldActionType.SUCCESS,
      payload: value,
    });
  };
}

export const registratePartnerActionTypes = {
  START: 'PARTNER_REGISTRATE_START',
  ERROR: 'PARTNER_REGISTRATE_ERROR',
  SUCCESS: 'PARTNER_REGISTRATE_SUCCESS',
};

export function registratePartner(data: object, link: object) {
  const endpoint = setApiBasLink(link, apiRoot.PARTNERS_SAVE);
  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      data,
      registratePartnerActionTypes
    );
  };
}

export const loginPartnerActionTypes = {
  START: 'PARTNER_LOGIN_START',
  ERROR: 'PARTNER_LOGIN_ERROR',
  SUCCESS: 'PARTNER_LOGIN_SUCCESS',
};

export function loginPartner(data: object, link: object) {
  const endpoint = setApiBasLink(link, apiRoot.PARTNERS_LOGIN);
  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      data,
      loginPartnerActionTypes
    );
  };
}

export const getPartnerActionTypes = {
  START: 'PARTNER_GET_START',
  ERROR: 'PARTNER_GET_ERROR',
  SUCCESS: 'PARTNER_GET_SUCCESS',
};

export function getPartner(id: string, encoded: boolean, link: object) {
  const point = setApiBasLink(link, apiRoot.PARTNERS_GET);
  const endpoint = `${point}?partner=${id}&encoded=${encoded}`;

  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      id,
      getPartnerActionTypes,
      null,
      false,
      'GET'
    );
  };
}

export const verificationPartnerActionTypes = {
  START: 'PARTNER_VERIFICATION_START',
  ERROR: 'PARTNER_VERIFICATION_ERROR',
  SUCCESS: 'PARTNER_VERIFICATION_SUCCESS',
};

export function verifyPartner(param: string, data: object, link: object) {
  const endpoint = setApiBasLink(link, apiRoot.PARTNERS_UPDATE);
  const sendBody = { param, data, type: 'verification' };
  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      sendBody,
      verificationPartnerActionTypes
    );
  };
}

export const passChangePartnerActionTypes = {
  START: 'PARTNER_PASS_CHANGE_START',
  ERROR: 'PARTNER_PASS_CHANGE_ERROR',
  SUCCESS: 'PARTNER_PASS_CHANGE_SUCCESS',
};

export function changePasswordPartner(param: string, data: object, link: object) {
  const endpoint = setApiBasLink(link, apiRoot.PARTNERS_UPDATE);
  const sendBody = { param, data, type: 'password' };

  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      sendBody,
      passChangePartnerActionTypes
    );
  };
}