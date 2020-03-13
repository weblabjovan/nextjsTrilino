interface IGenOptions {
  searchSortOptions_sr: Array<object>;
  searchSortOptions_en: Array<object>;
	itemDuration_sr: Array<object>;
	itemDuration_en: Array<object>;
	cities: Array<object>;
	ages: Array<object>;
  prices: Array<object>;
	times: Array<object>;
	dual_en: Array<object>;
	dual_sr: Array<object>;
	cancel_en: Array<object>;
	cancel_sr: Array<object>;
	firstDeca: Array<object>;
  spaceType_sr: Array<object>;
  spaceType_en: Array<object>;
  contentOfferForSearch: Array<number>;
  contentOffer_sr: Array<object>;
  contentOffer_en: Array<object>;
  drinkScale: Array<object>;
  drinkType_sr: Array<object>;
  drinkType_en: Array<object>;
  dealType_sr: Array<object>;
  dealType_en: Array<object>;
  percentage: Array<object>;
  depositType_sr: Array<object>;
  depositType_en: Array<object>;
  decorType: object;
  quarter: object;
  phoneCodes: Array<object>;
  partnerGeneralStructure: object;
}

const generalOptions: IGenOptions = {
  searchSortOptions_sr: [
    { value: '1', label: 'Sortiraj po popularnosti' },
    { value: '2', label: 'Sortiraj po ceni uzlazno' },
    { value: '3', label: 'Sortiraj po ceni silazno' },
    { value: '4', label: 'Sortiraj po ocenama' },
  ],
  searchSortOptions_en: [
    { value: '1', label: 'Sort by popularity' },
    { value: '2', label: 'Sort by price low' },
    { value: '3', label: 'Sort by price high' },
    { value: '4', label: 'Sort by ranking' },
  ],
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
      { value: '1', label: 'Beograd' }
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
    prices:[
      { value: '4000', label: '4000' },
      { value: '5000', label: '5000' },
      { value: '6000', label: '6000' },
      { value: '7000', label: '7000' },
      { value: '8000', label: '8000' },
      { value: '9000', label: '9000' },
      { value: '10000', label: '10000' },
      { value: '11000', label: '11000' },
      { value: '12000', label: '12000' },
      { value: '13000', label: '13000' },
      { value: '14000', label: '14000' },
      { value: '15000', label: '15000' },
      { value: '16000', label: '16000' },
      { value: '17000', label: '17000' },
      { value: '18000', label: '18000' },
      { value: '19000', label: '19000' },
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
      { value: '-1', label: '-' }
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
      { value: '0', label: 'Cancelation is not allowed' },
      { value: '15', label: '15 days before reservation' },
      { value: '30', label: '30 days before reservation' }
    ],
    cancel_sr: [
      { value: '0', label: 'Otkazivanj nije dozvoljeno' },
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
    contentOfferForSearch:[
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13, 18, 22, 23, 26, 30, 31, 33, 34, 37
    ],
    contentOffer_sr: [
      {value: '1', label: 'Lavirint'},
      {value: '2', label: 'Mini teren za fudbal'},
      {value: '3', label: 'Mini teren za košarku'},
      {value: '4', label: 'Face painting'},
      {value: '5', label: 'Limbo dance'},
      {value: '6', label: 'Trampolina'},
      {value: '7', label: 'Drvene kućice'},
      {value: '8', label: 'Kvizovi znanja'},
      {value: '9', label: 'Dečija diskoteka'},
      {value: '10', label: 'Karaoke'},
      {value: '11', label: 'Laser tag'},
      {value: '12', label: 'Penjalice'},
      {value: '13', label: 'Tobogani'},
      {value: '14', label: 'Zid za penjanje'},
      {value: '15', label: 'Baby kutak'},
      {value: '16', label: '3D lavirint'},
      {value: '17', label: 'Predstave za decu'},
      {value: '18', label: 'Balončići od sapunice'},
      {value: '19', label: 'Veštački sneg'},
      {value: '20', label: 'Klovnovi'},
      {value: '21', label: 'PlayStation konzola'},
      {value: '22', label: 'Nintendo WII konzola'},
      {value: '23', label: 'Lijane'},
      {value: '24', label: 'Guralice'},
      {value: '25', label: 'Lutke za decu'},
      {value: '26', label: 'Vozila na pedale'},
      {value: '27', label: 'Vozila na guranje'},
      {value: '28', label: 'Radionice za decu'},
      {value: '29', label: 'X box konzola'},
      {value: '30', label: 'Takmičenja za decu'},
      {value: '31', label: 'Stoni fudbal'},
      {value: '32', label: 'Vazdušni hokej'},
      {value: '33', label: 'Fliperi'},
      {value: '34', label: 'Bilijar'},
      {value: '35', label: 'Bazen za bebe'},
      {value: '36', label: 'Mađioničar'},
      {value: '37', label: 'Video igrice'},
      {value: '38', label: 'Kostimi za maskembal'},
      {value: '39', label: 'Dvorac za skakanje'},
      {value: '40', label: 'Disko kugla'},
      {value: '41', label: 'Kinetički pesak'},
      {value: '42', label: 'Plastelin'},
      {value: '43', label: 'Bojanke i bojice'},
      {value: '44', label: 'Mini kuhinja'},
      {value: '45', label: 'Pikado'},
      {value: '46', label: 'Bubble fudbal'},
      {value: '47', label: 'Bazen sa lopticama'},
      {value: '48', label: 'Lego kocke'},
    ],
    contentOffer_en: [
      {value: '1', label: 'Lavirint'},
      {value: '2', label: 'Mini footbal court'},
      {value: '3', label: 'Mini basketball court'},
      {value: '4', label: 'Face painting'},
      {value: '5', label: 'Limbo dance'},
      {value: '6', label: 'Trampolina'},
      {value: '7', label: 'Wooden houses'},
      {value: '8', label: 'Quiz'},
      {value: '9', label: 'Kid disco'},
      {value: '10', label: 'Karaoke'},
      {value: '11', label: 'Laser tag'},
      {value: '12', label: 'Penjalice'},
      {value: '13', label: 'Tobogani'},
      {value: '14', label: 'Zid za penjanje'},
      {value: '15', label: 'Baby kutak'},
      {value: '16', label: '3D lavirint'},
      {value: '17', label: 'Predstave za decu'},
      {value: '18', label: 'Balončići od sapunice'},
      {value: '19', label: 'Veštački sneg'},
      {value: '20', label: 'Klovnovi'},
      {value: '21', label: 'PlayStation konzola'},
      {value: '22', label: 'Nintendo WII konzola'},
      {value: '23', label: 'Lijane'},
      {value: '24', label: 'Guralice'},
      {value: '25', label: 'Lutke za decu'},
      {value: '26', label: 'Vozila na pedale'},
      {value: '27', label: 'Vozila na guranje'},
      {value: '28', label: 'Kreativne radionice za decu'},
      {value: '29', label: 'X box konzola'},
      {value: '30', label: 'Sportska takmičenja za decu'},
      {value: '31', label: 'Stoni fudbal'},
      {value: '32', label: 'Vazdušni hokej'},
      {value: '33', label: 'Fliperi'},
      {value: '34', label: 'Bilijar'},
      {value: '35', label: 'Bazen za bebe'},
      {value: '36', label: 'Mađioničar'},
      {value: '37', label: 'Video igrice'},
      {value: '38', label: 'Kostimi za maskembal'},
      {value: '39', label: 'Dvorac za skakanje'},
      {value: '40', label: 'Disko kugla'},
      {value: '41', label: 'Kinetički pesak'},
      {value: '42', label: 'Plastelin'},
      {value: '43', label: 'Bojanke i bojice'},
      {value: '44', label: 'Mini kuhinja'},
      {value: '45', label: 'Pikado'},
      {value: '46', label: 'Bubble fudbal'},
      {value: '47', label: 'Bazen sa lopticama'},
      {value: '48', label: 'Lego kocke'},
    ],
    drinkScale: [
      {value: '1', label: 'ml'},
      {value: '2', label: 'dl'},
      {value: '3', label: 'l'},
    ],
    drinkType_sr: [
      {value: '1', label: 'Bezalkoholna pića'},
      {value: '2', label: 'Alkoholna pića'},
      {value: '3', label: 'Topli napitci'},
    ],
    drinkType_en: [
      {value: '1', label: 'Non alcoholic drinks'},
      {value: '2', label: 'Alcoholic drinks'},
      {value: '3', label: 'Hot drinks'},
    ],
    dealType_sr: [
      {value: '1', label: 'Za decu'},
      {value: '2', label: 'Za odrasle'},
      {value: '3', label: 'Za decu i odrasle'},
    ],
    dealType_en: [
      {value: '1', label: 'For kids'},
      {value: '2', label: 'For adults'},
      {value: '2', label: 'For kind and adults'},
    ],
    percentage: [
      {value: 10, label: '10%'},
      {value: 20, label: '20%'},
      {value: 30, label: '30%'},
      {value: 40, label: '40%'},
      {value: 50, label: '50%'},
      {value: 60, label: '60%'},
      {value: 70, label: '70%'},
      {value: 80, label: '80%'},
      {value: 90, label: '90%'},
      {value: 100, label: '100%'},
    ],
    depositType_sr: [
      {value: '1', label: 'Pun iznos rezervacije'},
      {value: '2', label: 'Iznos termina'},
    ],
    depositType_en: [
      {value: '1', label: 'Full reservation price'},
      {value: '2', label: 'Term price'},
    ],
    decorType: {
      '1': {name_sr: 'baloni', name_en: 'balloons'},
      '2': {name_sr: 'konfete', name_en: 'confetti'},
      '3': {name_sr: 'prskalice', name_en: 'spargers'},
      '4': {name_sr: 'trake', name_en: 'bands'},
    },
    quarter: {
      '1':[
        {value: '1', label: 'Čukarica'},
        {value: '2', label: 'Novi Beograd'},
        {value: '3', label: 'Palilula'},
        {value: '4', label: 'Rakovica'},
        {value: '5', label: 'Savski venac'},
        {value: '6', label: 'Stari grad'},
        {value: '7', label: 'Voždovac'},
        {value: '8', label: 'Vračar'},
        {value: '9', label: 'Zemun'},
        {value: '10', label: 'Zvezdara'},
        {value: '11', label: 'Barajevo'},
        {value: '12', label: 'Grocka'},
        {value: '13', label: 'Lazarevac'},
        {value: '14', label: 'Mladenovac'},
        {value: '15', label: 'Obrenovac'},
        {value: '16', label: 'Sopot'},
        {value: '17', label: 'Surčin'},
      ],
    },
    phoneCodes: [
      {value: '381', label: 'RS +381'},
      {value: '382', label: 'CG +382'},
      {value: '387', label: 'BH +387'},
      {value: '389', label: 'MK +389'},
      {value: '385', label: 'HR +385'},
      {value: '386', label: 'SI +386'},
      {value: '43', label: 'AT +43'},
      {value: '49', label: 'DE +49'},
    ],
    partnerGeneralStructure: {
    size: null,
    playSize: null,
    description: '',
    address: '',
    spaceType: '',
    ageFrom: '',
    ageTo: '',
    mondayFrom: '',
    mondayTo: '',
    tuesdayFrom: '',
    tuesdayTo: '',
    wednesdayFrom: '',
    wednesdayTo: '',
    thursdayFrom: '',
    thursdayTo: '',
    fridayFrom: '',
    fridayTo: '',
    saturdayFrom: '',
    saturdayTo: '',
    sundayFrom: '',
    sundayTo: '',
    parking: '',
    yard: '',
    balcon: '',
    pool: '',
    wifi: '',
    animator: '',
    movie: '',
    gaming: '',
    food: '',
    drink: '',
    cake: '',
    selfFood: '',
    selfDrink: '',
    selfCake: '',
    smoking: '',
    selfAnimator: '',
    duration: '',
    cancelation: '',
    roomNumber: '',
  },
}

export default generalOptions;