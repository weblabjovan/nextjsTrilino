import { isMobile, apiEndpoint } from '../lib/helpers/generalFunctions';
import apiRoot  from '../lib/constants/api';


interface DispatchObj {
	type: string;
	payload?: any;
	meta?: any;
}
type dispatch = (obj: DispatchObj) => any;

export const userDeviceActionTypes = {
  SUCCESS: 'USER_DEVICE_ACTION_SUCCESS',
};

export function setUserDevice(userAgent: string) {

  return function (dispatch: dispatch) {
    dispatch({
      type: userDeviceActionTypes.SUCCESS,
      payload: isMobile(userAgent),
    });
  };
}

export const userLanguageActionTypes = {
  SUCCESS: 'USER_LANGUAGE_ACTION_SUCCESS',
};

export function setUserLanguage(language: string) {

  return function (dispatch: dispatch) {
    dispatch({
      type: userLanguageActionTypes.SUCCESS,
      payload: language,
    });
  };
}

export const testingApiActionTypes = {
  START: 'TESTING_API_START',
  ERROR: 'TESTING_API_ERROR',
  SUCCESS: 'TESTING_API_SUCCESS',
};

export function testingApi(brand:string, user:number) {

  return function (dispatch: dispatch) {
    apiEndpoint(
      dispatch,
      apiRoot.TEST,
      { brand, user },
      testingApiActionTypes
    );
  };
}