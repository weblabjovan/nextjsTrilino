interface IGenOptions {
	itemDuration_sr: Array<object>;
	itemDuration_en: Array<object>;
	cities: Array<object>;
	ages: Array<object>;
	times: Array<object>;
	dual_en: Array<object>;
	dual_sr: Array<object>;
	cancel_en: Array<object>;
	cancel_sr: Array<object>;
	firstDeca: Array<object>;
  spaceType_sr: Array<object>;
  spaceType_en: Array<object>;
}

const generalOptions: IGenOptions = {
	itemDuration_sr: [
      { value: '2', label: '2 sata' },
      { value: '2.5', label: '2,5 sata' },
      { value: '3', label: '3 sata' }
    ],
    itemDuration_en: [
      { value: '2', label: '2 hours' },
      { value: '2.5', label: '2,5 hours' },
      { value: '3', label: '3 hours' }
    ],
    cities: [
      { value: '1', label: 'Beograd' },
      { value: '2', label: 'Novi Sad' },
      { value: '3', label: 'Niš' }
    ],
    spaceType_sr:[
      { value: '1', label: 'Igraonica' },
      { value: '2', label: 'Restoran' },
      { value: '3', label: 'Kafić' },
      { value: '4', label: 'Sportski objekat' },
      { value: '5', label: 'Ostalo' }
    ],
    spaceType_en:[
      { value: '1', label: 'Playroom' },
      { value: '2', label: 'Restaurant' },
      { value: '3', label: 'Cafe' },
      { value: '4', label: 'Sport facility' },
      { value: '5', label: 'Other' }
    ],
    ages: [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' },
      { value: '5', label: '5' },
      { value: '6', label: '6' },
      { value: '7', label: '7' },
      { value: '8', label: '8' },
      { value: '9', label: '9' },
      { value: '10', label: '10' },
      { value: '11', label: '11' },
      { value: '12', label: '12' },
      { value: '13', label: '13' },
      { value: '14', label: '14' },
      { value: '15', label: '15' },
      { value: '16', label: '16' },
      { value: '17', label: '17' },
      { value: '18', label: '18' },
    ],
    times: [
      { value: '7:00', label: '7:00' },
      { value: '7:30', label: '7:30' },
      { value: '8:00', label: '8:00' },
      { value: '8:30', label: '8:30' },
      { value: '9:00', label: '9:00' },
      { value: '9:30', label: '9:30' },
      { value: '10:00', label: '10:00' },
      { value: '10:30', label: '10:30' },
      { value: '11:00', label: '11:00' },
      { value: '11:30', label: '11:30' },
      { value: '12:00', label: '12:00' },
      { value: '12:30', label: '12:30' },
      { value: '13:00', label: '13:00' },
      { value: '13:30', label: '13:30' },
      { value: '14:00', label: '14:00' },
      { value: '14:30', label: '14:30' },
      { value: '15:00', label: '15:00' },
      { value: '15:30', label: '15:30' },
      { value: '16:00', label: '16:00' },
      { value: '16:30', label: '16:30' },
      { value: '17:00', label: '17:00' },
      { value: '17:30', label: '17:30' },
      { value: '18:00', label: '18:00' },
      { value: '18:30', label: '18:30' },
      { value: '19:00', label: '19:00' },
      { value: '19:30', label: '19:30' },
      { value: '20:00', label: '20:00' },
      { value: '20:30', label: '20:30' },
      { value: '21:00', label: '21:00' },
      { value: '21:30', label: '21:30' },
      { value: '22:00', label: '22:00' },
      { value: '22:30', label: '22:30' },
      { value: '23:00', label: '23:00' },
      { value: '', label: '-' }
    ],
    dual_en: [
      { value: '1', label: 'Yes' },
      { value: '2', label: 'No' }
    ],
    dual_sr: [
      { value: '1', label: 'Da' },
      { value: '2', label: 'Ne' }
    ],
    cancel_en: [
      { value: '7', label: '7 days before reservation' },
      { value: '15', label: '15 days before reservation' },
      { value: '30', label: '30 days before reservation' }
    ],
    cancel_sr: [
      { value: '7', label: '7 dana pre rezervacije' },
      { value: '15', label: '15 dana pre rezervacije' },
      { value: '30', label: '30 dana pre rezervacije' }
    ],
    firstDeca: [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' },
      { value: '5', label: '5' },
    ],
}

export default generalOptions;