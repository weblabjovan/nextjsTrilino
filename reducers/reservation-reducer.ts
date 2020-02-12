import { IreservationGeneral } from '../lib/constants/interfaces';
import {
  changeSingleFieldActionType, deleteReservationActionType, getReservationsOnDateActionType
} from '../actions/reservation-actions';

interface initialState {
	deleteReservationStart: boolean;
  deleteReservationError: object | boolean;
  deleteReservationSuccess: null | object;

  getReservationsStart: boolean;
  getReservationsError: object | boolean;
  getReservationsSuccess: null | number;

  reservations: Array<object>;

  reservationGeneral: IreservationGeneral;
  reservationAdditional: object;
  reservationCatering: object;
}

const initialState: initialState  = {
  deleteReservationStart: false,
  deleteReservationError: false,
  deleteReservationSuccess: null,

  getReservationsStart: false,
  getReservationsError: false,
  getReservationsSuccess: null,

  reservations: [],

  reservationGeneral:{
    name: '',
    room:'',
    adultsNum: '',
    kidsNum: '',
  },

  reservationAdditional: {

  },

  reservationCatering: {

  },

};

const actionsMap = {
	[changeSingleFieldActionType.SUCCESS]: (state, action) => {
    if (action.meta.source === 'reservation') {
      return {
        ...state,
        [action.meta.field]: action.payload,
      };
    }
  },

  [deleteReservationActionType.START]: (state) => {
    return {
      ...state,
      deleteReservationStart: true,
    };
  },
  [deleteReservationActionType.ERROR]: (state, action) => {
    return {
      ...state,
      deleteReservationStart: false,
      deleteReservationError: action.payload.response.body,
    };
  },
  [deleteReservationActionType.SUCCESS]: (state, action) => {
    return {
      ...state,
      deleteReservationSuccess: action.payload.code,
      deleteReservationStart: false,
    };
  },

  [getReservationsOnDateActionType.START]: (state) => {
    return {
      ...state,
      getReservationsStart: true,
      getReservationsSuccess: null,
    };
  },
  [getReservationsOnDateActionType.ERROR]: (state, action) => {
    return {
      ...state,
      getReservationsStart: false,
      getReservationsError: action.payload.response.body,
    };
  },
  [getReservationsOnDateActionType.SUCCESS]: (state, action) => {
    return {
      ...state,
      getReservationsStart: false,
      getReservationsSuccess: action.payload.code,
      reservations: action.payload.reservations,
    };
  },
  
};

export default function reducer(state: object = initialState, action: any = {}) {
	let fn = null;
	action.type ? fn = actionsMap[action.type] : null;
  	return fn ? fn(state, action) : state;
}
