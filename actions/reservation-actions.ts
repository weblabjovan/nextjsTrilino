import { apiEndpoint, setApiBasLink } from '../lib/helpers/generalFunctions';
import apiRoot  from '../lib/constants/api';


interface DispatchObj {
	type: string;
	payload?: any;
	meta?: any;
}
type dispatch = (obj: DispatchObj) => any;

export const changeSingleFieldActionType = {
  SUCCESS: 'CHANGE_RESERVATION_FIELD_SUCCESS',
};

export function changeSingleReservationField(field: string, value: any) {

  return function (dispatch: dispatch) {
    dispatch({
      meta: {field: field, source: 'reservation'},
      type: changeSingleFieldActionType.SUCCESS,
      payload: value,
    });
  };
}

export const deleteReservationActionType = {
  START: 'DELETE_RESERVATION_START',
  ERROR: 'DELETE_RESERVATION_ERROR',
  SUCCESS: 'DELETE_RESERVATION_SUCCESS',
};

export function deleteReservation(link: object, data: object, auth: string) {
  const endpoint = setApiBasLink(link, apiRoot.RESERVATIONS_DELETE);

  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      data,
      deleteReservationActionType,
      null,
      false,
      "POST",
      auth
    );
  };
}

export const getReservationsOnDateActionType = {
  START: 'GET_RESERVATIONS_ONDATE_START',
  ERROR: 'GET_RESERVATIONS_ONDATE_ERROR',
  SUCCESS: 'GET_RESERVATIONS_ONDATE_SUCCESS',
};

export function getReservationsOnDate(link: object, data: object) {
  const endpoint = setApiBasLink(link, apiRoot.RESERVATIONS_GET);

  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      data,
      getReservationsOnDateActionType,
    );
  };
}

export const confirmReservationActionType = {
  START: 'CONFIRM_RESERVATION_START',
  ERROR: 'CONFIRM_RESERVATION_ERROR',
  SUCCESS: 'CONFIRM_RESERVATION_SUCCESS',
};

export function confirmReservationAfterPay(link: object, data: object, auth: string) {
  const endpoint = setApiBasLink(link, apiRoot.RESERVATIONS_CONFIRM);

  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      data,
      confirmReservationActionType,
      null,
      false,
      "POST",
      auth
    );
  };
}

export const confirmCateringActionType = {
  START: 'CONFIRM_CATERING_START',
  ERROR: 'CONFIRM_CATERING_ERROR',
  SUCCESS: 'CONFIRM_CATERING_SUCCESS',
};

export function confirmCateringAfterPay(link: object, data: object, auth: string) {
  const endpoint = setApiBasLink(link, apiRoot.RESERVATIONS_CONFIRM_CATERING);

  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      data,
      confirmCateringActionType,
      null,
      false,
      "POST",
      auth
    );
  };
}

export const getReservationsForUserActionType = {
  START: 'GET_RESERVATIONS_FOR_USER_START',
  ERROR: 'GET_RESERVATIONS_FOR_USER_ERROR',
  SUCCESS: 'GET_RESERVATIONS_FOR_USER_SUCCESS',
};

export function getReservationsForUser(link: object, data: object, auth: string) {
  const endpoint = setApiBasLink(link, apiRoot.RESERVATIONS_GETFORUSER);

  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      data,
      getReservationsForUserActionType,
      null,
      false,
      "POST",
      auth
    );
  };
}

export const cancelReservationActionType = {
  START: 'CANCEL_RESERVATION_START',
  ERROR: 'CANCEL_RESERVATION_ERROR',
  SUCCESS: 'CANCEL_RESERVATION_SUCCESS',
};

export function cancelReservation(link: object, data: object, auth: string) {
  const endpoint = setApiBasLink(link, apiRoot.RESERVATIONS_CANCEL);

  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      data,
      cancelReservationActionType,
      null,
      false,
      "POST",
      auth
    );
  };
}

export const deactivateReservationActionType = {
  START: 'DEACTIVATE_RESERVATION_START',
  ERROR: 'DEACTIVATE_RESERVATION_ERROR',
  SUCCESS: 'DEACTIVATE_RESERVATION_SUCCESS',
};

export function deactivateReservation(link: object, data: object, auth: string) {
  const endpoint = setApiBasLink(link, apiRoot.RESERVATIONS_DEACTIVATE);

  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      endpoint,
      data,
      deactivateReservationActionType,
      null,
      false,
      "POST",
      auth
    );
  };
}