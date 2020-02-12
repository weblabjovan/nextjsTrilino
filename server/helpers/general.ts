import jwt from 'jsonwebtoken';
import Keys from '../keys';
import products from '../constants/products';
import LinkClass from '../../lib/classes/Link';
import DateHandler from '../../lib/classes/DateHandler';

export const generateString = (length: number):string => {
	let str = '';
	const characters = ['a', 'b', 'w', 'r', 'm', '2', '1', 'x', 'T', 'n', 'X', 'b', '9', 'G', '7', 'd', 'O', 'l', 'y', 'm', 'p', '4', 'C', '6', 'm', 'F', 'c', 'v', '8', 'm', 'k', 'W', 'Q', 'f', '5', '0', 'z', 'K', 'h', 'j'];
	var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      str += characters[Math.floor(Math.random() * charactersLength)];
   }
	return str;
}

export const parseUrl = (url:string):object => {
  const result = {path:'', query:{}};
  const initial = url.split('?');
  result.path = initial[0];
  result.query = {};
  const second = initial[1].split('&');
  second.forEach((query) => {
      const ar = query.split('=');
      result.query[ar[0]] = ar[1];
  });

  return result;
}

export const decodeId = (stringer: (length: number) => string, id: string): string => { 
	const salt = stringer(8);
	const pepper = stringer(7);
	return `${salt}${id}${pepper}`;
}

export const encodeId = (id: string): string => {
	return id.slice(8, (id.length - 7));
}

export const setToken = (type: string, id: string): object => {
  let token = {};
  if (type === 'partner' || type === 'admin') {
    token = jwt.sign({
      iss: 'Trilino',
      sub: id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 7),
    }, Keys.JWT_SECRET);
  }

  return token;
}

export const verifyToken = (value: string): object => {
  const token = jwt.verify(value, Keys.JWT_SECRET);

  return token;
}

export const setUpLinkReq = (header: object): object => {
  const linkClass = new LinkClass();
  linkClass.generateLinkFromHeader(header);
  const link = linkClass.getParsedUrl();

  return link;
}

export const extractRoomTerms = (rooms: Array<object>, roomReg: string, day: number): Array<object> => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  let res = [];
  
  for (var i = 0; i < rooms.length; ++i) {
    if (rooms[i]['regId'] === roomReg) {
      res = rooms[i]['terms'][days[day]].filter((term) => {
        return typeof term['from'] === 'string' && typeof term['from'] === 'string';
      });
    }
  }

  return res;
}

export const getFreeTerms = (reservations: Array<object>, roomTerms: Array<object>): Array<object> => {
  const res = [];

  if (!reservations.length) {
    return roomTerms;
  }

  if (!roomTerms.length) {
    return res;
  }
  

  for (var i = 0; i < roomTerms.length; ++i) {
    if (!isInReservations(roomTerms[i]['from'], roomTerms[i]['to'], reservations)) {
      res.push(roomTerms[i])
    }
  }

  return res;
}

const isInReservations = (from: string, to: string, reservations: Array<object>): boolean => {
  for (var i = 0; i < reservations.length; ++i) {
    if (reservations[i]['from'] === from && reservations[i]['to'] === to && reservations[i]['active']) {
      return true;
    }
  }

  return false;
}

export const addMinutesToString = (time: string, minutes: number): string => {
  const d = new Date(`2020-12-17T${time}:00`);
  const newDate = new Date(d.getTime() + minutes*60000);
  return `${newDate.getHours}:${newDate.getMinutes}`;
}

export const setDateTime = (date: string, time: string): Date => {
  const splitTime = time.split(':');
  const d = new Date(date);
  const z = d.getTime() + (2*60*60*1000);
  const newDate = new Date(z);
  newDate.setUTCHours(parseInt(splitTime[0]));
  newDate.setMinutes(parseInt(splitTime[1]));
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);

  return newDate;
}

export const setReservationDateForBase = (dateString: string): Date => {
  const d = new Date(dateString);
  const z = d.getTime() + (2*60*60*1000);
  const newDate = new Date(z);

  return newDate;
}

export const setDateForServer = (date: string): Date => {
  const strings = date.split('-')
  const d = new Date();
  d.setFullYear(parseInt(strings[2]));
  d.setMonth(parseInt(strings[1])-1);
  d.setDate(parseInt(strings[0]));
  d.setUTCHours(0);
  d.setMinutes(0);
  d.setSeconds(0);
  d.setMilliseconds(0);

  return d;
}

const dayForSearch = (date: string): string => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const d = setDateForServer(date);

  return days[d.getDay()];
}

export const createSearchQuery = (fields: object): object => {
  const result = { 'active': true, 'forActivation': true };
  for(let key in fields){
    if (key === 'date') {
      const day = dayForSearch(fields['date']);
      if (result['$and']) {
        result['$and'].push({ 'general.rooms': { $elemMatch: {[`terms.${day}`]: {$elemMatch: {'from': {$exists: true }}}}} });
      }else{
        result['$and'] = [{ 'general.rooms': { $elemMatch: {[`terms.${day}`]: {$elemMatch: {'from': {$exists: true }}}}} }];
      }
    }

    if (key === 'kidsNum') {
      if (fields[key] !== null && fields[key] !== 'null') {
        if (result['$and']) {
          result['$and'].push({ 'general.rooms': { $elemMatch: {'capKids': { $gte: parseInt(fields[key]) }}}});
        }else{
          result['$and'] = [{ 'general.rooms': { $elemMatch: {'capKids': { $gte: parseInt(fields[key]) }}}}];
        }
        
      }
    }

    if (key === 'adultsNum') {
      if (fields[key] !== null && fields[key] !== 'null') {
        if (result['$and']) {
          result['$and'].push({ 'general.rooms': { $elemMatch: {'capAdults': { $gte: parseInt(fields[key]) }}}});
        }else{
          result['$and'] = [{ 'general.rooms': { $elemMatch: {'capAdults': { $gte: parseInt(fields[key]) }}}}];
        }
        
      }
    }

    if (key === 'city') {
      if (fields[key] !== null && fields[key] !== 'null') {
        result[key] = fields[key];
      }
    }

    if (key === 'district') {
      if (fields[key] !== null && fields[key] !== 'null') {
        result[key] = fields[key];
      }
    }

    if (key === 'agesFrom') {
      if (fields[key] !== null && fields[key] !== 'null') {
        if (Object.keys(fields).indexOf('agesTo') !== -1) {
          result['general.ageTo'] = { $lte: parseInt(fields['agesTo']), $gte: parseInt(fields[key])}
        }else{
          result['general.ageTo'] = { $gt: parseInt(fields[key])}
        }
        
      }
    }

    if (key === 'agesTo') {
      if (fields[key] !== null && fields[key] !== 'null') {
        if (Object.keys(fields).indexOf('agesFrom') !== -1) {
          result['general.ageTo'] = { $lte: parseInt(fields[key]), $gte: parseInt(fields['agesFrom'])}
        }else{
          result['general.ageFrom'] = { $lt: parseInt(fields[key])}
        }
        
      }
    }

    if (key === 'priceFrom') {
      if (fields[key] !== null && fields[key] !== 'null') {
        const day = dayForSearch(fields['date']);
        if (Object.keys(fields).indexOf('priceTo') !== -1) {
          if (result['$and']) {
            result['$and'].push({ 'general.rooms': { $elemMatch: {[`terms.${day}`]: {$elemMatch: {'price': { $lte: parseInt(fields['priceTo']), $gte: parseInt(fields[key])}}}}} });
          }else{
            result['$and'] = [{ 'general.rooms': { $elemMatch: {[`terms.${day}`]: {$elemMatch: {'price': { $lte: parseInt(fields['priceTo']), $gte: parseInt(fields[key])}}}}} }];
          }
        }else{
          if (result['$and']) {
            result['$and'].push({ 'general.rooms': { $elemMatch: {[`terms.${day}`]: {$elemMatch: {'price': { $gte: parseInt(fields[key])}}}}} });
          }else{
            result['$and'] = [{ 'general.rooms': { $elemMatch: {[`terms.${day}`]: {$elemMatch: {'price': { $gte: parseInt(fields[key])}}}}} }];
          }
          
        }
      }
    }

    if (key === 'priceTo') {
      if (fields[key] !== null && fields[key] !== 'null') {
        const day = dayForSearch(fields['date']);
        if (Object.keys(fields).indexOf('priceFrom') !== -1) {

        }else{
          if (result['$and']) {
            result['$and'].push({ 'general.rooms': { $elemMatch: {[`terms.${day}`]: {$elemMatch: {'price': { $lte: parseInt(fields[key])}}}}} });
          }else{
            result['$and'] = [{ 'general.rooms': { $elemMatch: {[`terms.${day}`]: {$elemMatch: {'price': { $lte: parseInt(fields[key])}}}}} }];
          }
          
        }
      }
    }

    if (key === 'offer') {
       if (fields[key] !== null && fields[key] !== 'null' && fields[key] !== '') {
        const arr = fields[key].split('%');
        const c = arr.map( x => { return parseInt(x)});

        result['contentOffer'] = { $all: c };
      }
    }

    if (key === 'name') {
      if (fields[key] !== null && fields[key] !== 'null') {
        result[key] = { $regex: fields[key], $options: 'i' };
      }
    }

    if (key === 'parking') {
      if (fields[key]) {
        result['general.parking'] =  '1'
      }
    }

    if (key === 'yard') {
      if (fields[key]) {
        result['general.yard'] =  '1'
      }
    }

    if (key === 'balcon') {
      if (fields[key]) {
        result['general.balcon'] =  '1'
      }
    }

    if (key === 'pool') {
      if (fields[key]) {
        result['general.pool'] =  '1'
      }
    }

    if (key === 'animator') {
      if (fields[key]) {
        result['general.animator'] =  '1'
      }
    }

    if (key === 'movie') {
      if (fields[key]) {
        result['general.movie'] =  '1'
      }
    }

    if (key === 'gaming') {
      if (fields[key]) {
        result['general.gaming'] =  '1'
      }
    }

  };

  return result;
}

export const getFreeTermPartners = (partners: Array<object>, date: string): Array<object> => {
  const day = dayForSearch(date);
  const result = [];

  for (var i = 0; i < partners.length; ++i) {
    if (!partners[i]['reservations'].length) {
      partners[i]['link'] = decodeId(generateString, partners[i]['_id']);
      result.push(partners[i]);
    }else{
      if (oneOfTheRoomsIsAvailable(partners[i]['general']['rooms'], day, partners[i]['reservations'].length)) {
        partners[i]['link'] = decodeId(generateString, partners[i]['_id']);
        result.push(partners[i]);
      }
    }
  }

  return result;
}

const oneOfTheRoomsIsAvailable = (rooms: Array<object>, day: string, reservationCount: number): boolean => {
  for (var i = 0; i < rooms.length; ++i) {
    if (rooms[i]['terms'][day][0]['from']) {
      if (rooms[i]['terms'][day].length > reservationCount) {
        return true;
      }
    }
  }

  return false;
}

export const calculatePartnerCapacity = (rooms: Array<object>): object => {
  let maxAdults = 0;
  let maxKids = 0;
  let sumAdults = 0;
  let sumKids = 0;

  for (var i = 0; i < rooms.length; ++i) {
    sumKids = sumKids + rooms[i]['capKids'];
    sumAdults = sumAdults + rooms[i]['capAdults'];
    maxAdults = maxAdults < rooms[i]['capAdults'] ? rooms[i]['capAdults'] : maxAdults;
    maxKids = maxKids < rooms[i]['capKids'] ? rooms[i]['capKids'] : maxKids;

  }

  return { maxAdults, maxKids, sumAdults, sumKids };
}

export const preparePartnerForLocation = (partner: object, date: string): object => {
  const day = dayForSearch(date);
  let freeTerms = [];

  if (!partner['reservations'].length) {
    freeTerms = JSON.parse(JSON.stringify(partner['general']['rooms']));
    for (var i = 0; i < freeTerms.length; ++i) {
      freeTerms[i]['terms'] = freeTerms[i]['terms'][day].filter(term => { if(term['from']){ return term }});
    }
  }else{
    freeTerms = JSON.parse(JSON.stringify(partner['general']['rooms']));
    for (var i = 0; i < freeTerms.length; ++i) {
      freeTerms[i]['terms'] = matchReservationsWithTerms(partner['reservations'], freeTerms[i]['terms'][day], freeTerms[i]['regId']);
    }
  }

  partner['terms'] = freeTerms;
  partner['link'] = decodeId(generateString, partner['_id']);

  return partner;
}

const matchReservationsWithTerms = (reservations: Array<object>, terms:Array<object>, room: string): Array<object> => {
  const reser = JSON.parse(JSON.stringify(reservations));
  const result = [];
  for (var i = 0; i < terms.length; ++i) {
    if (terms[i]['from']) {
      if (!isInReservationArray(reser, room, terms[i]['from'], terms[i]['to'])) {
        result.push(terms[i]);
      }
    }
  }

  return result;
}

const isInReservationArray = (reservations: Array<object>, room: string, from: string, to: string): boolean => {
  for (var i = 0; i < reservations.length; ++i) {
    if (reservations[i]['room'] === room && reservations[i]['to'] === to && reservations[i]['from'] === from) {
      return true;
    }
  }

  return false;
}

export const preparePartnerForReservation = (partner: object, data: object): object => {
  const day = dayForSearch(data['date']);
  let partnerCopy = JSON.parse(JSON.stringify(partner));
  partnerCopy['reservation'] = setUserReservation(partner['general']['rooms'], day, data['room'], data['from']);
  if (partner['general']['selfFood'] === '1') {
    partnerCopy['catering'] = setPartnerCatering(partner['catering']);
  }
  

  return partnerCopy;
}

const setUserReservation = (rooms: Array<object>, day: string, room: string, from: string): object => {
  const result = {};
  const roomsCopy = JSON.parse(JSON.stringify(rooms));

  for (var i = 0; i < roomsCopy.length; ++i) {
    if (roomsCopy[i]['regId'] === room ) {
      result['name'] = roomsCopy[i]['name'];
      result['id'] = roomsCopy[i]['regId'];
      result['size'] = roomsCopy[i]['size'];
      result['capKids'] = roomsCopy[i]['capKids'];
      result['capAdults'] = roomsCopy[i]['capAdults'];
      result['term'] = roomsCopy[i]['terms'][day].filter((term) => { return term['from'] === from})[0];
    }
  }

  return result;
}

const setPartnerCatering = (catering: object): object => {
  const cateringCopy = JSON.parse(JSON.stringify(catering));

  products['trilinoCatering'].map( (item) => {
    cateringCopy['deals'].push(item);
  })

  return cateringCopy;
}

export const isUrlTermValid = (rooms: Array<object>, data: object) => {
  const dateHandler = new DateHandler(data['date']);

  for (var i = 0; i < rooms.length; ++i) {
    if (rooms[i]['regId'] === data['room']) {
      const termArr = rooms[i]['terms'][dateHandler.getDayFromDate()].filter( term => { if(term['from'] === data['from'] && term['to'] === data['to']){ return term }});
      if (termArr.length) {
        return true;
      }
    }
  }

  return false;
}