export const momentLocalize = (moment: any, locale: string): object => {
	if (locale === 'sr') {
		moment.locale('sr');
	}

    if (locale === 'en') {
        moment.locale('en');
    }

	return moment;
}
 
export const getLocalMessages = (lang: string): object =>{
    if (lang === 'sr') {
        return {
          allDay: 'Ceo dan',
          previous: 'Nazad',
          next: 'Napred',
          today: 'Danas',
          month: 'Mesec',
          week: 'Nedelja',
          day: 'Dan',
          agenda: 'Lista',
          date: 'Datum',
          time: 'Vreme',
          event: 'Događaj',
        };
    }

    if (lang === "en") {
        return {
          allDay: 'All day',
          previous: 'Previous',
          next: 'Next',
          today: 'Today',
          month: 'Month',
          week: 'Week',
          day: 'Day',
          agenda: 'Agenda',
          date: 'Date',
          time: 'Time',
          event: 'Event',
        };
    }
}