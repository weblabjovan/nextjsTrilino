interface ICateringItem {
	type: string;
	name: string;
	price: number;
	min: number;
	items: Array<string>;
	regId: string;
}


interface IProdOptions {
  trilinoCatering: Array<ICateringItem>;
}


const products: IProdOptions = {
	trilinoCatering:[
		{
			type: '3',
			name: 'Trilino lux',
			price: 1500,
			min: 20,
			items: [
				'sendviči',
				'kolačići',
				'pileća krilca',
				'cezar salata',
				'ćevapi',
				'pljeskavica',
				'rolovano belo',
				'rolovana džigerica',
				'coca cola',
				'fanta',
				'sok od pomorandže',
				'itd itd itd'
			],
			regId: '0000000000001',
		},

		{
			type: '3',
			name: 'Trilino regular',
			price: 1000,
			min: 20,
			items: [
				'sendviči 1',
				'kolačići 1',
				'pileća krilca',
				'cezar salata',
				'ćevapi',
				'pljeskavica',
				'rolovano belo',
				'rolovana džigerica',
				'coca cola',
				'fanta',
				'sok od pomorandže',
				'itd itd itd'
			],
			regId: '0000000000002',
		},
	]
}

export default products;