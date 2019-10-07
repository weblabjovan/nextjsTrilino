import {
  userDeviceActionTypes
} from '../actions/user-actions';

interface initialState {
	isMobile: boolean;
	language: string;
}

const initialState: initialState  = {
  isMobile: false,
  language: 'sr',
};

const actionsMap = {

  [userDeviceActionTypes.SUCCESS]: (state, action) => {
    return {
      ...state,
      isMobile: action.payload,
    };
  },
};

export default function reducer(state: object = initialState, action: any = {}) {
	let fn = null;
	action.type ? fn = actionsMap[action.type] : null;
  	return fn ? fn(state, action) : state;
}
