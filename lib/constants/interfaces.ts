export interface IpartnerModel{
	name: string;
	taxNum: number;
	city: string;
	country: string;
	contactPerson: string;
	contactEmail: string;
	contactPhone: string;
	password?: string | null;
	verified: boolean;
	created: Date;
}

export interface IlinkClass {
	getParsedUrl(): object;
}

interface IpartnerDayTerms{
	from: string;
	to: string;
	price: number | null;
}

interface IpartnerWeekTerms{
	monday: Array<IpartnerDayTerms>;
	tuesday: Array<IpartnerDayTerms>;
	wednesday: Array<IpartnerDayTerms>;
	thursday: Array<IpartnerDayTerms>;
	friday: Array<IpartnerDayTerms>;
	saturday: Array<IpartnerDayTerms>;
	sunday: Array<IpartnerDayTerms>;
}

export interface IpartnerRoomItem {
	name: string;
	size: number | null; 
	capKids: number | null;
	capAdults: number | null;
	terms: IpartnerWeekTerms;
}

export interface IpartnerGeneral {
	size: number | null;
	playSize: number | null;
	description: string;
	address: string;
	spaceType: string | object;
	quarter: string | object;
	ageFrom: string | object;
	ageTo: string | object;
	mondayFrom: string | object;
	mondayTo: string | object;
	tuesdayFrom: string | object;
	tuesdayTo: string | object;
	wednesdayFrom: string | object;
	wednesdayTo: string | object;
	thursdayFrom: string | object;
	thursdayTo: string | object;
	fridayFrom: string | object;
	fridayTo: string | object;
	saturdayFrom: string | object;
	saturdayTo: string | object;
	sundayFrom: string | object;
	sundayTo: string | object;
	parking: string | object;
	yard: string | object;
	balcon: string | object;
	pool: string | object;
	wifi: string | object;
	animator: string | object;
	movie: string | object;
	gaming: string | object;
	food: string | object;
	drink: string | object;
	cake: string | object;
	selfFood: string | object;
	selfDrink: string | object;
	selfCake: string | object;
	duration: string | object;
	cancelation: string | object;
	smoking: string | object;
	selfAnimator: string | object;
	roomNumber: string | object;
}

interface IdrinkCardItem {
	name: string;
	price: string;
	quantity: string;
	scale: string;
	type: string;
}

interface IdealsItem {
	price: string;
	type: string | object;
	min: null | number;
	currentItem: string;
	items: Array<string>;
}

export interface IpartnerCatering {
	drinkCard: Array<IdrinkCardItem>;
	deals: Array<IdealsItem>;
}

interface IdecoItem {
	check: boolean;
	name_sr: string;
	name_en: string;
	value: number | string;
	price: number | string;
}

export interface IpartnerDecoration {
	'1': IdecoItem;
	'2': IdecoItem;
	'3': IdecoItem;
	'4': IdecoItem;
}