import jwt from 'jsonwebtoken';
import Keys from '../keys';

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

export const setToken = async (type: string, id: string): Promise<object> => {
  let token = {};
  const resolveKeys = await Keys;
  const myKeys = resolveKeys.default;

  if (type === 'partner') {
    token = jwt.sign({
      iss: 'Trilino',
      sub: id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 7),
    }, myKeys['JWT_SECRET']);
  }

  return token;
}

export const verifyToken = async (value: string): Promise<object> => {
  const resolveKeys = await Keys;
  const myKeys = resolveKeys.default;

  const token = jwt.verify(value, myKeys['JWT_SECRET']);

  return token;
}