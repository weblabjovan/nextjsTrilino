import { isEmail, isNumeric, isEmpty, isPib, isPhoneNumber, isInputValueMalicious } from '../../lib/helpers/validations';
import DateHandler from '../../lib/classes/DateHandler';
import { addMinutesToString } from './general';
import Keys from '../keys';

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
			if (key === 'capacity') {
				// code...
			}else{
				if (typeof data[key] !== 'string') {
					return false;
				}
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
		if (partnerObj['general']['drink'] === '1') {
			if (!isDrinkCardActive(partnerObj)) {
				return false;
			}
		}else{
			if (!partnerObj['general']['selfDrink']) {
				return false;
			}
		}

		if (partnerObj['general']['food'] === '1') {
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
	const requiredGeneral = ['size', 'playSize', 'description', 'address', 'ageFrom', 'ageTo', 'mondayFrom', 'mondayTo', 'tuesdayFrom', 'tuesdayTo', 'wednesdayFrom', 'wednesdayTo', 'thursdayFrom', 'thursdayTo', 'fridayFrom', 'fridayTo', 'saturdayFrom', 'saturdayTo', 'sundayFrom', 'sundayTo', 'parking', 'yard', 'balcon', 'pool', 'wifi', 'animator', 'food', 'drink', 'selfFood', 'selfDrink', 'duration', 'cancelation', 'roomNumber', 'selfAnimator', 'smoking', 'spaceType', 'movie', 'gaming', 'depositPercent', 'despositNumber', 'doubleDiscount'];

	if (!partner['general']) {
		return false;
	}

	if (partner['district'] === '0') {
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
							if (!partner['catering']['deals'][i]['type'] || !partner['catering']['deals'][i]['min'] || !partner['catering']['deals'][i]['price'] || !partner['catering']['deals'][i]['regId'] || partner['catering']['deals'][i]['items'].length < 1) {
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

export const dataHasValidProperty = (data: object, property: Array<string>): boolean => {
	for (var i = 0; i < property.length; ++i) {
		if (!data.hasOwnProperty(property[i])) {
			return false;
		}
	}

	return true;
}

export const isReservationPartnerDataValid = (data: object): boolean => {
	if (!data['partner'] || data['partner'] === 'undefined' || !data['language'] || data['language'] === 'undefined' || !data['date'] || data['date'] === 'undefined' || !data['room'] || data['room'] === 'undefined' || !data['from'] || data['from'] === 'undefined' || !data['to'] || data['to'] === 'undefined' || !data['type'] || data['type'] === 'undefined') {
		return false;
	}

	const dateHandler = new DateHandler(data['date']);

	if (!dateHandler.isUrlDateValidDateString()) {
		return false;
	}

	return true;
}

export const isGetMultiplePartnersDataValid = (data: object): boolean => {
	if (!data['date'] || data['date'] === 'undefined') {
		return false;
	}

	if (parseInt(data['city']) === NaN || parseInt(data['district']) === NaN ) {
		return false;
	}

	const dateHandler = new DateHandler(data['date']);

	if (!dateHandler.isUrlDateValidDateString()) {
		return false;
	}

	return true;
}

export const isGetSinglePartnerDataValid = (data: object): boolean => {
	if (!data['partner'] || data['partner'] === 'undefined' || !data['language'] || data['language'] === 'undefined' || !data['date'] || data['date'] === 'undefined') {
		return false;
	}

	const dateHandler = new DateHandler(data['date']);

	if (!dateHandler.isUrlDateValidDateString()) {
		return false;
	}

	return true;
}

export const isReservationAlreadyMade = (reservations: Array<object>, from: string | string[], to: string | string[]): boolean => {
	for (var i = 0; i < reservations.length; ++i) {
		if (reservations[i]['from'] == from && reservations[i]['to'] == to) {
			return true;
		}
	}

	return false;
}

export const isPartnerMapSaveDataValid = (data: object): boolean => {
	if (!data['partnerId'] || !data['map']) {
		return false;
	}else{
		if (!data['map']['lat'] || !data['map']['lng'] || typeof data['partnerId'] !== 'string') {
			return false;
		}
	}

	return true;
}

export const isUserRegDataValid = (data: object): boolean => {
	if (!data['firstName'] || !data['lastName'] || !isEmail(data['email']) || !isPhoneNumber(data['phone'], data['language']) || !data['terms'] || data[''] || !data['phoneCode'] ) {
		return false;
	}

	return true;
}

export const isReservationConfirmDataValid = (data: object): boolean => {
	if (!data['payment'] || !data['transId'] || !data['id'] || !data['language'] || !data['transDate'] || !data['transProc'] || !data['transMd']) {
		return false;
	}

	if (data['confirm']) {
		if (!data['transAuth']) {
			return false;
		}
	}

	return true;
}

export const isPaymentResponseValid = (response: object, id: string, req: object, type: string): boolean => {
  if (Object.keys(response).length) {
    const outcome = response['Response'];
    const resId = type === 'catering' ? `cat-${id}` : id;
    
    if (response['ReturnOid'] === resId && response['hashAlgorithm'] === 'ver2' && response['storetype'] === '3d_pay_hosting' && req['method'] === 'POST') {
      const split = response['HASHPARAMSVAL'].split('|');
      if (split[0] === Keys['NEST_PAY_CLIENT_ID'] && split[1] === resId && split[4] === outcome) {
        return true;
      }
    }
    return false;
  }
  
  return false;
}

export const isConversationMessageLimited = (conversation: object, sender: string): boolean => {
	let n = 0;

	for (var i = 0; i < conversation['messages'].length; i++) {
		if (conversation['messages'][i]['sender'] === sender) {
			n = n + 1;
		}
	}

	if (n < 10) {
		return false;
	}

	return true;
}
