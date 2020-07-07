import { isMobile, apiEndpoint, setApiBasLink } from '../lib/helpers/generalFunctions';
import apiRoot  from '../lib/constants/api';


interface DispatchObj {
	type: string;
	payload?: any;
	meta?: any;
}
type dispatch = (obj: DispatchObj) => any;

export const userDeviceActionTypes = {
  SUCCESS: 'USER_DEVICE_ACTION_SUCCESS',
};

export function setUserDevice(userAgent: string) {

  return function (dispatch: dispatch) {
    dispatch({
      type: userDeviceActionTypes.SUCCESS,
      payload: isMobile(userAgent),
    });
  };
}

export const userLanguageActionTypes = {
  SUCCESS: 'USER_LANGUAGE_ACTION_SUCCESS',
};

export function setUserLanguage(language: string) {

  return function (dispatch: dispatch) {
    dispatch({
      type: userLanguageActionTypes.SUCCESS,
      payload: language,
    });
  };
}

export const changeSingleFieldActionType = {
  SUCCESS: 'USER_CHANGE_SINGLE_ACTION_SUCCESS',
};

export function changeSingleUserField(field: string, value: any) {

  return function (dispatch: dispatch) {
    dispatch({
      meta: {field: field, source: 'user'},
      type: changeSingleFieldActionType.SUCCESS,
      payload: value,
    });
  };
}

export const errorHandlerActions = {
  ERROR: 'ERROR_HANDLER'
};

export const registrateUserActionTypes = {
  START: 'USER_REGISTRATE_START',
  ERROR: 'USER_REGISTRATE_ERROR',
  SUCCESS: 'USER_REGISTRATE_SUCCESS',
};

export function registrateUser(data: object, link: object) {
  const endpoint = setApiBasLink(link, apiRoot.USERS_SAVE);
  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      data,
      registrateUserActionTypes
    );
  };
}

export const passChangeUserActionTypes = {
  START: 'USER_PASS_CHANGE_START',
  ERROR: 'USER_PASS_CHANGE_ERROR',
  SUCCESS: 'USER_PASS_CHANGE_SUCCESS',
};

export function changePasswordUser(param: string, data: object, link: object) {
  const endpoint = setApiBasLink(link, apiRoot.USERS_UPDATE);
  const sendBody = { param, data, type: 'password' };

  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      sendBody,
      passChangeUserActionTypes
    );
  };
}

export const passChangeRequestUserActionTypes = {
  START: 'USER_PASS_REQUEST_CHANGE_START',
  ERROR: 'USER_PASS_REQUEST_CHANGE_ERROR',
  SUCCESS: 'USER_PASS_REQUEST_CHANGE_SUCCESS',
};

export function changePasswordRequestUser(param: string, data: object, link: object) {
  const endpoint = setApiBasLink(link, apiRoot.USERS_UPDATE);
  const sendBody = { param, data, type: 'passwordChange' };

  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      sendBody,
      passChangeRequestUserActionTypes
    );
  };
}

export const loginUserActionTypes = {
  START: 'USER_LOGIN_START',
  ERROR: 'USER_LOGIN_ERROR',
  SUCCESS: 'USER_LOGIN_SUCCESS',
};

export function loginUser(data: object, link: object) {
  const endpoint = setApiBasLink(link, apiRoot.USERS_LOGIN);
  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      data,
      loginUserActionTypes
    );
  };
}

export const saveReservationUserActionTypes = {
  START: 'USER_SAVE_RESRVATION_START',
  ERROR: 'USER_SAVE_RESRVATION_ERROR',
  SUCCESS: 'USER_SAVE_RESRVATION_SUCCESS',
};

export function saveUserReservation(link: object, data: object, auth: string) {
  const endpoint = setApiBasLink(link, apiRoot.RESERVATIONS_SAVE);
  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      data,
      saveReservationUserActionTypes,
      null,
      false,
      "POST",
      auth
    );
  };
}


export const getConversationsUserActionTypes = {
  START: 'USER_GET_CONVERSATIONS_START',
  ERROR: 'USER_GET_CONVERSATIONS_ERROR',
  SUCCESS: 'USER_GET_CONVERSATIONS_SUCCESS',
};

export function getUserConversations(link: object, data: object, auth: string) {
  const endpoint = setApiBasLink(link, apiRoot.USERS_GET_CONVERSATIONS);
  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      data,
      getConversationsUserActionTypes,
      null,
      false,
      "POST",
      auth
    );
  };
}


export const sendMessageUserActionTypes = {
  START: 'USER_SEND_MESSAGE_START',
  ERROR: 'USER_SEND_MESSAGE_ERROR',
  SUCCESS: 'USER_SEND_MESSAGE_SUCCESS',
};

export function sendUserMessage(link: object, data: object, auth: string) {
  const endpoint = setApiBasLink(link, apiRoot.USERS_SEND_MESSAGE);
  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      data,
      sendMessageUserActionTypes,
      null,
      false,
      "POST",
      auth
    );
  };
}