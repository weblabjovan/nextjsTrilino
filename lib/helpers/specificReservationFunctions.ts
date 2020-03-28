import DateHandler from '../classes/DateHandler';
import { setUpLinkBasic } from './generalFunctions';

const dayForSearch = (date: Date): string => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  return days[date.getDay()];
}

export const preparePartnerForLocation = (rooms: Array<object>, reservations: Array<object>, date: Date): object => {
  const day = dayForSearch(date);
  let freeTerms = [];
  if (!reservations.length) {
    freeTerms = JSON.parse(JSON.stringify(rooms));
    for (var i = 0; i < freeTerms.length; ++i) {
      freeTerms[i]['terms'] = freeTerms[i]['terms'][day].filter( term => { if (term.hasOwnProperty('from')) { return term; }});
    }
  }else{
    freeTerms = JSON.parse(JSON.stringify(rooms));
    for (var i = 0; i < freeTerms.length; ++i) {
      freeTerms[i]['terms'] = matchReservationsWithTerms(reservations, freeTerms[i]['terms'][day], freeTerms[i]['regId']);
    }
  }


  return freeTerms;
}

const matchReservationsWithTerms = (reservations: Array<object>, terms:Array<object>, room: string): Array<object> => {
  const reser = JSON.parse(JSON.stringify(reservations));
  const result = [];
  for (var i = 0; i < terms.length; ++i) {
    if (terms[i]['from']) {
      const reservIndex = isInReservationArray(reser, room, terms[i]['from'], terms[i]['to']);
      if (reservIndex === -1 ) {
        result.push(terms[i]);
      }
    }
  }

  return result;
}

const isInReservationArray = (reservations: Array<object>, room: string, from: string, to: string): number => {
  for (var i = 0; i < reservations.length; ++i) {
    if (reservations[i]['room'] === room && reservations[i]['to'] === to && reservations[i]['from'] === from) {
      return i;
    }
  }

  return -1;
}

export const isDateDifferenceValid = (difference: number, date: string, time: string): boolean => {
  const dateHandler = new DateHandler(date);
  dateHandler.setDateTimeFromUrl(time);

  if (dateHandler.getDateDifferenceFromNow('hour') > difference) {
    return true;
  }

  return false;
}

export const getSingleReservation = async (context: any): Promise<any> => {
  const link = setUpLinkBasic({path: context.asPath, host: context.req.headers.host});
  const apiUrl = `${link["protocol"]}${link["host"]}/api/reservations/getOne/?language=${link['queryObject']['language']}&id=${link['queryObject']['reservation']}`;
  const response = await fetch(apiUrl);

  return response;
}

export const isPaymentResponseValid = (response: object, id: string, req: object): boolean => {
  if (Object.keys(response).length) {
    const outcome = response['Response'];
    if (response['ReturnOid'] === id && response['hashAlgorithm'] === 'ver2' && response['storetype'] === '3d_pay_hosting' && req['headers']['sec-fetch-site'] === 'cross-site' && req['method'] === 'POST') {
      const split = response['HASHPARAMSVAL'].split('|');
      if (split[1] === id && split[4] === outcome) {
        return true;
      }
    }
    return false;
  }else{
    if (req['headers']['sec-fetch-site'] === 'cross-site' && req['method'] === 'GET') {
      return true;
    }
    
  }

  return false;
}