export const isEmail = (email: string): boolean => {
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
	    return (true)
	}
	return (false)
}

export const isInputValueMalicious = (value: any): boolean => {
	const input = value.toString();
	const tester = /[`^~<>,;"']/;
	if (tester.test(input) || input.indexOf('script') !== -1 || input.indexOf('javascript') !== -1 || input.indexOf('href=') !== -1) {
		return true;
	}

	return false;
}

export const isNumeric = (value: any): boolean => {
	if (value) {
		return !isNaN(value);
	}
  	return false;
}

export const isEmpty = (value: any): boolean => {
	if (value === null || value.toString().trim().length === 0 || value === '') {
		return true;
	}
  return false;
}

export const isPhoneNumber = (value: any, country: string): boolean => {
	const num = value.toString();
	if (country === 'sr') {
		if (value) {
			if (!isNaN(value)) {
				if (num.length > 8 && num.length < 13) {
					return true;
				}

				return false;
			}
			return false;
		}
		return false;
	}
	return false;
}

export const isPib = (value: number, country: string): boolean => {
	if (value === null) {
		return false;
	}

	const pib = value.toString();
	if (country === 'sr') {
		if (pib.length === 9) {
	      var suma = 10;
	      for (var i = 0; i < 8; i++) {
	         suma = (suma + parseInt(pib.charAt(i), 10)) % 10;
	         suma = (suma === 0 ? 10 : suma) * 2 % 11;
	      }
	      suma = (11 - suma) % 10;
	      return parseInt(pib.charAt(8), 10) === suma;
	   }
	   return false;
	}
   return false;
};