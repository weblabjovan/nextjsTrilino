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

export const setUpGeneralRoomsForFront = (rooms: Array<object>): Array<object> => {
	const partnerRooms = [];

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

	return partnerRooms;
}

export const setUpMainGeneralState = (state: null | object, general: object, language: string): object => {
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

	return newState;
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
	const forDual = ['parking', 'yard', 'balcon', 'pool', 'wifi', 'animator', 'food', 'drink', 'cake', 'selfFood', 'selfDrink', 'selfCake', 'smoking' ];
	const forCancelation = ['cancelation'];
	const forType = ['spaceType'];

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