import {
  adminLoginActionTypes, adminGetPartnersActionTypes, activatePartnerActionTypes, preSignPhotoActionTypes, putPartnerProfilePhotoActionTypes, adminSavePartnerPhotoActionTypes, adminDeletePartnerPhotoActionTypes, adminBasicDevLoginActionTypes
} from '../actions/admin-actions';

import { decoratePartners, changePartnerListItem } from '../lib/helpers/specificAdminFunctions';

interface initialState {
	adminLoginStart: boolean;
  adminLoginError: object | boolean;
  adminLoginSuccess: null | object;

  adminGetPartnersStart: boolean;
  adminGetPartnersError: object | boolean;
  adminGetPartnersSuccess: null | number;

  adminActivatePartnerStart: boolean;
  adminActivatePartnerError: object | boolean;
  adminActivatePartnerSuccess: null | number;

  adminPhotoPresignStart: boolean;
  adminPhotoPresignError: object | boolean;
  adminPhotoPresignSuccess: null | number;

  adminPutPartnerPhotoStart: boolean;
  adminPutPartnerPhotoError: object | boolean;
  adminPutPartnerPhotoSuccess: null | object;

  adminSavePartnerPhotoStart: boolean;
  adminSavePartnerPhotoError: object | boolean;
  adminSavePartnerPhotoSuccess: null | number;

  adminDeletePartnerPhotoStart: boolean;
  adminDeletePartnerPhotoError: object | boolean;
  adminDeletePartnerPhotoSuccess: null | number;

  adminBasicDevLoginStart: boolean;
  adminBasicDevLoginError: object | boolean;
  adminBasicDevLoginSuccess: null | number;

  partners: Array<object>;
  partnerPhoto: null | object;
  devAuth: string;
}

const initialState: initialState  = {
  adminLoginStart: false,
  adminLoginError: false,
  adminLoginSuccess: null,

  adminGetPartnersStart: false,
  adminGetPartnersError: false,
  adminGetPartnersSuccess: null,

  adminActivatePartnerStart: false,
  adminActivatePartnerError: false,
  adminActivatePartnerSuccess: null,

  adminPhotoPresignStart: false,
  adminPhotoPresignError: false,
  adminPhotoPresignSuccess: null,

  adminPutPartnerPhotoStart: false,
  adminPutPartnerPhotoError: false,
  adminPutPartnerPhotoSuccess: null,

  adminSavePartnerPhotoStart: false,
  adminSavePartnerPhotoError: false,
  adminSavePartnerPhotoSuccess: null,

  adminDeletePartnerPhotoStart: false,
  adminDeletePartnerPhotoError: false,
  adminDeletePartnerPhotoSuccess: null,

  adminBasicDevLoginStart: false,
  adminBasicDevLoginError: false,
  adminBasicDevLoginSuccess: null,

  partners: [],
  partnerPhoto: null,
  devAuth: '',

};

const actionsMap = {

  [adminLoginActionTypes.START]: (state) => {
    return {
      ...state,
      adminLoginStart: true,
      adminLoginSuccess: null,
      adminLoginError: false,
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

  [adminGetPartnersActionTypes.START]: (state) => {
    return {
      ...state,
      adminGetPartnersStart: true,
    };
  },
  [adminGetPartnersActionTypes.ERROR]: (state, action) => {
    return {
      ...state,
      adminGetPartnersStart: false,
      adminGetPartnersError: action.payload.response.body,
    };
  },
  [adminGetPartnersActionTypes.SUCCESS]: (state, action) => {
    return {
      ...state,
      adminGetPartnersSuccess: action.payload.code,
      partners: decoratePartners(action.payload.partners),
      adminGetPartnersStart: false,
    };
  },

  [activatePartnerActionTypes.START]: (state) => {
    return {
      ...state,
      adminActivatePartnerStart: true,
      adminActivatePartnerSuccess: null,
    };
  },
  [activatePartnerActionTypes.ERROR]: (state, action) => {
    return {
      ...state,
      adminActivatePartnerStart: false,
      adminActivatePartnerError: action.payload.response.body,
    };
  },
  [activatePartnerActionTypes.SUCCESS]: (state, action) => {
    return {
      ...state,
      adminActivatePartnerSuccess: action.payload.code,
      partners: changePartnerListItem(action.payload.partner, [...state['partners']]),
      adminActivatePartnerStart: false,
    };
  },

  [preSignPhotoActionTypes.START]: (state) => {
    return {
      ...state,
      adminPhotoPresignStart: true,
      adminPhotoPresignSuccess: null,
    };
  },
  [preSignPhotoActionTypes.ERROR]: (state, action) => {
    return {
      ...state,
      adminPhotoPresignStart: false,
      adminPhotoPresignError: action.payload.response.body,
    };
  },
  [preSignPhotoActionTypes.SUCCESS]: (state, action) => {
    return {
      ...state,
      adminPhotoPresignSuccess: action.payload.code,
      partnerPhoto: action.payload.data,
      adminPhotoPresignStart: false,
    };
  },

  [putPartnerProfilePhotoActionTypes.START]: (state) => {
    return {
      ...state,
      adminPutPartnerPhotoStart: true,
      adminPutPartnerPhotoSuccess: null,
    };
  },
  [putPartnerProfilePhotoActionTypes.ERROR]: (state, action) => {
    return {
      ...state,
      adminPutPartnerPhotoStart: false,
      adminPutPartnerPhotoError: action.payload,
    };
  },
  [putPartnerProfilePhotoActionTypes.SUCCESS]: (state, action) => {
    return {
      ...state,
      adminPutPartnerPhotoSuccess: action.payload,
      adminPutPartnerPhotoStart: false,
    };
  },

  [adminSavePartnerPhotoActionTypes.START]: (state) => {
    return {
      ...state,
      adminSavePartnerPhotoStart: true,
      adminSavePartnerPhotoSuccess: null,
    };
  },
  [adminSavePartnerPhotoActionTypes.ERROR]: (state, action) => {
    return {
      ...state,
      adminSavePartnerPhotoStart: false,
      partnerPhoto: null,
      adminSavePartnerPhotoError: action.payload.response.body,
    };
  },
  [adminSavePartnerPhotoActionTypes.SUCCESS]: (state, action) => {
    return {
      ...state,
      adminSavePartnerPhotoSuccess: action.payload.code,
      partners: changePartnerListItem(action.payload.partner, [...state['partners']]),
      partnerPhoto: null,
      adminSavePartnerPhotoStart: false,
    };
  },

  [adminDeletePartnerPhotoActionTypes.START]: (state) => {
    return {
      ...state,
      adminDeletePartnerPhotoStart: true,
      adminDeletePartnerPhotoSuccess: null,
    };
  },
  [adminDeletePartnerPhotoActionTypes.ERROR]: (state, action) => {
    return {
      ...state,
      adminDeletePartnerPhotoStart: false,
      adminDeletePartnerPhotoError: action.payload.response.body,
    };
  },
  [adminDeletePartnerPhotoActionTypes.SUCCESS]: (state, action) => {
    return {
      ...state,
      adminDeletePartnerPhotoSuccess: action.payload.code,
      partners: changePartnerListItem(action.payload.partner, [...state['partners']]),
      adminDeletePartnerPhotoStart: false,
    };
  },

  [adminBasicDevLoginActionTypes.START]: (state) => {
    return {
      ...state,
      adminBasicDevLoginStart: true,
      adminBasicDevLoginError: false,
      adminBasicDevLoginSuccess: null,
    };
  },
  [adminBasicDevLoginActionTypes.ERROR]: (state, action) => {
    return {
      ...state,
      adminBasicDevLoginStart: false,
      adminBasicDevLoginError: action.payload.response.body,
    };
  },
  [adminBasicDevLoginActionTypes.SUCCESS]: (state, action) => {
    return {
      ...state,
      adminBasicDevLoginSuccess: action.payload.code,
      devAuth: action.payload['token'],
      adminBasicDevLoginStart: false,
    };
  },
  
};

export default function reducer(state: object = initialState, action: any = {}) {
	let fn = null;
	action.type ? fn = actionsMap[action.type] : null;
  	return fn ? fn(state, action) : state;
}
