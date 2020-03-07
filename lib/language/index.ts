import serbian from './serbian';
import english from './english';

export const getLanguage = (lang: string): object =>{
	if (lang === 'sr') {
		return serbian;
	}

	if (lang === 'en') {
		return english;
	}
}
