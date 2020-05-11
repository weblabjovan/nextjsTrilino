import { IreservationGeneral } from '../lib/constants/interfaces';
import {
  changeSingleFieldActionType, deleteReservationActionType, getReservationsOnDateActionType, confirmReservationActionType, getReservationsForUserActionType, cancelReservationActionType, confirmCateringActionType, deactivateReservationActionType, rateReservationActionType
} from '../actions/reservation-actions';

interface initialState {
	deleteReservationStart: boolean;
  deleteReservationError: object | boolean;
  deleteReservationSuccess: null | object;

  getReservationsStart: boolean;
  getReservationsError: object | boolean;
  getReservationsSuccess: null | number;

  confirmReservationStart: boolean;
  confirmReservationError: object | boolean;
  confirmReservationSuccess: null | object;

  getUserReservationStart: boolean;
  getUserReservationError: object | boolean;
  getUserReservationSuccess: null | number;

  cancelReservationStart: boolean;
  cancelReservationError: object | boolean;
  cancelReservationSuccess: null | object;

  confirmCateringStart: boolean;
  confirmCateringError: object | boolean;
  confirmCateringSuccess: null | object;

  deactivateReservationStart: boolean;
  deactivateReservationError: object | boolean;
  deactivateReservationSuccess: null | object;

  rateReservationStart: boolean;
  rateReservationError: object | boolean;
  rateReservationSuccess: null | number;

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

  confirmReservationStart: false,
  confirmReservationError: false,
  confirmReservationSuccess: null,

  getUserReservationStart: false,
  getUserReservationError: false,
  getUserReservationSuccess: null,

  cancelReservationStart: false,
  cancelReservationError: false,
  cancelReservationSuccess: null,

  confirmCateringStart: false,
  confirmCateringError: false,
  confirmCateringSuccess: null,

  deactivateReservationStart: false,
  deactivateReservationError: false,
  deactivateReservationSuccess: null,

  rateReservationStart: false,
  rateReservationError: false,
  rateReservationSuccess: null,

  reservations: [],

  reservationGeneral:{
    name: '',
    room:'',
    adultsNum: '',
    kidsNum: '',
    double: false,
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

  [confirmReservationActionType.START]: (state) => {
    return {
      ...state,
      confirmReservationStart: true,
      confirmReservationSuccess: null,
    };
  },
  [confirmReservationActionType.ERROR]: (state, action) => {
    return {
      ...state,
      confirmReservationStart: false,
      confirmReservationError: action.payload.response.body,
    };
  },
  [confirmReservationActionType.SUCCESS]: (state, action) => {
    return {
      ...state,
      confirmReservationStart: false,
      confirmReservationSuccess: action.payload.reservation,
    };
  },

  [getReservationsForUserActionType.START]: (state) => {
    return {
      ...state,
      getUserReservationStart: true,
      getUserReservationSuccess: null,
    };
  },
  [getReservationsForUserActionType.ERROR]: (state, action) => {
    return {
      ...state,
      getUserReservationStart: false,
      getUserReservationError: action.payload.response.body,
    };
  },
  [getReservationsForUserActionType.SUCCESS]: (state, action) => {
    return {
      ...state,
      getUserReservationStart: false,
      getUserReservationSuccess: action.payload.code,
      reservations: action.payload.reservations,
    };
  },

  [cancelReservationActionType.START]: (state) => {
    return {
      ...state,
      cancelReservationStart: true,
      cancelReservationSuccess: null,
    };
  },
  [cancelReservationActionType.ERROR]: (state, action) => {
    return {
      ...state,
      cancelReservationStart: false,
      cancelReservationError: action.payload.response.body,
    };
  },
  [cancelReservationActionType.SUCCESS]: (state, action) => {
    return {
      ...state,
      cancelReservationStart: false,
      cancelReservationSuccess: action.payload.result,
    };
  },

  [confirmCateringActionType.START]: (state) => {
    return {
      ...state,
      confirmCateringStart: true,
      confirmCateringSuccess: null,
    };
  },
  [confirmCateringActionType.ERROR]: (state, action) => {
    return {
      ...state,
      confirmCateringStart: false,
      confirmCateringError: action.payload.response.body,
    };
  },
  [confirmCateringActionType.SUCCESS]: (state, action) => {
    return {
      ...state,
      confirmCateringStart: false,
      confirmCateringSuccess: action.payload.catering,
    };
  },

  [deactivateReservationActionType.START]: (state) => {
    return {
      ...state,
      deactivateReservationStart: true,
      deactivateReservationSuccess: null,
    };
  },
  [deactivateReservationActionType.ERROR]: (state, action) => {
    return {
      ...state,
      deactivateReservationStart: false,
      deactivateReservationError: action.payload.response.body,
    };
  },
  [deactivateReservationActionType.SUCCESS]: (state, action) => {
    return {
      ...state,
      deactivateReservationStart: false,
      deactivateReservationSuccess: action.payload.result,
    };
  },

  [rateReservationActionType.START]: (state) => {
    return {
      ...state,
      rateReservationStart: true,
      deactivateReservationSuccess: null,
    };
  },
  [rateReservationActionType.ERROR]: (state, action) => {
    return {
      ...state,
      rateReservationStart: false,
      rateReservationError: action.payload.response.body,
    };
  },
  [rateReservationActionType.SUCCESS]: (state, action) => {
    return {
      ...state,
      rateReservationStart: false,
      rateReservationSuccess: action.payload.code,
    };
  },
  
};

export default function reducer(state: object = initialState, action: any = {}) {
	let fn = null;
	action.type ? fn = actionsMap[action.type] : null;
  	return fn ? fn(state, action) : state;
}
