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