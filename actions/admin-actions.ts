import { apiEndpoint, setApiBasLink, sendFile } from '../lib/helpers/generalFunctions';
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

export const adminGetPartnersActionTypes = {
  START: 'ADMIN_GET_PARTNERS_START',
  ERROR: 'ADMIN_GET_PARTNERS_ERROR',
  SUCCESS: 'ADMIN_GET_PARTNERS_SUCCESS',
};

export function adminGetPartners(link: object, data: object, auth: string) {
  const endpoint = setApiBasLink(link, apiRoot.ADMIN_GET_PARTNERS);

  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      data,
      adminGetPartnersActionTypes,
      null,
      false,
      "POST",
      auth
    );
  };
}

export const activatePartnerActionTypes = {
  START: 'ADMIN_ACTIVATE_PARTNER_START',
  ERROR: 'ADMIN_ACTIVATE_PARTNER_ERROR',
  SUCCESS: 'ADMIN_ACTIVATE_PARTNER_SUCCESS',
};

export function activatePartner(link: object, data: object, auth: string) {
  const endpoint = setApiBasLink(link, apiRoot.ADMIN_ACTIVATE_PARTNER);

  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      data,
      activatePartnerActionTypes,
      null,
      false,
      "POST",
      auth
    );
  };
}

export const preSignPhotoActionTypes = {
  START: 'ADMIN_PHOTO_PRESIGN_START',
  ERROR: 'ADMIN_PHOTO_PRESIGN_ERROR',
  SUCCESS: 'ADMIN_PHOTO_PRESIGN_SUCCESS',
};

export function preSignPhoto(link: object, data: object, auth: string) {
  const endpoint = setApiBasLink(link, apiRoot.ADMIN_PARTNER_PHOTO_PRESIGN);

  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      data,
      preSignPhotoActionTypes,
      null,
      false,
      "POST",
      auth
    );
  };
}

export const putPartnerProfilePhotoActionTypes = {
  START: 'ADMIN_PUT_PARTNER_PHOTO_START',
  ERROR: 'ADMIN_PUT_PARTNER_PHOTO_ERROR',
  SUCCESS: 'ADMIN_PUT_PARTNER_PHOTO_SUCCESS',
};

export function putPartnerProfilePhoto(link: string, data: object) {
  const endpoint = link;

  return function (dispatch: dispatch) {
    sendFile(
      dispatch,
      endpoint,
      data,
      putPartnerProfilePhotoActionTypes
    );
  };
}

export const adminSavePartnerPhotoActionTypes = {
  START: 'ADMIN_PARTNER_PHOTO_SAVE_START',
  ERROR: 'ADMIN_PARTNER_PHOTO_SAVE_ERROR',
  SUCCESS: 'ADMIN_PARTNER_PHOTO_SAVE_SUCCESS',
};

export function adminSavePartnerPhoto(link: object, data: object, auth: string) {
  const endpoint = setApiBasLink(link, apiRoot.ADMIN_PARTNER_PHOTO_SAVE);

  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      data,
      adminSavePartnerPhotoActionTypes,
      null,
      false,
      "POST",
      auth
    );
  };
}


export const adminDeletePartnerPhotoActionTypes = {
  START: 'ADMIN_PARTNER_PHOTO_DELETE_START',
  ERROR: 'ADMIN_PARTNER_PHOTO_DELETE_ERROR',
  SUCCESS: 'ADMIN_PARTNER_PHOTO_DELETE_SUCCESS',
};

export function adminDeletePartnerPhoto(link: object, data: object, auth: string) {
  const endpoint = setApiBasLink(link, apiRoot.ADMIN_PARTNER_PHOTO_DELETE);

  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      data,
      adminDeletePartnerPhotoActionTypes,
      null,
      false,
      "POST",
      auth
    );
  };
}


export const adminBasicDevLoginActionTypes = {
  START: 'ADMIN_BASIC_DEV_LOGIN_START',
  ERROR: 'ADMIN_BASIC_DEV_LOGIN_ERROR',
  SUCCESS: 'ADMIN_BASIC_DEV_LOGIN_SUCCESS',
};

export function adminBasicDevLogin(link: object, data: object) {
  const endpoint = setApiBasLink(link, apiRoot.ADMIN_DEV_LOGIN);

  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      data,
      adminBasicDevLoginActionTypes,
    );
  };
}


export const adminSavePartnerFieldActionTypes = {
  START: 'ADMIN_PARTNER_FIELD_SAVE_START',
  ERROR: 'ADMIN_PARTNER_FIELD_SAVE_ERROR',
  SUCCESS: 'ADMIN_PARTNER_FIELD_SAVE_SUCCESS',
};

export function adminSavePartnerField(link: object, data: object, auth: string) {
  const endpoint = setApiBasLink(link, apiRoot.ADMIN_PARTNER_FIELD_SAVE);

  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      data,
      adminSavePartnerFieldActionTypes,
      null,
      false,
      "POST",
      auth
    );
  };
}

export const adminFinancialSearchActionTypes = {
  START: 'ADMIN_FINANCIAL_SEARCH_START',
  ERROR: 'ADMIN_FINANCIAL_SEARCH_ERROR',
  SUCCESS: 'ADMIN_FINANCIAL_SEARCH_SUCCESS',
};

export function adminFinancialSearch(link: object, data: object, auth: string) {
  const endpoint = setApiBasLink(link, apiRoot.ADMIN_FINANCIAL_SEARCH);

  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      data,
      adminFinancialSearchActionTypes,
      null,
      false,
      "POST",
      auth
    );
  };
}


export const adminGenerateSerialsActionTypes = {
  START: 'ADMIN_GENERATE_SERIALS_START',
  ERROR: 'ADMIN_GENERATE_SERIALS_ERROR',
  SUCCESS: 'ADMIN_GENERATE_SERIALS_SUCCESS',
};

export function adminGenerateSerials(link: object, data: object, auth: string) {
  const endpoint = setApiBasLink(link, apiRoot.ADMIN_GENERATE_SERIALS);

  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      data,
      adminGenerateSerialsActionTypes,
      null,
      false,
      "POST",
      auth
    );
  };
}