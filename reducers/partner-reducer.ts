import {
  registratePartnerActionTypes, getPartnerActionTypes, verificationPartnerActionTypes, passChangePartnerActionTypes, changeSingleFieldActionType, loginPartnerActionTypes, passChangeRequestPartnerActionTypes, updateGeneralPartnerActionTypes, getPartnerProfileActionTypes,
} from '../actions/partner-actions';
import { IpartnerRoomItem, IpartnerGeneral } from '../lib/constants/interfaces';
import { setUpGeneralRoomsForFront, setUpMainGeneralState } from '../lib/helpers/specificPartnerFunctions';


interface initialState {

  partner: null | object;

  partnerRegStart: boolean;
  partnerRegError: object | boolean;
  partnerRegSuccess: null | object;

  partnerLoginStart: boolean;
  partnerLoginError: object | boolean;
  partnerLoginSuccess: null | object;

  partnerGetStart: boolean;
  partnerGetError: object | boolean;

  partnerVerificationStart: boolean;
  partnerVerificationError: object | boolean;
  partnerVerificationSuccess: null | object;

  partnerPassChangeStart: boolean;
  partnerPassChangeError: object | boolean;
  partnerPassChangeSuccess: null | object;

  partnerPassChangeRequestStart: boolean;
  partnerPassChangeRequestError: object | boolean;
  partnerPassChangeRequestSuccess: null | object;

  updateActionGeneralStart: boolean;
  updateActionGeneralError: object | boolean;
  updateActionGeneralSuccess: null | number;

  partnerGeneral: IpartnerGeneral;

  partnerRooms: Array<IpartnerRoomItem>;

  
}

const initialState: initialState  = {

  partner: null,

  partnerRegStart: false,
  partnerRegError: {},
  partnerRegSuccess: null,

  partnerLoginStart: false,
  partnerLoginError: false,
  partnerLoginSuccess: null,

  partnerGetStart: false,
  partnerGetError: false,

  partnerVerificationStart: false,
  partnerVerificationError: false,
  partnerVerificationSuccess: null,

  partnerPassChangeStart: false,
  partnerPassChangeError: false,
  partnerPassChangeSuccess: null,

  partnerPassChangeRequestStart: false,
  partnerPassChangeRequestError: false,
  partnerPassChangeRequestSuccess: null,

  updateActionGeneralStart: false,
  updateActionGeneralError: false,
  updateActionGeneralSuccess: null,

  partnerGeneral: {
    size: null,
    playSize: null,
    description: '',
    address: '',
    spaceType: '',
    ageFrom: '',
    ageTo: '',
    mondayFrom: '',
    mondayTo: '',
    tuesdayFrom: '',
    tuesdayTo: '',
    wednesdayFrom: '',
    wednesdayTo: '',
    thursdayFrom: '',
    thursdayTo: '',
    fridayFrom: '',
    fridayTo: '',
    saturdayFrom: '',
    saturdayTo: '',
    sundayFrom: '',
    sundayTo: '',
    parking: '',
    yard: '',
    balcon: '',
    pool: '',
    wifi: '',
    animator: '',
    food: '',
    drink: '',
    cake: '',
    selfFood: '',
    selfDrink: '',
    selfCake: '',
    smoking: '',
    selfAnimator: '',
    duration: '',
    cancelation: '',
    roomNumber: '',
  },

  partnerRooms: [
    {
      name: '', 
      size: null,
      capKids: null,
      capAdults: null,
      terms:{
        monday:[
          {from: '', to: '', price: null },
        ],
        tuesday:[
          {from: '', to: '', price: null },
        ],
        wednesday:[
          {from: '', to: '', price: null },
        ],
        thursday:[
          {from: '', to: '', price: null },
        ],
        friday:[
          {from: '', to: '', price: null },
        ],
        saturday:[
          {from: '', to: '', price: null },
        ],
        sunday:[
          {from: '', to: '', price: null },
        ],
      }
    }
  ]

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


  [getPartnerProfileActionTypes.START]: (state) => {
    return {
      ...state,
      partnerGetStart: true,
    };
  },
  [getPartnerProfileActionTypes.ERROR]: (state, action) => {
    return {
      ...state,
      partnerGetStart: false,
      partnerGetError: action.payload.response.body,
    };
  },
  [getPartnerProfileActionTypes.SUCCESS]: (state, action) => {
    const lang = action.payload['partner']['userlanguage'] ? action.payload['partner']['userlanguage'] : 'sr';
    return {
      ...state,
      partnerRooms: setUpGeneralRoomsForFront(action.payload['partner']['general']['rooms']),
      partnerGeneral: setUpMainGeneralState(null, action.payload['partner']['general'], lang),
      partner: action.payload['partner'],
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

  [updateGeneralPartnerActionTypes.START]: (state) => {
    return {
      ...state,
      updateActionGeneralStart: true,
    };
  },
  [updateGeneralPartnerActionTypes.ERROR]: (state, action) => {
    return {
      ...state,
      updateActionGeneralStart: false,
      updateActionGeneralError: action.payload.response.body,
    };
  },
  [updateGeneralPartnerActionTypes.SUCCESS]: (state, action) => {
    return {
      ...state,
      updateActionGeneralSuccess: action.payload.code,
      partner: action.payload.partner,
      updateActionGeneralStart: false,
    };
  },
};

export default function reducer(state: object = initialState, action: any = {}) {
	let fn = null;
	action.type ? fn = actionsMap[action.type] : null;
  	return fn ? fn(state, action) : state;
}
