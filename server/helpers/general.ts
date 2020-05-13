import jwt from 'jsonwebtoken';
import Keys from '../keys';
import btoa from 'btoa';
import crypto from 'crypto';
import products from '../constants/products';
import LinkClass from '../../lib/classes/Link';
import DateHandler from '../../lib/classes/DateHandler';
import { languageList } from '../../lib/language/locale';
import { getLanguage } from '../../lib/language';
import { getGeneralOptionLabelByValue } from '../../lib/helpers/specificPartnerFunctions';
import generalOptions from '../../lib/constants/generalOptions';
import { IemailGeneral } from '../../lib/constants/interfaces';

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
  if (type === 'partner' || type === 'admin' || type === 'user') {
    token = jwt.sign({
      iss: 'Trilino',
      sub: id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 10),
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

export const getArrayObjectByFieldValue = (arr: Array<object>, field: string, value: any): null | object => {
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i][field]) {
      if (arr[i][field] === value) {
        return arr[i];
      }
    }
  }

  return null;
}

export const getArrayIndexByFieldValue = (arr: Array<object>, field: string, value: any): number => {
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i][field]) {
      if (arr[i][field] === value) {
        return i;
      }
    }
  }

  return -1;
}

export const getObjectFieldByFieldValue = (obj: object, field: string, value: any): null | object => {

  for(let key in obj){
    if (obj[key][field] === value) {
      return obj[key];
    }
  }

  return null;
}

export const currencyFormat = (num: number): string => {
  const ra = new Number(num);
  return ra.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export const setReservationDateForBase = (dateString: string): Date => {
  const d = new Date(dateString);
  const z = d.getTime() + (2*60*60*1000);
  const newDate = new Date(z);

  return newDate;
}

export const createSearchQuery = (fields: object): object => {
  const result = { 'active': true, 'forActivation': true };
  for(let key in fields){
    if (key === 'date') {
      const dateHandler = new DateHandler(fields['date']);
      const day = dateHandler.getDayFromDate();

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
        const dateHandler = new DateHandler(fields['date']);
        const day = dateHandler.getDayFromDate();
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
        const dateHandler = new DateHandler(fields['date']);
        const day = dateHandler.getDayFromDate();
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
  const dateHandler = new DateHandler(date);
  const day = dateHandler.getDayFromDate();
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
  let termNum = 0;
  for (var i = 0; i < rooms.length; ++i) {
    if (rooms[i]['terms'][day][0]['from']) {
      termNum = termNum + rooms[i]['terms'][day].length;
    }
  }

  if (termNum > reservationCount) {
    return true;
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
  const dateHandler = new DateHandler(date);
  const day = dateHandler.getDayFromDate();

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
  const dateHandler = new DateHandler(data['date']);
  const day = dateHandler.getDayFromDate();
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

export const defineUserLanguage = (languageString: string | string[]): string => {
  if (languageString) {
    if (languageList.indexOf(languageString.toString()) !== -1) {
      return languageString.toString();
    }else{
      return 'sr';
    }
  }

  return 'sr';
}

export const getNextTerm = (partner: object, room: string | string[], from: string | string[], to: string | string[], date: string | string[]): null | object =>{
  const partnerCopy = JSON.parse(JSON.stringify(partner));
  const dateHandler = new DateHandler(date);
  const day = dateHandler.getDayFromDate();

  const filter = partnerCopy['general']['rooms'].filter(item => { if (item['regId'] === room) {
    return item;
  }});

  if (filter.length) {
    const addition = parseFloat(partnerCopy['general']['duration']) + 0.5;
    dateHandler.addHours(from, addition);
    const nextFrom = dateHandler.getStringDatePart('time');
    dateHandler.addHours(to, addition);
    const nextTo = dateHandler.getStringDatePart('time');

    const res = filter[0]['terms'][day].filter(term => {if (term['to'] === nextTo && term['from'] === nextFrom) {
      return term;
    }});

    if (res.length) {
      return res[0]
    }
    
  }

  return null;
}

export const setNestPayHash = (str: string): string => {
  const hashVal = crypto.createHash("sha512").update(str).digest('hex');
  const pack = packIt(hashVal);
  const hash = btoa(pack);

  return hash;
}

const packIt = (str: string): string => {
  const quantifier = str.length;
  let result = '';

  for (let i = 0; i < quantifier; i += 2) {
    // Always get per 2 bytes...
    let word = str[i]
    if (((i + 1) >= quantifier) || typeof str[i + 1] === 'undefined') {
      word += '0'
    } else {
      word += str[i + 1]
    }
    // The fastest way to reverse?
    
    result += String.fromCharCode(parseInt(word, 16))
  }

  return result;
}

export const sortCateringTypes = (catering: object): object => {
  const trilinoIds = products['trilinoCatering'].map( product => { return product['regId']});
  const res = { trilino: { }, partner: { }}
  Object.keys(catering).map( key => { if (trilinoIds.indexOf(key) !== -1) {
    res['trilino'][key] = catering[key];
  }else{
    res['partner'][key] = catering[key];
  }});

  return res;
}

export const setLinksInApi = (host: string, page: string): string => {
  let start = 'http://';

  if (host !== 'localhost:3000') {
    start = 'https://www.';
  }

  return `${start}${host}/${page}`;
}

export const prepareReservationsForUserList = (reservations: Array<object>): Array<object> => {
  const newReservations = integrateDoubleReservations(reservations);
  newReservations.map( (reserve, index) => {
    if (reserve['type'] === 'user' && reserve['doubleNumber'] === '1') {
      reserve['status'] = setReservationStatus(reserve);
      reserve['dateTime'] = setReservationTimeString(reserve);
      reserve['isForRate'] = isReservationForRate(reserve);
      reserve['cancelPolicy'] = getCancelPolicy(reserve);
      reserve['isForTrilino'] = isReservationWithTrilinoCatering(reserve);
      reserve['trilinoPaymentDeadline'] = setTrilinoPaymentDeadline(reserve);
      reserve['trilinoCateringString'] = setTrilinoCateringString(reserve);
      reserve['isTrilinoCateringPaid'] = isTrilinoCateringPaid(reserve);
      reserve['cateringString'] = setCateringForUserList(reserve);
      reserve['decorationString'] = setDecorationString(reserve, reserve['partnerObj'][0]);
      reserve['addonString'] = setAddonString(reserve, reserve['partnerObj'][0]);
    }
  })
  return newReservations;
}

const integrateDoubleReservations = (reservations: Array<object>): Array<object> => {
  const double = {};
  const result = [];

  reservations.map((reserve, index) => {
    if (reserve['double']) {
      if (double.hasOwnProperty(reserve['doubleReference'])) {
        if (reserve['doubleNumber'] === 2) {
          result[double[reserve['doubleReference']]]['doubleObj'] = reserve;
        }else{
          reserve['doubleObj'] = reservations[double[reserve['doubleReference']]];
          result.push(reserve);
        }
      }else{
        if (reserve['doubleNumber'] === 2){
          double[reserve['doubleReference']] = index;
        }else{
          result.push(reserve);
          double[reserve['doubleReference']] = result.length - 1;
        }
      }
    }else{
      result.push(reserve);
    }
  });

  return result;
}

const setReservationStatus = (reservation: object): string => {
  if (reservation['confirmed'] && reservation['active'] && !reservation['canceled']) {
    return 'accepted';
  }

  if (!reservation['confirmed'] && !reservation['active']) {
    return 'declined';
  }

  if (reservation['confirmed'] && !reservation['active'] && reservation['canceled']) {
    return 'canceled';
  }
}

export const setReservationTimeString = (reservation: object): string => {
  if (reservation['date'] && reservation['from'] && reservation['to']) {
    const date = reservation['date'].substr(0,10);
    if (reservation['doubleObj']) {
      return `${date.split('-')[2]}.${date.split('-')[1]}.${date.split('-')[0]}, ${reservation['from']} - ${reservation['doubleObj']['to']}`;
    }else{
      return `${date.split('-')[2]}.${date.split('-')[1]}.${date.split('-')[0]}, ${reservation['from']} - ${reservation['to']}`;
    }
    
    
  }
  
  return '';
} 

const isReservationForRate = (reservation: object): boolean => {
  if (reservation['toDate']) {
    const dateHandler = new DateHandler();
    const dateDiff = dateHandler.getDateDifference(reservation['toDate'], 'day');
    if (reservation['confirmed']  && reservation['active'] && dateDiff > 1 && dateDiff < 10 ) {
      return true;
    }
  }

  return false;
}

export const getCancelPolicy = (reservation: object): object => {
  if (reservation['confirmed'] && !reservation['canceled']) {
    if (Array.isArray(reservation['partnerObj'])) {
      if (reservation['partnerObj'].length) {
        if (parseInt(reservation['partnerObj'][0]['general']['cancelation']) > 0) {
          const dateHandler = new DateHandler();
          const dateDiff = dateHandler.getDateDifference(reservation['fromDate'], 'day');
          if (parseInt(reservation['partnerObj'][0]['general']['cancelation']) + dateDiff < 1 ) {
            return {cancel: true, free: true, days: reservation['partnerObj'][0]['general']['cancelation'] ? parseInt(reservation['partnerObj'][0]['general']['cancelation']) : 0};
          }
          return {cancel: true, free: false, days: reservation['partnerObj'][0]['general']['cancelation'] ? parseInt(reservation['partnerObj'][0]['general']['cancelation']) : 0};
        }
        return {cancel: true, free: false, days: reservation['partnerObj'][0]['general']['cancelation'] ? parseInt(reservation['partnerObj'][0]['general']['cancelation']) : 0};
      }
      return {cancel: true, free: false, days: 0};
    }
    
    return {cancel: true, free: false, days: 0};
  }

  return {cancel: false, free: false, days: 0};
}

const isReservationWithTrilinoCatering = (reservation: object): boolean => {
  if (reservation['confirmed'] && reservation['active']) {
    if (reservation['trilino']) {
      if (reservation['cateringObj']) {
        if (Array.isArray(reservation['cateringObj'])) {
          if (reservation['cateringObj'].length) {
            const dateHandler = new DateHandler();
            const dateDiff = dateHandler.getDateDifference(reservation['fromDate'], 'day');
            if (dateDiff < -7 && reservation['cateringObj'][0]['status'] !== 'paid' && !reservation['cateringObj'][0].hasOwnProperty('transactionId')) {
              return true;
            }
          }
        }
      }
    }
  }

  return false;
}

const setTrilinoPaymentDeadline = (reservation: object): string => {
  if (reservation['confirmed'] && reservation['active']) {
    if (reservation['trilino']) {
      const dateHandler = new DateHandler();
      return dateHandler.getNewDateFor(reservation['fromDate'], 'before', 7, 'text');
    }
  }

  return '-';
}

const setCateringForUserList = (reservation: object): string => {
  const partnerCatering = setCateringString(reservation, reservation['partnerObj'][0]);
  const trilinoCatering = setTrilinoCateringString(reservation);
  const res = `${ partnerCatering === '-' ? '' : partnerCatering + ', '} ${ trilinoCatering === '-' ? '' : trilinoCatering + ', ' }`;

  return res ? res : '-';
}

const setTrilinoCateringString = (reservation: object): string =>{
  let str = '';
  if (reservation['cateringObj']) {
    if (Array.isArray(reservation['cateringObj'])) {
      if (reservation['cateringObj'].length) {
        const dictionary = getLanguage(reservation['partnerObj'][0]['userlanguage']);
        str = getTrilinoCateringString(reservation['cateringObj'][0], dictionary);
      }else{
        str = '-'
      }
    }else{
      str = '-'
    }
  }
  else{
    str = '-'
  }

  return str;
}

const getTrilinoCateringString = (catering: object, dictionary: object): string => {
  let str = '';

  for (let key in catering['content']) {
    const obj = getArrayObjectByFieldValue(products['trilinoCatering'], 'regId', key);
    str = `${str}${str ? ',' : ''} ${obj['name'] + ' x ' + catering['content'][key] + ' ' + dictionary['paymentPartnerEmailCateringPerson']}`;
  }

  return str;
}

const isTrilinoCateringPaid = (reservation: object): boolean => {
  if (reservation['cateringObj']) {
    if (Array.isArray(reservation['cateringObj'])) {
      if (reservation['cateringObj'].length) {
        if (reservation['cateringObj'][0]['status'] === 'paid') {
          return true;
        }
      }
    }
  }

  return false;
}

export const setCateringString = (reservation: object, partner: object): string => {
  let str = '';
  if (reservation['food']) {
    if (Object.keys(reservation['food']).length) {
      const dictionary = getLanguage(partner['userlanguage']);
      Object.keys(reservation['food']).map( key => {
        let i = getArrayIndexByFieldValue(partner['catering']['deals'], 'regId', key);
        if (i !== -1) {
          str = `${str}${str ? ',' : ''} ${dictionary['paymentPartnerEmailCateringDeal'] + (i+1) + ' x ' + reservation['food'][key] + dictionary['paymentPartnerEmailCateringPerson'] }`;
        }
      });
    }else{
      str = '-'
    }
  }else{
    str = '-'
  }

  return str;
}

export const setDecorationString = (reservation: object, partner: object): string => {
  let str = '';
  if (reservation['decoration']) {
    if (Object.keys(reservation['decoration']).length) {
      Object.keys(reservation['decoration']).map( key => {
        const find = getObjectFieldByFieldValue(partner['decoration'], 'regId', key);
        if (find) {
          str = `${str}${str ? ',' : ''} ${generalOptions['decorType'][find['value']]['name_'+partner['userlanguage']]}`;
        }
      });
    }else{
      str = '-';
    }
  }else{
    str = '-';
  }

  return str;
}

export const setAddonString = (reservation: object, partner: object): string => {
  let str = '';
  if (reservation['animation']) {
    if (Object.keys(reservation['animation']).length) {
      Object.keys(reservation['animation']).map( key => {
        const find = getObjectFieldByFieldValue(partner['contentAddon'], 'regId', key);
        if (find) {
          str = `${str}${str ? ',' : ''} ${find['name']}`;
        }
      });
    }else{
      str = '-';
    }
  }else{
    str = '-';
  }

  return str;
}

export const packReservationwithDouble = (arr: Array<object>): object => {
  if (arr.length === 1) {
    return arr[0];
  }

  if (!arr.length) {
    return {};
  }

  if (arr.length > 1) {
    const double = getArrayIndexByFieldValue(arr, 'doubleNumber', 2);
    const single = getArrayIndexByFieldValue(arr, 'doubleNumber', 1);
    const res = JSON.parse(JSON.stringify(arr[single]));
    res['doubleObj'] = arr[double];
    return res;
  }
}

export const getConfirmationUserParams = (data: IemailGeneral): object => {
  const { language, reservation, partner, double } = data;
  const dictionary = getLanguage(language);
  const dateHandler = new DateHandler();

  const roomObj = getArrayObjectByFieldValue(partner['general']['rooms'], 'regId', reservation['room']);

  const params = { 
    title: reservation['confirmed'] ? dictionary['paymentUserEmailTitleTrue'] : dictionary['paymentUserEmailTitleFalse'], 
    reservationTitle: dictionary['paymentUserEmailResSub'], 
    partnerName: `${dictionary['paymentUserEmailPartnerName']} ${partner['name']}`, 
    address: `${dictionary['paymentUserEmailAddress']} ${partner['general']['address']}, ${getGeneralOptionLabelByValue(generalOptions['cities'], partner['city'])}`, 
    date: `${dictionary['paymentUserEmailDate']} ${dateHandler.getDateString(reservation['fromDate'])}, ${reservation['from']} - ${reservation['double'] ? double['to'] : reservation['to']}`, 
    room: `${dictionary['paymentUserEmailRoom']} ${roomObj['name']}`, 
    fullPrice: reservation['confirmed'] ? `${dictionary['paymentUserEmailFullPriceTrue']} ${currencyFormat(reservation['price'] - reservation['deposit'] - reservation['trilinoPrice'])}` : `${dictionary['paymentUserEmailFullPriceFalse']} ${currencyFormat(reservation['price'])}`, 
    deposit: reservation['confirmed'] ? `${dictionary['paymentUserEmailDepositTrue']} ${currencyFormat(reservation['deposit'])}` : `${dictionary['paymentUserEmailDepositFalse']}`, 
    forTrilino: reservation['confirmed'] && reservation['trilino'] ? `${dictionary['paymentUserEmailForTrilinoTrue']} ${currencyFormat(reservation['trilinoPrice'])}` : `${dictionary['paymentUserEmailForTrilinoFalse']}`,
    transactionTitle: dictionary['paymentUserEmailTransSub'], 
    orderId: `${dictionary['paymentUserEmailOrderId']} ${reservation['_id']}`, 
    authCode: `${dictionary['paymentUserEmailAuthCode']} ${reservation['transactionAuthCode']}`, 
    paymentStatus: `${dictionary['paymentUserEmailPaymentStatus']} ${reservation['confirmed'] ? dictionary['paymentUserEmailPaymentStatusTrue'] : dictionary['paymentUserEmailPaymentStatusFalse']}`, 
    transactionId: `${dictionary['paymentUserEmailTransactionId']} ${reservation['transactionId']}`, 
    transactionDate: `${dictionary['paymentUserEmailTransactionDate']} ${reservation['transactionDate']}`, 
    mdStatus: `${dictionary['paymentUserEmailMdStatus']} ${reservation['transactionMdStatus']}`, 
    finish: reservation['confirmed'] ? dictionary['paymentUserEmailFinishTrue'] : dictionary['paymentUserEmailFinishFalse']
  }

  return params;
}

export const getCateringConfirmationParams = (data: IemailGeneral): object => {
  const { language, reservation, catering, partner } = data;
  const dictionary = getLanguage(language);

  const dateHandler = new DateHandler();
  const trilinoDeal = getTrilinoCateringString(catering, dictionary);

  const params = { 
    title: dictionary['emailCateringConfirmationTitle'], 
    text: dictionary['emailCateringConfirmationText'],
    sub: dictionary['emailCateringConfirmationSub'],
    deliveryPartner: `${dictionary['paymentUserEmailPartnerName']} ${partner['name']}`,
    deliveryAddress: `${dictionary['paymentUserEmailAddress']} ${partner['general']['address']}, ${getGeneralOptionLabelByValue(generalOptions['cities'], partner['city'])}`,
    deliveryTime: `${dictionary['emailCateringConfirmationTime']} ${dateHandler.getDateString(reservation['fromDate'])}, ${reservation['from']}`,
    deal: `${dictionary['emailCateringConfirmationDeal']} ${trilinoDeal}`,
    price: `${dictionary['emailCateringConfirmationPrice']} ${currencyFormat(catering['price'])}`,
    orderId: `${dictionary['paymentUserEmailOrderId']} ${catering['_id']}`, 
    authCode: `${dictionary['paymentUserEmailAuthCode']} ${catering['transactionAuthCode']}`, 
    paymentStatus: `${dictionary['paymentUserEmailPaymentStatus']} ${dictionary['paymentUserEmailPaymentStatusTrue']}`, 
    transactionId: `${dictionary['paymentUserEmailTransactionId']} ${catering['transactionId']}`, 
    transactionDate: `${dictionary['paymentUserEmailTransactionDate']} ${catering['transactionDate']}`, 
    mdStatus: `${dictionary['paymentUserEmailMdStatus']} ${catering['transactionMdStatus']}`, 
    finish: dictionary['emailCateringConfirmationFinish']
  };

  return params;
}

export const getServerHost = (host: string): string => {

  if (host === 'dev.trilino.com' || host.indexOf('trilino-dev') !== -1 || host === 'www.dev.trilino.com') {
   return 'dev';
  }

  if (host === 'test.trilino.com' || host.indexOf('trilino-test') !== -1 || host === 'www.test.trilino.com') {
    return 'test';
  }

  if (host === 'trilino.com' || host.indexOf('trilino-prod') !== -1 || host === 'www.trilino.com') {
    return 'prod';
  }

  return 'local';
}

export const generalizeRating = (rating: object): object => {
  const newObj = JSON.parse(JSON.stringify(rating['rating']));
  const result = {rating: newObj, comment: rating['comment']};

  return result;
}

export const mergeRating = (newRate: object, oldRate: object, user: string): object => {
  const result = {};
  const dateHandler = new DateHandler();

  for (let key in newRate['rating']) {
    result[key] = parseInt(newRate['rating'][key]) + oldRate[key];
  }

  if (newRate['comment'].length > 3) {
    if (oldRate['comment']) {
      oldRate['comment'].push({text: newRate['comment'], user, date: dateHandler.getDateString()  });
    }else{
      result['comment'] = [{text: newRate['comment'], user, date: dateHandler.getDateString()  }];
    }
  }

  if (oldRate['comment']) {
    result['comment'] = oldRate['comment'];
  }
  
  

  return result;
}

export const setRating = (rating: object, user: string): object => {
  const newObj = JSON.parse(JSON.stringify(rating['rating']));

  for (let key in newObj) {
    newObj[key] = parseInt(newObj[key]);
  }

  if (rating['comment'].length > 3) {
    const dateHandler = new DateHandler();
    newObj['comment'] = [{text: rating['comment'], user, date: dateHandler.getDateString() }];
  }

  return newObj;
}

export const sumOfRatingMarks = (rating: object): number => {
  let gen = 0;
  for (let key in rating) {
    if (key !== 'comment') {
      gen = gen + rating[key];
    }
  }

  return gen;
}