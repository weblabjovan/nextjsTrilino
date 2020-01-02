import { isEmail, isNumeric, isEmpty, isPib, isPhoneNumber, isInputValueMalicious } from '../../lib/helpers/validations';
import { addMinutesToString } from './general';

type partnerReg = {
	name: string;
	taxNum: number;
	city: string;
	contactPerson: string;
	contactEmail: string;
	contactPhone: string;

}

export const isPartnerRegDataValid = (data: partnerReg): boolean => {
	let validation = true;

	if (isEmpty(data.name) || isInputValueMalicious(data.name) || !isPib(data.taxNum, 'sr') || isEmpty(data.city) || isInputValueMalicious(data.city) || isEmpty(data.contactPerson) || isInputValueMalicious(data.contactPerson) || !isEmail(data.contactEmail) || !isPhoneNumber(data.contactPhone, 'sr')) {
		validation = false;
	}

	return validation;
}

export const isGeneralDataValid = (data: object): boolean => {
	for(let key in data){
		if (key === 'roomNumber' || key === 'size' || key === 'playSize' || key === 'depositPercent' || key === 'doubleDiscount') {
			if (typeof data[key] !== 'number') {
				return false;
			}
		}else if(key === 'rooms'){
			if (!isGeneralTermsValid(data['rooms'])) {
				return false;
			}
		}
		else{
			if (typeof data[key] !== 'string') {
				return false;
			}
		}
	}

	return true;
}

const isGeneralTermsValid = (rooms: Array<object>): boolean => {
	for (var i = 0; i < rooms.length; ++i) {
		const room = rooms[i];
		if (!isRoomDataValid(room)) {
			return false;
		}
		
		for(let key in room){
			if(!isDayTermsValid(room[key])){
				return false;
			}
		}
	}

	return true;
}

const isRoomDataValid = (room: object): boolean => {
	const numbers = ['size', 'capKids', 'capAdults'];

	for(let key in room){
		if (numbers.indexOf(key) !== -1) {
			if (typeof room[key] !== 'number') {
				return false;
			}
		}
		if (key === 'name') {
			if (typeof room[key] !== 'string') {
				return false;
			}
		}
	}

	return true;
}

const isDayTermsValid = (day: Array<object>): boolean => {
	for (var i = 0; i < day.length; ++i) {
		if (day[i]['price']) {
			if (typeof day[i]['price'] !== 'number') {
				return false;
			}
		}
		
	}

	return true;
}

export const isCateringDataValid = (data: object): boolean => {
	if (!data['deals'] || !data['drinkCard']) {
		return false;
	}else{
		if (!Array.isArray(data['deals']) || !Array.isArray(data['drinkCard'])) {
			return false;
		}else{
			for (var i = 0; i < data['deals'].length; ++i) {
				if (typeof data['deals'][i]['price'] !== 'number' || typeof data['deals'][i]['min'] !== 'number' || !isNumeric(data['deals'][i]['type'])) {
					return false;
				}
			}
		}
	}

	return true;
}

export const isDecorationDataValid = (data: object): boolean => {
	for(let key in data){
		if (!data[key].hasOwnProperty('price') || !data[key].hasOwnProperty('value')) {
			return false;
		}
	}

	return true;
}

export const isReservationSaveDataValid = (data: object): boolean => {
  if (!data['partner'] || !data['date'] || !data['room'] || !data['type'] || !data['from'] || !data['to']) {
    return false;
  }

  return true;
}

export const isReservationStillAvailable = (data: object, reservations: Array<object>): boolean => {

  if (!reservations.length) {
    return true;
  }

  for (var i = 0; i < reservations.length; ++i) {
  	if (data['double']) {
  		const doubleFrom = addMinutesToString(data['to'], 30);
		if (reservations[i]['from'] === data['from'] || reservations[i]['from'] === doubleFrom) {
	      return false;
	    }
  		
  	}else{
  		if (reservations[i]['from'] === data['from']) {
	      return false;
	    }
  	}
    
  }

  return true;
}