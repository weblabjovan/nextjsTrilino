import { calculateActivationProcess } from './specificPartnerFunctions';


export const decoratePartners = (partners: Array<object>): Array<object> => {
	for (var i = 0; i < partners.length; ++i) {
		addActivationPercent(partners[i]);
	}

	return partners;
}

export const addActivationPercent = (partner: object): object => {
	partner['activationPercent'] = calculateActivationProcess(partner);

	return partner;
}

export const changePartnerListItem = (partner: object, list: Array<object>): Array<object> => {
	for (var i = 0; i < list.length; ++i) {
		if (partner['_id'] === list[i]['_id']) {
			list[i] = addActivationPercent(partner);
			break;
		}
	}

	return list;
}

export const findPartnerFromTheList = (partnerId: string, list: Array<object>): object | null => {
	for (var i = 0; i < list.length; ++i) {
		if (list[i]['_id'] === partnerId) {
			return list[i];
		}
	}

	return null;
}

export const getPhotoNumbers = (partner: object): object => {
	const numArr = [];
	let largest = 1;
	if (partner['photos']) {
		if (Array.isArray(partner['photos'])) {
			for (var i = 0; i < partner['photos'].length; ++i) {
				const config = partner['photos'][i]['name'].split('/');
				numArr.push(parseInt(config[1].substr(5)));
			}
		}
	}

	if (numArr.length) {
		largest = Math.max(...numArr) + 1;
	}

	return {numArr, largest};
}

export const setUpPhotosForSave = (partner: object, photoName: string): Array<object> => {
	const newPartner = {... partner};
	if (newPartner['photos']) {
		newPartner['photos'].push({name: photoName, main: false, selection: false});
	}else{
		newPartner['photos'] = [{name: photoName, main: false, selection: false}];
	}

	return newPartner['photos'];
}

export const getPartnerMainPhoto = (partner: object): null | object => {
	if (partner['photos']) {
		if (Array.isArray(partner['photos'])) {
			for (var i = 0; i < partner['photos'].length; ++i) {
				if (partner['photos'][i]['main']) {
					return partner['photos'][i];
				}
			}
		}
	}

	return null;
}

export const getNumberOfPartnerSelectionPhotos = (partner: object): number => {
	let num = 0;

	if (partner['photos']) {
		if (Array.isArray(partner['photos'])) {
			for (var i = 0; i < partner['photos'].length; ++i) {
				if (partner['photos'][i]['selection']) {
					num = ++num;
				}
			}
		}
	}

	return num;
}

export const setPhotosForDelete = (photos: Array<object>, photo: string): Array<object> => {
	const list = [...photos];
	let index = -1;
	for (var i = 0; i < list.length; ++i) {
		if (list[i]['name'] === photo) {
			index = i;
			break
		}
	}

	if (index > -1) {
		list.splice(index, 1);
	}

	return list;
}