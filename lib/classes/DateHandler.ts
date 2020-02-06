

export default class DateHandler {
	private date: Date;
	private now: Date;
	private dateString: string;
	
	constructor(start: string | string[] = '') {
		this.date = new Date();
		this.now = new Date();
		this.dateString = start as string;
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
		
		if (timeDiff < 0 || timeDiff > 200) {
			return false;
		}

		return true;
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

	private setDateForServer = (): void => {
	  const strings = this.dateString.split('-')
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

	private getServerDateString = () => {
		this.setDateForServer();

		return this.date.toISOString().substring(0,19);
	}
}