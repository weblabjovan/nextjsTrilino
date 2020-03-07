import {combineReducers} from 'redux';
import UserReducer from './user-reducer.ts';
import PartnerReducer from './partner-reducer.ts';
import ReservationReducer from './reservation-reducer.ts';
import AdminReducer from './admin-reducer.ts';

export default combineReducers({
	UserReducer,
	PartnerReducer,
	ReservationReducer,
	AdminReducer,
});
