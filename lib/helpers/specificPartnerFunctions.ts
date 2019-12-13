import moment from 'moment';
import genOptions from '../constants/generalOptions';

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
				size: parseInt(rooms[i]['size']),
				capKids: parseInt(rooms[i]['capKids']),
				capAdults: parseInt(rooms[i]['capAdults']),
				terms: dissembleRoomTerms(rooms[i])
			}
			partnerRooms.push(room);
		}
	}

	object['roomNumber'] = partnerRooms.length;
	object['rooms'] = partnerRooms;

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

export const validateTerms = (rooms: Array<object>, duration: string | object, ends: object): object => {

	if (!duration) {
		return {day: 'all', result: {success: false, message: 'error_no_5'}};
	}

	for (var i = 0; i < rooms.length; ++i) {
		const room = rooms[i];
		for(let key in room['terms']){
			const res = isDaysTermValid(room['terms'][key], duration['value']);
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

const isLastTermAfterClose = (dayLast: string | object, dayTerms: Array<object>): object => {
	if (dayTerms.length > 1) {
		if (typeof dayLast === 'object') {
			if (dayTerms[dayTerms.length - 1]['to'] && dayLast['value']) {
				const closeTime = moment(`2020-02-08 ${dayLast['value']}`, "YYYY-MM-DD HH:mm");
				const lastTime = moment(`2020-02-08 ${dayTerms[dayTerms.length - 1]['to']['value']}`, "YYYY-MM-DD HH:mm");
				if (lastTime.isAfter(closeTime)) {
					return {success: false, message: 'error_no_4'};
				}
			}else{
				return {success: false, message: 'error_no_4'};
			}
		}else{
			return {success: false, message: 'error_no_4'};
		}
	}
	
	return {success: true, message: 'Last term validated.'};
}

const isDaysTermValid = (day: Array<object>, duration: string): object => {
	const res = true;

	for (var i = 0; i < day.length; ++i) {
		if (getNumberOfEmpty(day[i]) !== 0 && getNumberOfEmpty(day[i]) !== 3) {
			return {success: false, message: 'error_no_1'};
		}
		if (day[i]['to']['value']) {
			const to = moment(`2020-02-08 ${day[i]['to']['value']}`, "YYYY-MM-DD HH:mm");
			const from = moment(`2020-02-08 ${day[i]['from']['value']}`, "YYYY-MM-DD HH:mm");
			const diff =  moment.duration(to.diff(from)).asHours();

			if (diff !== parseFloat(duration)) {
				return {success: false, message: 'error_no_2'};
			}

			if (i !== 0) {
				const lastTo = moment(`2020-02-08 ${day[i - 1]['to']['value']}`, "YYYY-MM-DD HH:mm");
				const lastDiff =  moment.duration(from.diff()).asHours();
				if (lastDiff < 0.5) {
					return {success: false, message: 'error_no_3'};
				}
			}
		}
		
	}

	return {success: true, message: 'Term validated.'};
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
		const plainInputs = ['size', 'description', 'playSize', 'address'];
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
	const forItemDuration = ['duration'];
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
		const res = genOptions['ages'].filter((age) => { return age['value'] === value; });
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

export const isFieldInObject = (object: object, field: string, subObject: null | string = null): boolean => {
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
			res['deals'] = [ { type: '', price: '', min: null, items: [], currentItem: ''} ];
		}else{
			catering['deals'].map( deal => {
				deal['type'] = {value: deal['type'], label: getGeneralOptionLabelByValue(genOptions[`dealType_${lang}`], deal['type'].toString()) };
				deal['price'] = deal['price'].toString();
				deal['min'] = deal['min'].toString();
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
			res[key] = { price: decoration[key]['price'], value: parseInt(key)};
		}
	}

	return res;
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

const buildDecoration = (existing: object = null): object => {
	const res = {}
	for(let key in genOptions['decorType']){
		const decor = { check: false, name_sr: genOptions['decorType'][key]['name_sr'], name_en: genOptions['decorType'][key]['name_en'], value: parseInt(key), price: '' };
		if (existing) {
			if (existing[key]) {
				decor['check'] = true;
				decor['price'] = existing[key]['price'];
			}
		}
		res[key] = decor;
	}

	return res;
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