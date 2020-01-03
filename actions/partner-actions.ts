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

export const passChangeRequestPartnerActionTypes = {
  START: 'PARTNER_PASS_REQUEST_CHANGE_START',
  ERROR: 'PARTNER_PASS_REQUEST_CHANGE_ERROR',
  SUCCESS: 'PARTNER_PASS_REQUEST_CHANGE_SUCCESS',
};

export function changePasswordRequestPartner(param: string, data: object, link: object) {
  const endpoint = setApiBasLink(link, apiRoot.PARTNERS_UPDATE);
  const sendBody = { param, data, type: 'passwordChange' };

  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      sendBody,
      passChangeRequestPartnerActionTypes
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

export const updateGeneralPartnerActionTypes = {
  START: 'PARTNER_GENERAL_UPDATE_START',
  ERROR: 'PARTNER_GENERAL_UPDATE_ERROR',
  SUCCESS: 'PARTNER_GENERAL_UPDATE_SUCCESS',
};

export function updateGeneralPartner(param: string, data: object, link: object, auth: string) {
  const endpoint = setApiBasLink(link, apiRoot.PARTNERS_UPDATE);
  const sendBody = { param, data, type: 'general' };

  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      sendBody,
      updateGeneralPartnerActionTypes,
      null,
      false,
      "POST",
      auth
    );
  };
}

export const updateOfferPartnerActionTypes = {
  START: 'PARTNER_OFFER_UPDATE_START',
  ERROR: 'PARTNER_OFFER_UPDATE_ERROR',
  SUCCESS: 'PARTNER_OFFER_UPDATE_SUCCESS',
};

export function updateOfferPartner(param: string, data: object, link: object, auth: string) {
  const endpoint = setApiBasLink(link, apiRoot.PARTNERS_UPDATE);
  const sendBody = { param, data, type: 'offer' };

  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      sendBody,
      updateOfferPartnerActionTypes,
      null,
      false,
      "POST",
      auth
    );
  };
}

export const updateCateringPartnerActionTypes = {
  START: 'PARTNER_CATERING_UPDATE_START',
  ERROR: 'PARTNER_CATERING_UPDATE_ERROR',
  SUCCESS: 'PARTNER_CATERING_UPDATE_SUCCESS',
};

export function updateCateringPartner(param: string, data: object, link: object, auth: string) {
  const endpoint = setApiBasLink(link, apiRoot.PARTNERS_UPDATE);
  const sendBody = { param, data, type: 'catering' };

  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      sendBody,
      updateCateringPartnerActionTypes,
      null,
      false,
      "POST",
      auth
    );
  };
}

export const updateDecorationgPartnerActionTypes = {
  START: 'PARTNER_DECORATION_UPDATE_START',
  ERROR: 'PARTNER_DECORATION_UPDATE_ERROR',
  SUCCESS: 'PARTNER_DECORATION_UPDATE_SUCCESS',
};

export function updateDecorationPartner(param: string, data: object, link: object, auth: string) {
  const endpoint = setApiBasLink(link, apiRoot.PARTNERS_UPDATE);
  const sendBody = { param, data, type: 'decoration' };

  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      sendBody,
      updateDecorationgPartnerActionTypes,
      null,
      false,
      "POST",
      auth
    );
  };
}

export const getPartnerProfileActionTypes = {
  START: 'PARTNER_PROFILE_GET_START',
  ERROR: 'PARTNER_PROFILE_GET_ERROR',
  SUCCESS: 'PARTNER_PROFILE_GET_SUCCESS',
};

export function getPartnerProfile(link: object, auth: string) {
  const endpoint = setApiBasLink(link, apiRoot.PARTNERS_GET);
  const sendBody = { type: 'profile' };

  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      sendBody,
      getPartnerProfileActionTypes,
      null,
      false,
      "POST",
      auth
    );
  };
}

export const getReservationTermsActionTypes = {
  START: 'PARTNER_GET_RESERVATION_TERMS_START',
  ERROR: 'PARTNER_GET_RESERVATION_TERMS_ERROR',
  SUCCESS: 'PARTNER_GET_RESERVATION_TERMS_SUCCESS',
};

export function getPartnerReservationTerms(link: object, data: object) {
  const endpoint = setApiBasLink(link, apiRoot.RESERVATIONS_FREE_TERMS);

  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      data,
      getReservationTermsActionTypes,
    );
  };
}

export const saveReservationActionTypes = {
  START: 'PARTNER_SAVE_RESERVATION_START',
  ERROR: 'PARTNER_SAVE_RESERVATION_ERROR',
  SUCCESS: 'PARTNER_SAVE_RESERVATION_SUCCESS',
};

export function savePartnerReservation(link: object, data: object, auth: string) {
  const endpoint = setApiBasLink(link, apiRoot.RESERVATIONS_SAVE);

  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      data,
      saveReservationActionTypes,
      null,
      false,
      "POST",
      auth
    );
  };
}

export const getReservationsActionTypes = {
  START: 'PARTNER_GET_RESERVATIONS_START',
  ERROR: 'PARTNER_GET_RESERVATIONS_ERROR',
  SUCCESS: 'PARTNER_GET_RESERVATIONS_SUCCESS',
};

export function getPartnerReservations(link: object, data: object) {
  const endpoint = setApiBasLink(link, apiRoot.RESERVATIONS_GET);

  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      data,
      getReservationsActionTypes,
    );
  };
}