import {
  registratePartnerActionTypes
} from '../actions/partner-actions';


interface initialState {

  partnerRegStart: boolean;
  partnerRegError: object;
  partnerRegSuccess: any;
}

const initialState: initialState  = {

  partnerRegStart: false,
  partnerRegError: {},
  partnerRegSuccess: null,
};

const actionsMap = {

  [registratePartnerActionTypes.START]: (state) => {
    return {
      ...state,
      partnerRegStart: true,
      partnerRegError: {},
    };
  },
  [registratePartnerActionTypes.ERROR]: (state, action) => {
    return {
      ...state,
      partnerRegStart: false,
      partnerRegError: action.payload.response.body,
    };
  },
  [registratePartnerActionTypes.SUCCESS]: (state, action) => {
    return {
      ...state,
      partnerRegSuccess: action.payload,
      partnerRegStart: false,
    };
  },
};

export default function reducer(state: object = initialState, action: any = {}) {
	let fn = null;
	action.type ? fn = actionsMap[action.type] : null;
  	return fn ? fn(state, action) : state;
}
