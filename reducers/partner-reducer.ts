import {
  registratePartnerActionTypes, getPartnerActionTypes, verificationPartnerActionTypes, passChangePartnerActionTypes, changeSingleFieldActionType, loginPartnerActionTypes, passChangeRequestPartnerActionTypes, updateGeneralPartnerActionTypes, getPartnerProfileActionTypes, updateOfferPartnerActionTypes, updateCateringPartnerActionTypes, updateDecorationgPartnerActionTypes, getReservationTermsActionTypes, saveReservationActionTypes, getReservationsActionTypes, getPartnersMultipleActionTypes
} from '../actions/partner-actions';
import { IpartnerRoomItem, IpartnerGeneral, IpartnerCatering, IpartnerDecoration, IpartnerReservation } from '../lib/constants/interfaces';
import { setUpGeneralRoomsForFront, setUpMainGeneralState, setArrayWithLabelAndValue, setUpMainCateringState, buildPartnerDecorationObject, generateString, createReservationTermsArray, formatReservations, calculateActivationProcess} from '../lib/helpers/specificPartnerFunctions';


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

  updateActionOfferStart: boolean;
  updateActionOfferError: object | boolean;
  updateActionOfferSuccess: null | number;

  updateActionCateringStart: boolean;
  updateActionCateringError: object | boolean;
  updateActionCateringSuccess: null | number;

  updateActionDecorationStart: boolean;
  updateActionDecorationError: object | boolean;
  updateActionDecorationSuccess: null | number;

  getPartnerRoomTermsStart: boolean;
  getPartnerRoomTermsError: object | boolean;
  getPartnerRoomTermsSuccess: null | number;

  savePartnerReservationStart: boolean;
  savePartnerReservationError: object | boolean;
  savePartnerReservationSuccess: null | object;

  getPartnerReservationsStart: boolean;
  getPartnerReservationsError: boolean;
  getPartnerReservationsSuccess: null | number;

  getPartnersMultipleStart: boolean;
  getPartnersMultipleError: object | boolean;
  getPartnersMultipleSuccess: null | number;

  forActivation: boolean;
  activationAlert: boolean;
  activationProcessPercent: number;

  partnerGeneral: IpartnerGeneral;

  partnerRooms: Array<IpartnerRoomItem>;

  partnerOffer: Array<object>;

  partnerAddon: Array<object>;

  partnerCatering: object;

  partnerDecoration: IpartnerDecoration;

  partnerReservation: IpartnerReservation;

  partnerReservationsList: Array<object>;

  searchResults: Array<object>;
  
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

  updateActionOfferStart: false,
  updateActionOfferError: false,
  updateActionOfferSuccess: null,

  updateActionCateringStart: false,
  updateActionCateringError: false,
  updateActionCateringSuccess: null,

  updateActionDecorationStart: false,
  updateActionDecorationError: false,
  updateActionDecorationSuccess: null,

  getPartnerRoomTermsStart: false,
  getPartnerRoomTermsError: false,
  getPartnerRoomTermsSuccess: null,

  savePartnerReservationStart: false,
  savePartnerReservationError: false,
  savePartnerReservationSuccess: null,

  getPartnerReservationsStart: false,
  getPartnerReservationsError: false,
  getPartnerReservationsSuccess: null,

  getPartnersMultipleStart: false,
  getPartnersMultipleError: false,
  getPartnersMultipleSuccess: null,

  forActivation: false,
  activationAlert: true,
  activationProcessPercent: 20,

  partnerGeneral: {
    size: null,
    playSize: null,
    description: '',
    address: '',
    spaceType: '',
    quarter: '',
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
    movie: '',
    gaming: '',
    food: '',
    drink: '',
    selfFood: '',
    selfDrink: '',
    smoking: '',
    selfAnimator: '',
    duration: '',
    cancelation: '',
    roomNumber: '',
    depositPercent: '',
    despositNumber: '',
    doubleDiscount: '',
  },

  partnerRooms: [
    {
      name: '',
      regId: generateString(12), 
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
  ],

  partnerOffer: [

  ],

  partnerAddon: [

  ],

  partnerCatering: {
    drinkCard:[],
    deals: [
      { type: '', price: '', min: null, items: [], currentItem: ''},
    ],
  },

  partnerDecoration: {
    '1': {check: false, name_sr: 'baloni', name_en: 'balloons', value: 1, price: '' },
    '2': {check: false, name_sr: 'konfete', name_en: 'confetti', value: 2, price: '' },
    '3': {check: false, name_sr: 'prskalice', name_en: 'spargers', value: 3, price: '' },
    '4': {check: false, name_sr: 'trake', name_en: 'bands', value: 4, price: '' },
  },

  partnerReservation: {
    partner: '',
    type: 'partner',
    room: 0,
    date: new Date(),
    term: '',
    options: [],
    terms: [],
    from: '',
    to: '',
    double: false,
    user: '',
    userName: '',
    guest: '',
    food: {},
    animation: {},
    decoration: {},
    comment: '',
    edit: true,
    id: '',
    showPrice: false,
    termPrice: 0,
    animationPrice: 0,
    decorationPrice: 0,
    foodPrice: 0,
    price: 0,
    deposit: 0,
  },

  partnerReservationsList: [],

  searchResults: [],

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
      partnerRooms: setUpGeneralRoomsForFront(action.payload['partner']),
      partnerGeneral: setUpMainGeneralState(null, action.payload['partner'], lang),
      partnerOffer: setArrayWithLabelAndValue(`contentOffer_${lang}`, action.payload['partner']),
      partnerAddon: action.payload['partner']['contentAddon'] ? action.payload['partner']['contentAddon'] : [],
      partnerCatering: setUpMainCateringState(action.payload['partner'], lang),
      partnerDecoration: buildPartnerDecorationObject(action.payload['partner']),
      partner: action.payload['partner'],
      forActivation: action.payload.partner['forActivation'],
      activationAlert: action.payload.partner['forActivation'] ? false : true,
      activationProcessPercent: calculateActivationProcess(action.payload.partner),
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
      forActivation: action.payload.partner['forActivation'],
      activationAlert: action.payload.partner['forActivation'] ? false : true,
      activationProcessPercent: calculateActivationProcess(action.payload.partner),
      updateActionGeneralStart: false,
    };
  },

  [updateOfferPartnerActionTypes.START]: (state) => {
    return {
      ...state,
      updateActionOfferStart: true,
    };
  },
  [updateOfferPartnerActionTypes.ERROR]: (state, action) => {
    return {
      ...state,
      updateActionOfferStart: false,
      updateActionOfferError: action.payload.response.body,
    };
  },
  [updateOfferPartnerActionTypes.SUCCESS]: (state, action) => {
    return {
      ...state,
      updateActionOfferSuccess: action.payload.code,
      partner: action.payload.partner,
      forActivation: action.payload.partner['forActivation'],
      activationAlert: action.payload.partner['forActivation'] ? false : true,
      activationProcessPercent: calculateActivationProcess(action.payload.partner),
      updateActionOfferStart: false,
    };
  },

  [updateCateringPartnerActionTypes.START]: (state) => {
    return {
      ...state,
      updateActionCateringStart: true,
    };
  },
  [updateCateringPartnerActionTypes.ERROR]: (state, action) => {
    return {
      ...state,
      updateActionCateringStart: false,
      updateActionCateringError: action.payload.response.body,
    };
  },
  [updateCateringPartnerActionTypes.SUCCESS]: (state, action) => {
    return {
      ...state,
      updateActionCateringSuccess: action.payload.code,
      partner: action.payload.partner,
      forActivation: action.payload.partner['forActivation'],
      activationAlert: action.payload.partner['forActivation'] ? false : true,
      activationProcessPercent: calculateActivationProcess(action.payload.partner),
      updateActionCateringStart: false,
    };
  },

  [updateDecorationgPartnerActionTypes.START]: (state) => {
    return {
      ...state,
      updateActionDecorationStart: true,
    };
  },
  [updateDecorationgPartnerActionTypes.ERROR]: (state, action) => {
    return {
      ...state,
      updateActionDecorationStart: false,
      updateActionDecorationError: action.payload.response.body,
    };
  },
  [updateDecorationgPartnerActionTypes.SUCCESS]: (state, action) => {
    return {
      ...state,
      updateActionDecorationSuccess: action.payload.code,
      partner: action.payload.partner,
      updateActionDecorationStart: false,
    };
  },

  [getReservationTermsActionTypes.START]: (state) => {
    return {
      ...state,
      getPartnerRoomTermsStart: true,
      partnerReservation: {...state['partnerReservation'], 'terms': [], 'options': []},
    };
  },
  [getReservationTermsActionTypes.ERROR]: (state, action) => {
    return {
      ...state,
      getPartnerRoomTermsStart: false,
      getPartnerRoomTermsError: action.payload.response.body,
    };
  },
  [getReservationTermsActionTypes.SUCCESS]: (state, action) => {
    return {
      ...state,
      getPartnerRoomTermsSuccess: action.payload.code,
      partnerReservation: {...state['partnerReservation'], 'terms': action.payload.freeTerms, 'options': createReservationTermsArray(action.payload.freeTerms)},
      getPartnerRoomTermsStart: false,
    };
  },

  [saveReservationActionTypes.START]: (state) => {
    return {
      ...state,
      savePartnerReservationStart: true,
    };
  },
  [saveReservationActionTypes.ERROR]: (state, action) => {
    return {
      ...state,
      savePartnerReservationStart: false,
      savePartnerReservationError: action.payload.response.body,
    };
  },
  [saveReservationActionTypes.SUCCESS]: (state, action) => {
    return {
      ...state,
      savePartnerReservationSuccess: action.payload,
      savePartnerReservationStart: false,
    };
  },

  [getReservationsActionTypes.START]: (state) => {
    return {
      ...state,
      getPartnerReservationsStart: true,
    };
  },
  [getReservationsActionTypes.ERROR]: (state, action) => {
    return {
      ...state,
      getPartnerReservationsStart: false,
      getPartnerReservationsError: action.payload.response.body,
    };
  },
  [getReservationsActionTypes.SUCCESS]: (state, action) => {
    return {
      ...state,
      getPartnerReservationsSuccess: action.payload.code,
      partnerReservationsList: formatReservations(action.payload.reservations),
      getPartnerReservationsStart: false,
    };
  },

  [getPartnersMultipleActionTypes.START]: (state) => {
    return {
      ...state,
      getPartnersMultipleStart: true,
    };
  },
  [getPartnersMultipleActionTypes.ERROR]: (state, action) => {
    return {
      ...state,
      getPartnersMultipleStart: false,
      getPartnersMultipleError: action.payload.response.body,
    };
  },
  [getPartnersMultipleActionTypes.SUCCESS]: (state, action) => {
    return {
      ...state,
      getPartnersMultipleSuccess: action.payload.code,
      searchResults: action.payload.partners,
      getPartnersMultipleStart: false,
    };
  },

};

export default function reducer(state: object = initialState, action: any = {}) {
	let fn = null;
	action.type ? fn = actionsMap[action.type] : null;
  	return fn ? fn(state, action) : state;
}
