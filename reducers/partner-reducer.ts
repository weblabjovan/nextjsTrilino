import {
  registratePartnerActionTypes, getPartnerActionTypes, verificationPartnerActionTypes, passChangePartnerActionTypes, changeSingleFieldActionType, loginPartnerActionTypes, passChangeRequestPartnerActionTypes,
} from '../actions/partner-actions';


interface initialState {

  partnerRegStart: boolean;
  partnerRegError: object | boolean;
  partnerRegSuccess: null | object;

  partnerLoginStart: boolean;
  partnerLoginError: object | boolean;
  partnerLoginSuccess: null | object;

  partnerGetStart: boolean;
  partnerGetError: object | boolean;
  partnerGetSuccess: null | object;

  partnerVerificationStart: boolean;
  partnerVerificationError: object | boolean;
  partnerVerificationSuccess: null | object;

  partnerPassChangeStart: boolean;
  partnerPassChangeError: object | boolean;
  partnerPassChangeSuccess: null | object;

  partnerPassChangeRequestStart: boolean;
  partnerPassChangeRequestError: object | boolean;
  partnerPassChangeRequestSuccess: null | object;

  
}

const initialState: initialState  = {

  partnerRegStart: false,
  partnerRegError: {},
  partnerRegSuccess: null,

  partnerLoginStart: false,
  partnerLoginError: false,
  partnerLoginSuccess: null,

  partnerGetStart: false,
  partnerGetError: false,
  partnerGetSuccess: null,

  partnerVerificationStart: false,
  partnerVerificationError: false,
  partnerVerificationSuccess: null,

  partnerPassChangeStart: false,
  partnerPassChangeError: false,
  partnerPassChangeSuccess: null,

  partnerPassChangeRequestStart: false,
  partnerPassChangeRequestError: false,
  partnerPassChangeRequestSuccess: null,

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


  [loginPartnerActionTypes.START]: (state) => {
    return {
      ...state,
      partnerLoginStart: true,
    };
  },
  [loginPartnerActionTypes.ERROR]: (state, action) => {
    return {
      ...state,
      partnerLoginStart: false,
      partnerLoginError: action.payload.response.body,
    };
  },
  [loginPartnerActionTypes.SUCCESS]: (state, action) => {
    return {
      ...state,
      partnerLoginSuccess: action.payload,
      partnerLoginStart: false,
    };
  },


  [getPartnerActionTypes.START]: (state) => {
    return {
      ...state,
      partnerGetStart: true,
    };
  },
  [getPartnerActionTypes.ERROR]: (state, action) => {
    return {
      ...state,
      partnerGetStart: false,
      partnerGetError: action.payload.response.body,
    };
  },
  [getPartnerActionTypes.SUCCESS]: (state, action) => {
    return {
      ...state,
      partnerGetSuccess: action.payload,
      partnerGetStart: false,
    };
  },


  [verificationPartnerActionTypes.START]: (state) => {
    return {
      ...state,
      partnerVerificationStart: true,
    };
  },
  [verificationPartnerActionTypes.ERROR]: (state, action) => {
    return {
      ...state,
      partnerVerificationStart: false,
      partnerVerificationError: action.payload.response.body,
    };
  },
  [verificationPartnerActionTypes.SUCCESS]: (state, action) => {
    return {
      ...state,
      partnerVerificationSuccess: action.payload,
      partnerVerificationStart: false,
    };
  },


   [passChangePartnerActionTypes.START]: (state) => {
    return {
      ...state,
      partnerPassChangeStart: true,
    };
  },
  [passChangePartnerActionTypes.ERROR]: (state, action) => {
    return {
      ...state,
      partnerPassChangeStart: false,
      partnerPassChangeError: action.payload.response.body,
    };
  },
  [passChangePartnerActionTypes.SUCCESS]: (state, action) => {
    return {
      ...state,
      partnerPassChangeSuccess: action.payload,
      partnerPassChangeStart: false,
    };
  },

  [passChangeRequestPartnerActionTypes.START]: (state) => {
    return {
      ...state,
      partnerPassChangeRequestStart: true,
    };
  },
  [passChangeRequestPartnerActionTypes.ERROR]: (state, action) => {
    return {
      ...state,
      partnerPassChangeRequestStart: false,
      partnerPassChangeRequestError: action.payload.response.body,
    };
  },
  [passChangeRequestPartnerActionTypes.SUCCESS]: (state, action) => {
    return {
      ...state,
      partnerPassChangeRequestSuccess: action.payload,
      partnerPassChangeRequestStart: false,
    };
  },
};

export default function reducer(state: object = initialState, action: any = {}) {
	let fn = null;
	action.type ? fn = actionsMap[action.type] : null;
  	return fn ? fn(state, action) : state;
}
