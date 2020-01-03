import {
  changeSingleFieldActionType, deleteReservationActionType
} from '../actions/reservation-actions';

interface initialState {
	deleteReservationStart: boolean;
  deleteReservationError: object | boolean;
  deleteReservationSuccess: null | object;
}

const initialState: initialState  = {
  deleteReservationStart: false,
  deleteReservationError: false,
  deleteReservationSuccess: null,

};

const actionsMap = {
	[changeSingleFieldActionType.SUCCESS]: (state, action) => {
    if (action.meta.source === 'partner') {
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
  
};

export default function reducer(state: object = initialState, action: any = {}) {
	let fn = null;
	action.type ? fn = actionsMap[action.type] : null;
  	return fn ? fn(state, action) : state;
}
