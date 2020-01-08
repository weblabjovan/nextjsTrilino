import {
  adminLoginActionTypes
} from '../actions/admin-actions';

interface initialState {
	adminLoginStart: boolean;
  adminLoginError: object | boolean;
  adminLoginSuccess: null | object;
}

const initialState: initialState  = {
  adminLoginStart: false,
  adminLoginError: false,
  adminLoginSuccess: null,

};

const actionsMap = {

  [adminLoginActionTypes.START]: (state) => {
    return {
      ...state,
      adminLoginStart: true,
    };
  },
  [adminLoginActionTypes.ERROR]: (state, action) => {
    return {
      ...state,
      adminLoginStart: false,
      adminLoginError: action.payload.response.body,
    };
  },
  [adminLoginActionTypes.SUCCESS]: (state, action) => {
    return {
      ...state,
      adminLoginSuccess: action.payload,
      adminLoginStart: false,
    };
  },
  
};

export default function reducer(state: object = initialState, action: any = {}) {
	let fn = null;
	action.type ? fn = actionsMap[action.type] : null;
  	return fn ? fn(state, action) : state;
}
