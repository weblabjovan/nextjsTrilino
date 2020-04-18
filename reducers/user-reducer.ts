import {
  userDeviceActionTypes, userLanguageActionTypes, changeSingleFieldActionType, registrateUserActionTypes, passChangeUserActionTypes, loginUserActionTypes, passChangeRequestUserActionTypes, saveReservationUserActionTypes, errorHandlerActions
} from '../actions/user-actions';

interface initialState {
	isMobile: boolean;
	language: string;
  globalError: boolean;

  userRegistrateStart: boolean;
  userRegistrateError: boolean | object;
  userRegistrateSuccess: null | object;

  userPassChangeStart: boolean;
  userPassChangeError: boolean | object;
  userPassChangeSuccess: null | object;

  userLoginStart: boolean;
  userLoginError: boolean | object;
  userLoginSuccess: null | object;

  userPassChangeReqStart: boolean;
  userPassChangeReqError: boolean | object;
  userPassChangeReqSuccess: null | number;

  userSaveReservationStart: boolean;
  userSaveReservationError: boolean | object;
  userSaveReservationSuccess: null | object;

  activeUser: null | object;
}

const initialState: initialState  = {
  isMobile: false,
  language: 'sr',
  globalError: false,

  userRegistrateStart: false,
  userRegistrateError: false,
  userRegistrateSuccess: null,

  userPassChangeStart: false,
  userPassChangeError: false,
  userPassChangeSuccess: null,

  userLoginStart: false,
  userLoginError: false,
  userLoginSuccess: null,

  userPassChangeReqStart: false,
  userPassChangeReqError: false,
  userPassChangeReqSuccess: null,

  userSaveReservationStart: false,
  userSaveReservationError: false,
  userSaveReservationSuccess: null,

  activeUser: null,

};

const actionsMap = {

  [changeSingleFieldActionType.SUCCESS]: (state, action) => {
    if (action.meta.source === 'user') {
      return {
        ...state,
        [action.meta.field]: action.payload,
      };
    }
  },

  [userDeviceActionTypes.SUCCESS]: (state, action) => {
    return {
      ...state,
      isMobile: action.payload,
    };
  },

  [userLanguageActionTypes.SUCCESS]: (state, action) => {
    return {
      ...state,
      language: action.payload,
    };
  },

  [errorHandlerActions.ERROR]: (state, action) => {
    return {
      ...state,
      globalError: action.payload,
    };
  },

  [registrateUserActionTypes.START]: (state) => {
    return {
      ...state,
      userRegistrateStart: true,
      userRegistrateSuccess: null,
      userRegistrateError: false,
    };
  },
  [registrateUserActionTypes.ERROR]: (state, action) => {
    return {
      ...state,
      userRegistrateStart: false,
      userRegistrateError: action.payload.response.body,
    };
  },
  [registrateUserActionTypes.SUCCESS]: (state, action) => {
    return {
      ...state,
      userRegistrateSuccess: action.payload,
      userRegistrateStart: false,
    };
  },

  [passChangeUserActionTypes.START]: (state) => {
    return {
      ...state,
      userPassChangeStart: true,
      userPassChangeSuccess: null,
      userPassChangeError: false,
    };
  },
  [passChangeUserActionTypes.ERROR]: (state, action) => {
    return {
      ...state,
      userPassChangeStart: false,
      userPassChangeError: action.payload.response.body,
    };
  },
  [passChangeUserActionTypes.SUCCESS]: (state, action) => {
    return {
      ...state,
      userPassChangeSuccess: action.payload,
      userPassChangeStart: false,
    };
  },

  [loginUserActionTypes.START]: (state) => {
    return {
      ...state,
      userLoginStart: true,
      userLoginSuccess: null,
      userLoginError: false,
    };
  },
  [loginUserActionTypes.ERROR]: (state, action) => {
    return {
      ...state,
      userLoginStart: false,
      userLoginError: action.payload.response.body,
    };
  },
  [loginUserActionTypes.SUCCESS]: (state, action) => {
    return {
      ...state,
      userLoginSuccess: action.payload,
      userLoginStart: false,
    };
  },

  [passChangeRequestUserActionTypes.START]: (state) => {
    return {
      ...state,
      userPassChangeReqStart: true,
      userPassChangeReqSuccess: null,
      userPassChangeReqError: false,
    };
  },
  [passChangeRequestUserActionTypes.ERROR]: (state, action) => {
    return {
      ...state,
      userPassChangeReqStart: false,
      userPassChangeReqError: action.payload.response.body,
    };
  },
  [passChangeRequestUserActionTypes.SUCCESS]: (state, action) => {
    return {
      ...state,
      userPassChangeReqSuccess: action.payload,
      userPassChangeReqStart: false,
    };
  },

  [saveReservationUserActionTypes.START]: (state) => {
    return {
      ...state,
      userSaveReservationStart: true,
      userSaveReservationSuccess: null,
      userSaveReservationError: false,
    };
  },
  [saveReservationUserActionTypes.ERROR]: (state, action) => {
    return {
      ...state,
      userSaveReservationStart: false,
      userSaveReservationError: action.payload.response.body,
    };
  },
  [saveReservationUserActionTypes.SUCCESS]: (state, action) => {
    return {
      ...state,
      userSaveReservationSuccess: action.payload.reservation,
      userSaveReservationStart: false,
    };
  },

};

export default function reducer(state: object = initialState, action: any = {}) {
	let fn = null;
	action.type ? fn = actionsMap[action.type] : null;
  	return fn ? fn(state, action) : state;
}
