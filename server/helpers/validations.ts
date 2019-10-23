import { isEmail, isNumeric, isEmpty, isPib, isPhoneNumber, isInputValueMalicious } from '../../lib/helpers/validations';

type partnerReg = {
	name: string;
	taxNum: number;
	city: string;
	contactPerson: string;
	contactEmail: string;
	contactPhone: string;

}

export const isPartnerRegDataValid = (data: partnerReg): boolean => {
	let validation = true;

	if (isEmpty(data.name) || isInputValueMalicious(data.name) || !isPib(data.taxNum, 'sr') || isEmpty(data.city) || isInputValueMalicious(data.city) || isEmpty(data.contactPerson) || isInputValueMalicious(data.contactPerson) || !isEmail(data.contactEmail) || !isPhoneNumber(data.contactPhone, 'sr')) {
		validation = false;
	}

	return validation;
}