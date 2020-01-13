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


export const isPartnerForActivation = (partnerObj: object): boolean => {
	if (!isGeneralFilled(partnerObj)) {
		return false;
	}

	if (!isRoomsFilled(partnerObj)) {
		return false;
	}

	if (!isFreeContentActive(partnerObj)) {
		return false;
	}

	if (partnerObj['general']) {
		if (partnerObj['general']['drink']) {
			if (!isDrinkCardActive(partnerObj)) {
				return false;
			}
		}else{
			if (!partnerObj['general']['selfDrink']) {
				return false;
			}
		}

		if (partnerObj['general']['food']) {
			if (!isCateringDealPresent(partnerObj)) {
				return false;
			}
		}else{
			if (!partnerObj['general']['selfFood']) {
				return false;
			}
		}
	}

	return true;
}

const isGeneralFilled = (partner: object): boolean => {
	const requiredGeneral = ['size', 'playSize', 'description', 'address', 'ageFrom', 'ageTo', 'mondayFrom', 'mondayTo', 'tuesdayFrom', 'tuesdayTo', 'wednesdayFrom', 'wednesdayTo', 'thursdayFrom', 'thursdayTo', 'fridayFrom', 'fridayTo', 'saturdayFrom', 'saturdayTo', 'sundayFrom', 'sundayTo', 'parking', 'yard', 'balcon', 'pool', 'wifi', 'animator', 'food', 'drink', 'selfFood', 'selfDrink', 'duration', 'cancelation', 'roomNumber', 'selfAnimator', 'smoking', 'spaceType', 'movie', 'gaming', 'quarter', 'depositPercent', 'despositNumber', 'doubleDiscount'];

	if (!partner['general']) {
		return false;
	}

	const obj = partner['general'];

	for (var i = 0; i < requiredGeneral.length; ++i) {
		if (!obj[requiredGeneral[i]] || isEmpty(obj[requiredGeneral[i]])) {
			return false
		}
	}

	return true;
}

const isRoomsFilled = (partner: object): boolean => {
	if (partner['general']) {
		if (partner['general']['rooms']) {
			if (Array.isArray(partner['general']['rooms'])) {
				if (partner['general']['rooms'].length) {
					let num = 0;
					for (var i = 0; i < partner['general']['rooms'].length; ++i) {
						num = num + getNumberOfFilledTerms(partner['general']['rooms'][i]['terms']);
					}

					if (num > 3) {
						return true;
					}
				}
			}
		}
	}

	return false;
}

const getNumberOfFilledTerms = (terms: object): number => {
	let num = 0;

	for(let day in terms){
		if (terms[day][0]['from']) {
			for (var i = 0; i < terms[day].length; ++i) {
				if (terms[day][i]['from']) {
					num = num + 1;
				}
			}
		}
	}

	return num;
}

const isDrinkCardActive = (partner: object): boolean => {
	if (partner['catering']) {
		if (partner['catering']['drinkCard']) {
			if (Array.isArray(partner['catering']['drinkCard'])) {
				if (partner['catering']['drinkCard'].length) {
					if (partner['catering']['drinkCard'].length > 5) {
						return true;
					}
				}
			}
		}
	}

	return false;
}

const isCateringDealPresent = (partner: object): boolean => {
	if (partner['catering']) {
		if (partner['catering']['deals']) {
			if (Array.isArray(partner['catering']['deals'])) {
				if (partner['catering']['deals'].length) {
					for (var i = 0; i < partner['catering']['deals'].length; ++i) {
							if (!partner['catering']['deals'][i]['type'] || !partner['catering']['deals'][i]['min'] || !partner['catering']['deals'][i]['price'] || !partner['catering']['deals'][i]['regId'] || partner['catering']['deals'][i]['items'].length < 5) {
							return false;
						}
					}
					return true;
				}
			}
		}
	}

	return false;
}

const isFreeContentActive = (partner: object): boolean => {
	if (partner['contentOffer']) {
		if (Array.isArray(partner['contentOffer'])) {
			if (partner['contentOffer'].length) {
				if (partner['contentOffer'].length > 3) {
					return true;
				}
			}
		}
	}

	return false;
}

export const isPartnerPhotoSaveDataValid = (data: object): boolean => {
	if (!data['partnerId'] || !data['photos']) {
		return false;
	}else{
		if (!Array.isArray(data['photos']) || typeof data['partnerId'] !== 'string') {
			return false;
		}
	}

	return true;
}