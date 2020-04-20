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
			name: 'Trilino Gold',
			price: 695,
			min: 10,
			items: [
				'kanapei sa pesto sosom, pršutom, mozzarelom i paradajzom',
				'kanapei sa chorizom na krem namazu',
				'kanapei sa gorgonzolom, orahom i grožđem',
				'kanapei sa paradajzom i svežim bosiljkom',
				'tanjir srpske zakuske (pršuta, sirevi)',
				'pite (meso, povrće, sir, spanać, pečurke)',
				'suve šljive punjene bademom rolovane slaninom',
				'koktel roštilj (rolovani pileći file, ćevapi, uštipci, kobasice)',
				'svinjski file u sosu od pečuraka',
				'italijanska lazanja',
				'pileći fingersi sa lešnicima i susamom i tartar sos',
				'aromatizovane kriške krompira',
				'krofnice od sira',
				'mimoza salata',
				'pileća mozaik salata',
				'grčka salata',
				'mini kajzerice i bavarske kifle'
			],
			regId: '0000000000001',
		},

		{
			type: '3',
			name: 'Trilino Platinum',
			price: 990,
			min: 10,
			items: [
				'brusketi sa pesto sosom, paradajzom, pršutom, mozzarelom',
				'kanapei na pereci sa chorizzom, ajvarom i belim sirom',
				'kanapei na pereci sa domaćom pilećom paštetom i brusnicom',
				'avocado pasta sa tortiljom servirana u čašama',
				'spring rolls sa kineskim povrćem i sosom',
				'pohovane tikvice, pohovani celer, tartar sos, povrće žilijen',
				'pileći file u kari sosu',
				'slow cooking jagnjeći pikljevi',
				'biftek welington',
				'pačiji file u sosu od višanja sa uštipcima od heljdinog brašna',
				'punjene lignje',
				'kroketi',
				'krompir iz rerne sa kajmakom',
				'paradajz sa mozzrelom I pesto sosom',
				'baby mix salata sa karameizovanim orasima i jabukama',
				'salata sa hobotnicom',
				'cezar salata servirana u čašama',
				'mini kajzerice i bavarske kifle',
			],
			regId: '0000000000002',
		},
	]
}

export default products;