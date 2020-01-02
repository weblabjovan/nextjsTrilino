import jwt from 'jsonwebtoken';
import Keys from '../keys';
import LinkClass from '../../lib/classes/Link';

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
  if (type === 'partner') {
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