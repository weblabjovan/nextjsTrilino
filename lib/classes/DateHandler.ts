

export default class DateHandler {
	private date: Date;
	private now: Date;
	private dateString: string;
	
	constructor(start: string | string[] = '') {
		this.date = new Date();
		this.now = new Date();
		this.dateString = start as string;
	}

	public getDateWithTimeForServer = (time: string): Date => {
		this.setDateForServer('code');
		this.setDayOnSpecificTime(time);

		return this.date;
	}

	public isUrlDateValidDateString = (): boolean => {
		if (!this.dateString) {
			return false;
		}

		const split = this.dateString.split('-');
		if (parseInt(split[0]) === NaN || parseInt(split[0]) > 31) {
			return false;
		}
		if (parseInt(split[1]) === NaN || parseInt(split[1]) > 12 || (parseInt(split[1]) - 1) < this.date.getMonth() ) {
			return false;
		}
		if (parseInt(split[2]) === NaN || parseInt(split[2]) < this.date.getFullYear() || parseInt(split[2]) > this.date.getFullYear() + 1) {
			return false;
		}

		this.setDateForServer();
		const begining = this.setDayOnBegining(this.now);
		const timeDiff = (this.date.getTime() - begining.getTime()) / (1000 * 60 * 60);
		
		if (timeDiff < 0 || timeDiff > (180 * 24)) {
			return false;
		}

		return true;
	}

	public getDateDifferenceFromNow = (scale: null | string = null): number => {
		let devider = (1000 * 60 * 60);
		if (scale === 'minute') {
			devider = (1000 * 60);
		}
		if (scale === 'day') {
			devider = (1000 * 60 * 60 * 24);
		}

		const begining = this.setDayOnBegining(this.now);
		const timeDiff = (this.date.getTime() - begining.getTime()) / devider;

		return timeDiff;
	}

	public setDateTimeFromUrl = (time?: string): void => {
		this.setDateForServer();
		if (time) {
			this.setDayOnSpecificTime(time);
		}
	}

	public getDateForServer = (): Date => {
		this.setDateForServer();
		return this.date;
	}

	public getDayFromDate = (): string => {
		const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
		this.setDateForServer();

  		return days[this.date.getDay()];
	}

	public formatDateString = (type: string): string => {
		if (type === 'server') {
			return this.getServerDateString();
		}
	}

	public addHours = (time: string | string[], hours: number): Date => {
		this.resetDate();
		const strTime = time as string;
		this.setDayOnSpecificTime(strTime);
		this.addTime(hours, 'hours');
		return this.date;
	}

	public getStringDatePart = (part: string, date?: Date): string => {
		let str = this.date.toISOString();
		if (date) {
			str = date.toISOString();
		}

		if (part === 'time') {
			return str.substring(11,16);
		}

		return str.substring(0,19);
	}

	private addTime = (time: number, format: string): void => {
		const additor = format === 'hours' ? (60*60*1000) : (60*1000);
		const date = this.date.getTime() + (time*additor);
		const res = new Date(date);

		this.date = res;
	}

	private setDateForServer = (origin?: string): void => {
		let strings = this.dateString.split('-')
		if (origin === 'code') {
			const first = this.dateString.split('T');
			const sec = first[0].split('-');
			strings = [sec[2], sec[1], sec[0]]
		}

		const d = new Date();
		d.setFullYear(parseInt(strings[2]));
		d.setMonth(parseInt(strings[1])-1);
		d.setDate(parseInt(strings[0]));

	  	this.date = this.setDayOnBegining(d);
	}

	private resetDate = (): void => {
		this.date = new Date();
	}

	private setDayOnBegining = (date: Date): Date => {
		const d = new Date(date.getTime());
		d.setUTCHours(0);
	  d.setMinutes(0);
	  d.setSeconds(0);
	  d.setMilliseconds(0);

	  return d;
	}

	private setDayOnSpecificTime = (time: string): void => {
		const split = time.split(':');

		this.date.setUTCHours(parseInt(split[0]))
		this.date.setMinutes(parseInt(split[1]))
		this.date.setSeconds(0);
	  	this.date.setMilliseconds(0);
	}

	private getServerDateString = () => {
		this.setDateForServer();

		return this.date.toISOString().substring(0,19);
	}
}