interface Pages {
	language: Array<string>;
	partnerLogin: Array<string>;
	confirm: Array<string>;
}

const componentPages: Pages = {
	language: ['sr', 'en'],
	partnerLogin: ['register', 'login'],
	confirm: ['error', 'partner_registration'],
}

export default componentPages;