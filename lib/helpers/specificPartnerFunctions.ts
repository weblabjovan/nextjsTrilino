import moment from 'moment';
import genOptions from '../constants/generalOptions';
import { isEmpty } from './validations';
import { setUpLinkBasic } from './generalFunctions';
import fetch from 'isomorphic-unfetch';
import nextCookie from 'next-cookies';


export const generateString = (length: number):string => {
	let str = '';
	const characters = ['a', 'b', 'w', 'r', 'm', '2', '1', 'x', 'T', 'n', 'X', 'b', '9', 'G', '7', 'd', 'O', 'l', 'y', 'm', 'p', '4', 'C', '6', 'm', 'F', 'c', 'v', '8', 'm', 'k', 'W', 'Q', 'f', '5', '0', 'z', 'K', 'h', 'j'];
	var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      str += characters[Math.floor(Math.random() * charactersLength)];
   }
	return str;
}

export const prepareGeneralPartnerObject = (general: object, rooms: Array<object>): object => {
	const object = {};
	const partnerRooms = [];

	for (let key in general){
	  if(general.hasOwnProperty(key)){
	  	if (key !== 'dictionary' && key !== 'errorMessages' && key !== 'rooms') {
	  		if(general[key] !== null){
	  			if (general[key]['value']) {
			  		object[key] = general[key]['value'];
			  	}else{
			  		if (key === 'size' || key === 'playSize') {
			  			object[key] = parseInt(general[key]);
			  		}else{
			  			object[key] = general[key];
			  		}
			  	}
	  		}
	  	}
	  }
	}

	for (var i = 0; i < rooms.length; ++i) {
		if (rooms[i]['name'] && rooms[i]['size'] && rooms[i]['capKids'] && rooms[i]['capAdults']) {
			const room = {
				name: rooms[i]['name'],
				regId: rooms[i]['regId'] ? rooms[i]['regId'] : (i + 1),
				size: parseInt(rooms[i]['size']),
				capKids: parseInt(rooms[i]['capKids']),
				capAdults: parseInt(rooms[i]['capAdults']),
				terms: dissembleRoomTerms(rooms[i])
			}
			partnerRooms.push(room);
		}
	}

	object['roomNumber'] = partnerRooms.length;
	object['rooms'] = makeRegIdsUniqueForArray(partnerRooms);

	return object;
}

const dissembleRoomTerms = (room: object): object => {
	const terms = JSON.parse(JSON.stringify(room['terms']));

	for(let key in terms){
		terms[key].map((term) => {
			term['from'] = term['from']['value'];
			term['to'] = term['to']['value'];
			term['price'] = parseInt(term['price']);
		})
	}

	return terms;
}


const assembleRoomTerms = (room: object): object => {
	const terms = JSON.parse(JSON.stringify(room['terms']));

	for(let key in terms){
		terms[key].map((term) => {
			term['from'] = term['from'] ? {value: term['from'], label: term['from']} : '';
			term['to'] = term['to'] ? {value: term['to'], label: term['to']} : '';
			term['price'] = term['price'] !== null ? parseInt(term['price']) : null;
		})
	}

	return terms;
	
}

export const validateTerms = (rooms: Array<object>, duration: string | object, alternative: string | object, ends: object): object => {

	if (!duration) {
		return {day: 'all', result: {success: false, message: 'error_no_5'}};
	}

	for (var i = 0; i < rooms.length; ++i) {
		const room = rooms[i];
		for(let key in room['terms']){
			const alter = alternative ? alternative['value'] : null;
			const res = isDaysTermValid(room['terms'][key], duration['value'], alter);
			if (!res['success']) {
				return {day: key, result: res};
			}

			const last = isLastTermAfterClose(ends[key], room['terms'][key])
			if (!last['success']) {
				return {day: key, result: last};
			}
			
		}
	}

	return {day: 'all', result: {success: true, message: 'Terms validated.'}};

}

export const getRoomsSelector = (rooms: Array<object>): Array<object> => {
	const newrooms = JSON.parse(JSON.stringify(rooms));
	const res = [];

	for (var i = 0; i < newrooms.length; ++i) {
		res.push({value: newrooms[i]['regId'], label: newrooms[i]['name']});
	}

	return res;
}

const isLastTermAfterClose = (dayLast: string | object, dayTerms: Array<object>): object => {

	if (dayTerms.length) {
		if (dayTerms[0]['from']) {
			if (typeof dayLast === 'object') {
				if (dayLast['value'] === '-1') {
					return {success: false, message: 'error_no_4'};
				}
			}
		}
	}
	
	if (dayTerms.length > 0) {
		if (typeof dayLast === 'object') {
			if (dayTerms.length === 1) {
				if (dayTerms[0]['price'] === null && dayTerms[0]['from'] === "" && dayTerms[0]['to'] === "") {
					return {success: true, message: 'Last term validated.'};
				}else{
					for (var i = 0; i < dayTerms.length; ++i) {
						if (isTermAfterClose(dayTerms[i], dayLast)) {
							return {success: false, message: 'error_no_4'};
						}
					}
				}
			}else{
				for (var i = 0; i < dayTerms.length; ++i) {
					if (isTermAfterClose(dayTerms[i], dayLast)) {
						return {success: false, message: 'error_no_4'};
					}
				}
			}
		}else{
			if (dayTerms.length === 1) {
				if (dayTerms[0]['price'] === null && dayTerms[0]['from'] === "" && dayTerms[0]['to'] === "") {
					return {success: true, message: 'Last term validated.'};
				}
			}
			return {success: false, message: 'error_no_4'};
		}
	}
	
	return {success: true, message: 'Last term validated.'};
}

const isTermAfterClose = (term: object, close: object): boolean => {
	if (!close['value'] || !term['to'] || !term['from'] || !term['price']) {
		return false;
	}
	const closeTime = moment(`2020-02-08 ${close['value']}`, "YYYY-MM-DD HH:mm");
	const lastTime = moment(`2020-02-08 ${term['to']['value']}`, "YYYY-MM-DD HH:mm");

	if (lastTime.isAfter(closeTime)) {
		return true;
	}

	return false;
}

const isDaysTermValid = (day: Array<object>, duration: string, alternative: string | null): object => {

	const loop = () => {
		for (var i = 0; i < day.length; ++i) {
			if (getNumberOfEmpty(day[i]) > 0) {
				return {success: false, message: 'error_no_1'};
			}
			if (day[i]['to']['value']) {
				const to = moment(`2020-02-08 ${day[i]['to']['value']}`, "YYYY-MM-DD HH:mm");
				const from = moment(`2020-02-08 ${day[i]['from']['value']}`, "YYYY-MM-DD HH:mm");
				const diff =  moment.duration(to.diff(from)).asHours();

				if (alternative) {
					if (diff !== parseFloat(duration) && diff !== parseFloat(alternative)) {
						return {success: false, message: 'error_no_2'};
					}
				}else{
					if (diff !== parseFloat(duration)) {
						return {success: false, message: 'error_no_2'};
					}
				}

				

				if (i !== 0) {

					const lastTo = moment(`2020-02-08 ${day[i - 1]['to']['value']}`, "YYYY-MM-DD HH:mm");
					const lastDiff =  moment.duration(from.diff(lastTo)).asHours();
					if (lastDiff < 0.5) {
						return {success: false, message: 'error_no_3'};
					}
				}
			}
		}

		return {success: true, message: 'Term validated.'};
	}

	if (day.length === 1) {
		if (day[0]['price'] === null && day[0]['from'] === "" && day[0]['to'] === "") {
			return {success: true, message: 'Term validated.'};
		}
	}

	return loop();
}

const getNumberOfEmpty = (term: object): number => {
	let empty = 0;

	for(let key in term){
		if (!term[key]) {
			++empty;
		}
	}

	return empty;
}

export const setUpGeneralRoomsForFront = (partner: object): Array<object> => {
	const partnerRooms = [];

	if (partner['general']) {
		if (partner['general']['rooms']) {
			if (Array.isArray(partner['general']['rooms'])) {
				const rooms = partner['general']['rooms'];
				for (var i = 0; i < rooms.length; ++i) {
					const room = {
						name: rooms[i]['name'],
						regId: rooms[i]['regId'] ? rooms[i]['regId'] : (i + 1),
						size: parseInt(rooms[i]['size']),
						capKids: parseInt(rooms[i]['capKids']),
						capAdults: parseInt(rooms[i]['capAdults']),
						terms: assembleRoomTerms(rooms[i])
					}
					partnerRooms.push(room);
				}
			}
		}
	}

	return partnerRooms;
}

export const setUpMainGeneralState = (state: null | object, partner: object, language: string): object => {
	let res = {};

	if (partner['general']) {
		const general = partner['general'];

		const newGen = JSON.parse(JSON.stringify(general));
		const newState = state !== null ? JSON.parse(JSON.stringify(state)) : getProfileGeneralStructure(newGen);
		
		const generalKeys = Object.keys(newGen);
		const plainInputs = ['size', 'description', 'playSize', 'address', 'minimalDeposit'];
		for(let key in newState){
			if (generalKeys.indexOf(key) !== -1) {
				if (plainInputs.indexOf(key) !== -1) {
					newState[key] = newGen[key];
				}else{
					if (newGen[key]) {
						newState[key] = assembleForSelect(key, newGen[key], language);
						
					}
				}
				
			}
		}

		res = newState;
	}else{
		res = genOptions['partnerGeneralStructure'];
	}
	

	return res;
}

const getProfileGeneralStructure = (general: object): object => {
	const structure = {};
	for(let key in general){
		structure[key] = "";
	}

	return structure;
}

const assembleForSelect = (key: string, value: number | string, language: string): object => {
	const forItemDuration = ['duration', 'durationAlternative'];
	const forAges = ['ageFrom', 'ageTo'];
	const forTimes = ['mondayFrom', 'mondayTo', 'tuesdayFrom', 'tuesdayTo', 'wednesdayFrom', 'wednesdayTo', 'thursdayFrom', 'thursdayTo', 'fridayFrom', 'fridayTo', 'saturdayFrom', 'saturdayTo', 'sundayFrom', 'sundayTo' ];
	const forDual = ['parking', 'yard', 'balcon', 'pool', 'wifi', 'animator', 'food', 'drink', 'cake', 'selfFood', 'selfDrink', 'selfCake', 'smoking', 'selfAnimator', 'movie', 'gaming' ];
	const forCancelation = ['cancelation'];
	const forType = ['spaceType'];
	const forQuater = ['quarter'];

	if (forItemDuration.indexOf(key) !== -1) {
		const res = genOptions[`itemDuration_${language}`].filter((item) => { return item['value'] === value; });
		return res[0];
	}
	if (forAges.indexOf(key) !== -1) {
		const res = genOptions['ages'].filter((age) => { return age['value'] === value.toString(); });
		return res[0];
	}
	if (forTimes.indexOf(key) !== -1) {
		const res = genOptions['times'].filter((time) => { return time['value'] === value; });
		return res[0];
	}
	if (forDual.indexOf(key) !== -1) {
		const res = genOptions[`dual_${language}`].filter((dual) => { return dual['value'] === value; });
		return res[0];
	}
	if (forType.indexOf(key) !== -1) {
		const res = genOptions[`spaceType_${language}`].filter((dual) => { return dual['value'] === value; });
		return res[0];
	}
	if (forCancelation.indexOf(key) !== -1) {
		const res = genOptions[`cancel_${language}`].filter((dual) => { return dual['value'] === value; });
		return res[0];
	}
	if (forQuater.indexOf(key) !== -1) {
		for(let key in genOptions['quarter']){
			const res = genOptions['quarter'][key].filter((dual) => { return dual['value'] === value; });
			return res[0];
		}
	}

	return { value: value, label: value };
}

export const isFieldInObject = (object: object, field: string, subObject?:string ): boolean => {
	if (object) {
		if (subObject) {
			if (object[subObject]) {
				if (object[subObject][field]) {
					return true;
				}
			}
		}else{
			if (object[field]) {
				return true;
			}
		}
	}

	return false;
}

export const getGeneralOptionLabelByValue = (options: Array<object>, value: string | number): string => {
	for (var i = 0; i < options.length; ++i) {
		if (options[i]['value'] === value) {
			return options[i]['label']; 
		}
	}

	return '';
}

export const getGeneralOptionByValue = (options: Array<object>, value: string | number): object => {
	for (var i = 0; i < options.length; ++i) {
		if (options[i]['value'] === value) {
			return options[i]; 
		}
	}

	return {value:'', lable:''};
}

export const setArrayWithLabelAndValue = (genField: string, partner: Array<number>): Array<object> => {
	const options = genOptions[genField];
	const arr = [];

	if (partner['contentOffer']) {
		const offers = partner['contentOffer'];

		for (var i = 0; i < options.length; ++i) {
			if (offers.indexOf(parseInt(options[i]['value'])) !== -1) {
				arr.push(options[i]);
			}
		}
	}
	
	return arr;
}

export const getOnlyValues = (options: Array<object>): Array<number> => {
	const arr = JSON.parse(JSON.stringify(options));
	
	return arr.map(item => { return parseInt(item['value']) });
}

export const fillPickedOffers = (picked: object, offers: Array<number>, lang: string): object => {
	const res = JSON.parse(JSON.stringify(picked));

	for (var i = 0; i < offers.length; ++i) {
		if (!isInPicked(offers[i], res) ) {
			const label = getGeneralOptionLabelByValue(genOptions[`contentOffer_${lang}`], offers[i].toString());
			res[label.toLowerCase()] = true;
		}
	}

	return res;
}

export const isInArrayOfObjects = (field: string, value: string | number, arr: Array<any>): boolean => {
	for (var i = 0; i < arr.length; ++i) {
		if (arr[i][field] === value) {
			return true;
		}
	}

	return false;
}

const isInPicked = (offer: number, picked: object): boolean => {
	for(let key in picked){
		if (parseInt(picked[key]) === offer) {
			return true;
		}
	}

	return false;
}

export const setCateringForBack = (catering: object): object => {
	const newCat = JSON.parse(JSON.stringify(catering));
	let deals = removeEmpty(newCat['deals'], isDealEmpty);
	deals = typeTheDeals(deals);
	deals = makeRegIdsUniqueForArray(deals);
	const drinkCard = newCat['drinkCard'];

	return { deals, drinkCard };
}

const removeEmpty = (deals: Array<object>, isEmpty: (item: object) => boolean): Array<any> => {
	const removeIndex = [];
	for (var i = 0; i < deals.length; ++i) {

		if (isEmpty(deals[i])) {
			removeIndex.push(i);
		}
	}

	for (var i = removeIndex.length - 1; i >= 0; i--) {
		deals.splice(removeIndex[i],1);
	}

	return deals;
}

const typeTheDeals = (deals: Array<object>): Array<object>  => {
	for (var i = 0; i < deals.length; ++i) {
		deals[i]['price'] = parseInt(deals[i]['price']);
		deals[i]['min'] = parseInt(deals[i]['min']);
		deals[i]['type'] = deals[i]['type']['value'];
		deals[i]['regId'] = deals[i]['regId'] ? deals[i]['regId'] : generateString(12);
	}

	return deals;
}

const isDealEmpty = (deal: object): boolean => {
	if (!deal['type'] && !deal['price'] && !deal['min'] && !deal['items'].length) {
		return true;
	}

	return false;
}

export const setUpMainCateringState = (partner: object, lang: string): object => {
	const res = {};
	const newPartner = JSON.parse(JSON.stringify(partner));
	if (newPartner['catering']) {
		const catering = newPartner['catering'];
		res['drinkCard'] = catering['drinkCard'];
		if (!catering['deals'].length) {
			res['deals'] = [ { type: '', price: '', min: null, items: [], currentItem: '', regId: generateString(12)} ];
		}else{
			catering['deals'].map( deal => {
				deal['type'] = {value: deal['type'], label: getGeneralOptionLabelByValue(genOptions[`dealType_${lang}`], deal['type'].toString()) };
				deal['price'] = deal['price'].toString();
				deal['min'] = deal['min'].toString();
				deal['regId'] = deal['regId'] ? deal['regId'] : generateString(12);
			});

			res['deals'] = catering['deals'];
		}
	}else{
		res['deals'] = [ { type: '', price: '', min: null, items: [], currentItem: ''} ];
		res['drinkCard'] = [];
	}
	

	return res;
}

export const isolateByArrayFieldValue = (mainArr: Array<object>, field: string, value: string | number): Array<object> => {
	const arr = [];
	for (var i = 0; i < mainArr.length; ++i) {
		if (mainArr[i][field] === value) {
			arr.push(mainArr[i]);
		}
	}

	return arr;
}

export const prepareDecorationDataForSave = (data: object): object => {
	const res = {};
	const decoration = JSON.parse(JSON.stringify(data));

	for(let key in decoration) {
		if (decoration[key]['check']) {
			res[key] = { price: decoration[key]['price'], value: parseInt(key), regId: decoration[key]['regId']};
		}
	}

	return makeRegIdsUniqueForObject(res);
}

export const buildPartnerDecorationObject = (partner: object): object => {
	const newPartner = JSON.parse(JSON.stringify(partner));
	let existing = null;
	if (newPartner['decoration']) {
		if (Object.keys(newPartner['decoration']).length) {
			existing = newPartner['decoration'];
		}
	}

	return buildDecoration(existing);
}

const buildDecoration = (existing?: object): object => {
	const res = {}
	for(let key in genOptions['decorType']){
		const decor = { check: false, name_sr: genOptions['decorType'][key]['name_sr'], name_en: genOptions['decorType'][key]['name_en'], value: parseInt(key), price: '' };
		if (existing) {
			if (existing[key]) {
				decor['check'] = true;
				decor['price'] = existing[key]['price'];
				decor['regId'] = existing[key]['regId'];
			}
		}
		res[key] = decor;
	}

	return res;
}

export const isForDecorationSave = (length: number, partner: object): boolean => {
	if (partner['decoration']) {
		if (Object.keys(partner['decoration']).length === 0 && length === 0) {
			return false;
		}
	}

	return true;
}

export const getLayoutNumber = (size: string, length: number): string => {
	let res = '12';
	if (length === 3) {
		size === 'sm' ? res = '4' : size === 'lg' ? res = '4' : null;
	}else{
		size === 'sm' ? res = '6' : size === 'lg' ? res = '6' : null;
	}

	return res;
}

export const isFree = (value: number | string): boolean => {
	if (value === null || value === '' || value === 0 || value === undefined) {
		return true;
	}

	return false;
}

export const makeRegIdsUniqueForArray = (arr: Array<object>): Array<object> => {
	const checker = {};
	for (var i = 0; i < arr.length; ++i) {
		if (!checker[arr[i]['regId']]) {
			checker[arr[i]['regId']] = true;
		}else{
			arr[i]['regId'] = arr[i]['regId'] + i.toString();
			checker[arr[i]['regId']] = true;
		}
	}

	return arr;
}

const makeRegIdsUniqueForObject = (arr: object): object => {
	const checker = {};
	for(let key in arr){
		if (!checker[arr[key]['regId']]) {
			checker[arr[key]['regId']] = true;
		}else{
			arr[key]['regId'] = arr[key]['regId'] + key;
			checker[arr[key]['regId']] = true;
		}
	}

	return arr;
}

export const createReservationTermsArray = (freeTerms: Array<object>): Array<object> => {
	const res = [];

	for (var i = 0; i < freeTerms.length; ++i) {
		res.push({label:`${freeTerms[i]['from']} - ${freeTerms[i]['to']}`, value:i});
	}

	return res;
}

export const prepareReservationObjectForSave = (obj: object): object => {
	const partnerReservation = JSON.parse(JSON.stringify(obj));
	partnerReservation['date']  = setDateToDayStart(partnerReservation['date']);
	partnerReservation['animation'] = returnOnlyTrueForObjects(partnerReservation['animation']);
	partnerReservation['decoration'] = returnOnlyTrueForObjects(partnerReservation['decoration']);
	partnerReservation['room'] = partnerReservation['room']['value'];

	return partnerReservation;
}

export const setDateToDayStart = (date: string): string => {
	const newDate = moment(date).hours(0).minutes(0).seconds(0).milliseconds(0).format();

	return newDate;
}

const returnOnlyTrueForObjects = (obj: object, field: string | null = null): object => {
	const res = {};
	for(let key in obj){
		if (field) {
			if (obj[key][field] === true) {
				res[key] = obj[key];
			}
		}else{
			if (obj[key] === true) {
				res[key] = obj[key];
			}
		}
	}

	return res;
}

export const dateForSearch = (date: string): Date => {
	
	const strings = date.split('-')
	const d = new Date();
	let month = parseInt(strings[1]) - 1;
	d.setFullYear(parseInt(strings[2]));
	d.setMonth(month ,parseInt(strings[0]));

	return d;
}

export const formatReservations = (reservations: Array<object>): Array<object> => {
	for (var i = 0; i < reservations.length; ++i) {
		const d = new Date(reservations[i]['date']);
		const dateString = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
		reservations[i]['start'] = new Date(`${dateString} ${reservations[i]['from']}`);
		reservations[i]['end'] = new Date(`${dateString} ${reservations[i]['to']}`);
		reservations[i]['title'] = reservations[i]['double'] ? `${reservations[i]['guest']} double - ${reservations[i]['doubleNumber']}` : reservations[i]['guest'];
	}

	return reservations;
}

export const getCurrentWeekStartAndEnd = (): object => {
	const curr = new Date();
	curr.setHours(0,0,0,0);
	const day = 86400 * 1000;
	const week = 604800 * 1000;
	const weekDay = curr.getDay() === 0 ? 7 : curr.getDay();
	const startTimestamp = curr.getTime() - ((weekDay-1) * day);
	const endTimestamp = startTimestamp + week;

	const start = new Date(startTimestamp).toUTCString();
	const end = new Date(endTimestamp).toUTCString();
	return {start: setDateToDayStart(start), end: setDateToDayStart(end)};
}

export const addDaysToDate = (date: string | null, days: number): Date => {
	let newDate = new Date();
	if (date) {
		newDate = new Date(date);
	}
  newDate.setDate(newDate.getDate() + days);

  return newDate;
}

export const subtractDaysToDate = (date: string | null, days: number): Date => {
	let newDate = new Date();
	if (date) {
		newDate = new Date(date);
	}
  newDate.setDate(newDate.getDate() - days);

  return newDate;
}

export const getFieldValueByRegId = (arr: Array<object>, regId: string, field: string): string => {
	for (var i = 0; i < arr.length; ++i) {
		if (arr[i]['regId'] === regId) {
			return arr[i][field];
		}
	}

	return '';
}

export const getFieldValueByRegIdForObjects = (obj: object, regId: string, field: string): string => {

	for(let key in obj){
		if (obj[key]['regId'] === regId) {
			return obj[key][field];
		}
	}

	return '';
}

export const calculateActivationProcess = (partnerObj: object): number => {
	let num = 20;

	if (isGeneralFilled(partnerObj)) {
		num = num + 20;
	}

	if (isRoomsFilled(partnerObj)) {
		num = num + 20;
	}

	if (isFreeContentActive(partnerObj)) {
		num = num + 10;
	}

	if (partnerObj['general']) {
		if (partnerObj['general']['drink'] === '1') {
			if (isDrinkCardActive(partnerObj)) {
				num = num + 15;
			}
		}else{
			if (partnerObj['general']['selfDrink']) {
				num = num + 15;
			}
		}

		if (partnerObj['general']['food'] === '1') {
			if (isCateringDealPresent(partnerObj)) {
				num = num + 15;
			}
		}else{
			if (partnerObj['general']['selfFood']) {
				num = num + 15;
			}
		}
	}

	return num;


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

export const createDisplayPhotoListObject = (partner: object): object => {
	const res = { main: null, sel_1: null, sel_2: null, sel_3: null, sel_4: null, sel_5: null, sel_6: null }
	if (partner['photos']) {
		if(Array.isArray(partner['photos'])){
			let main = 0;
			let sel = 0;
			for (var i = 0; i < partner['photos'].length; ++i) {
				if (partner['photos'][i]['main'] && main === 0) {
					res['main'] = partner['photos'][i]['name'];
					main = 1;
				}

				if (partner['photos'][i]['selection'] && sel < 6) {
					res[`sel_${sel + 1}`] = partner['photos'][i]['name'];
					sel = sel + 1;
				}
			}
		}
	}

	return res;
}


export const isPartnerLogged = async (context: any): Promise<boolean> => {
	const link = setUpLinkBasic({path: context.asPath, host: context.req.headers.host});
	const allCookies = nextCookie(context);
  const token = allCookies['trilino-partner-token'];

  if (token) {
  	try{
	    const apiUrl = `${link["protocol"]}${link["host"]}/api/partners/auth/?language=${link['queryObject']['language']}`;
	      const response = await fetch(apiUrl, {
	      credentials: 'include',
	      headers: {
	        Authorization: `${token}`
	      }
	    });

	    if (response.status === 200) {
	    	return true;
	    }else{
	    	return false;
	    }
	  }catch(err){
	    return false;
	  }
  }else{
  	return false;
  }
}

export const isPartnerLoggedOutsideCall = async (context: any): Promise<boolean> => {
	const link = setUpLinkBasic({path: context.asPath, host: context.req.headers.host});

  try{
    const apiUrl = `${link["protocol"]}${link["host"]}/api/partners/auth/?partnerAuth=${link['queryObject']['userAuth']}&language=${link['queryObject']['language']}`;
      const response = await fetch(apiUrl);
    if (response.status === 200) {
    	return true;
    }else{
    	return false;
    }
  }catch(err){
    return false;
  }
}

export const getSinglePartner = async (context: any, encoded: boolean): Promise<any> => {
	const link = setUpLinkBasic({path: context.asPath, host: context.req.headers.host});
	const date = link['queryObject']['date'] ? link['queryObject']['date'] : 'null';
	const apiUrl = `${link["protocol"]}${link["host"]}/api/partners/get/?language=${link['queryObject']['language']}&partner=${link['queryObject']['partner']}&date=${date}&encoded=${encoded}`;
	const response = await fetch(apiUrl);

	return response;
}

export const getSinglePartnerForReservation = async (context: any, encoded: boolean): Promise<any> => {
	const link = setUpLinkBasic({path: context.asPath, host: context.req.headers.host});
	const encodedParam = encoded ? 'encoded=true' : '';
	const date = link['queryObject']['date'] ? link['queryObject']['date'] : 'null';
	const apiUrl = `${link["protocol"]}${link["host"]}/api/partners/get/?language=${link['queryObject']['language']}&partner=${link['queryObject']['partner']}&date=${date}&type=reservation&room=${link['queryObject']['room']}&from=${link['queryObject']['from']}&to=${link['queryObject']['to']}&${encodedParam}`;
	const response = await fetch(apiUrl);

	return response;
}


export const getPartners = async (context: any): Promise<any> => {
	const link = setUpLinkBasic({path: context.asPath, host: context.req.headers.host});
	const apiUrl = `${link["protocol"]}${link["host"]}/api/partners/get/?language=${link['queryObject']['language']}&city=${link['queryObject']['city']}&district=${link['queryObject']['district']}&date=${link['queryObject']['date']}&multiple=true`;
	const response = await fetch(apiUrl);

    return response;
}



export const getPartnerToken = (context: any): string => {
	const allCookies = nextCookie(context);
	const token = allCookies['trilino-partner-token'] ? allCookies['trilino-partner-token'] : '';
	return token;
}

export const setSearchData = (data: object): object => {
	const fields = ['city', 'district', 'date', 'kidsNum', 'adultsNum', 'parking', 'yard', 'balcon', 'pool', 'animator', 'gaming', 'offer', 'agesFrom', 'agesTo', 'priceFrom', 'priceTo', 'name'];
	const result = {};

	for(let key in data){
		if (fields.indexOf(key) !== -1) {
			if (data[key]) {
				if (key === 'date') {
					result[key] = `${data[key].getDate()}-${data[key].getMonth() + 1}-${data[key].getFullYear()}`;
				}else{
					if (typeof data[key] === 'object') {
						if (data[key]['value']) {
							result[key] = data[key]['value'];
						}else{
							if (key === 'offer') {
								const arr = [];
								for(let index in data[key]){
									if (data[key][index]) {
										arr.push(parseInt(index));
									}
								}
								result[key] = arr;
							}
						}
					}else{
						result[key] = data[key];
					}
				}
			}
		}
	}

	return result;
}


export const getPartnerRooms = (rooms: Array<object>): Array<object> => {
	const res = [];
	for (var i = 0; i < rooms.length; i++) {
		res.push({label: rooms[i]['name'], value: rooms[i]['regId']})
	}

	return res;
}