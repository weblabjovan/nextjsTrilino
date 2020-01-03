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

export function changeSinglePartnerField(field: string, value: any) {

  return function (dispatch: dispatch) {
    dispatch({
      meta: {field: field, source: 'partner'},
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