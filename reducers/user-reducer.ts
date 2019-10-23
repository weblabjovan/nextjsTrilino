import {
  userDeviceActionTypes, testingApiActionTypes
} from '../actions/user-actions';

interface initialState {
	isMobile: boolean;
	language: string;
  testingStart: boolean;
  testingError: boolean;
  testingSuccess: object;
}

const initialState: initialState  = {
  isMobile: false,
  language: 'sr',

  testingStart: false,
  testingError: false,
  testingSuccess: {},
};

const actionsMap = {

  [userDeviceActionTypes.SUCCESS]: (state, action) => {
    return {
      ...state,
      isMobile: action.payload,
    };
  },

  [testingApiActionTypes.START]: (state) => {
    return {
      ...state,
      testingStart: true,
    };
  },
  [testingApiActionTypes.ERROR]: (state, action) => {
    return {
      ...state,
      testingStart: false,
      testingError: true,
    };
  },
  [testingApiActionTypes.SUCCESS]: (state, action) => {
    return {
      ...state,
      testingSuccess: action.payload,
      testingStart: false,
    };
  },
};

export default function reducer(state: object = initialState, action: any = {}) {
	let fn = null;
	action.type ? fn = actionsMap[action.type] : null;
  	return fn ? fn(state, action) : state;
}
