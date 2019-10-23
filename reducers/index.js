import {combineReducers} from 'redux';
import UserReducer from './user-reducer.ts';
import PartnerReducer from './partner-reducer.ts';

export default combineReducers({
	UserReducer,
	PartnerReducer
});
