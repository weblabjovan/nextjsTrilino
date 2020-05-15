import SibApiV3Sdk from 'sib-api-v3-sdk';
import Keys from '../keys';
import MyCriptor from './MyCriptor';
import { IemailGeneral } from '../../lib/constants/interfaces';
import { getArrayObjectByFieldValue, setReservationTimeString, currencyFormat, setCateringString, setDecorationString, setAddonString }  from './general';
import { getLanguage } from '../../lib/language';
import { getGeneralOptionLabelByValue } from '../../lib/helpers/specificPartnerFunctions';
import DateHandler from '../../lib/classes/DateHandler';
import generalOptions from '../../lib/constants/generalOptions';

type emailSMTP = {
	sender: object;
	to: Array<object>;
	bcc: Array<object> | null;
	templateId: number;
	params: object;
}

export const sendEmail = async (email: emailSMTP ): Promise<any> => {
	const defaultClient = SibApiV3Sdk.ApiClient.instance;

	// Configure API key authorization: api-key
	const apiKey = defaultClient.authentications['api-key'];
	apiKey.apiKey = Keys.EMAIL_API_KEY;
	// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
	//apikey.apiKeyPrefix = 'Token';

	// Configure API key authorization: partner-key
	// var partnerKey = defaultClient.authentications['partner-key'];
	// partnerKey.apiKey = 'YOUR API KEY';
	// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
	//partnerKey.apiKeyPrefix = 'Token';

	const apiInstance = new SibApiV3Sdk.SMTPApi();

	const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email
	sendSmtpEmail.sender = email.sender;
	sendSmtpEmail.to = email.to;
	sendSmtpEmail.templateId = email.templateId;
	sendSmtpEmail.params = email.params;

	return apiInstance.sendTransacEmail(sendSmtpEmail)
	// .then(function(data) {
	//   console.log('API called successfully. Returned data: ' + data);
	// }, function(error) {
	//   console.error(error);
	// });
}


export const sendEmailCancelReservationUser = async (data: IemailGeneral): Promise<any> => {
	const { language, result, partner, user, policy } = data;

	const dictionary = getLanguage(language);
	const myCriptor = new MyCriptor();
	const dateStr = setReservationTimeString(result);

	const sender = {name:'Trilino', email:'no.reply@trilino.com'};
	const bcc = null;
	const templateId = 8;
	const to = [{name: `${myCriptor.decrypt(user['firstName'], true)} ${myCriptor.decrypt(user['lastName'], true)}`, email: myCriptor.decrypt(user['contactEmail'], false) }];

	const params = {
		title: 'Otkazivanje rezervacije',
		text: 'Žao nam je što ste morali da otkažete ovu rezervaciju. Sada ovaj termin na datoj lokaciji postaje slobodan i dostupan drugima na potencijalnu rezervaciju. U nastavku možete videti osnovne podatke o otkazivanju a sve dodatno možete pratiti preko vašeg korisničkog profila.',
		orderId: `${dictionary['paymentUserEmailOrderId']} ${result['_id']}`,
		date: `${dictionary['paymentUserEmailDate']} ${dateStr}`,
		partner: `${dictionary['paymentUserEmailPartnerName']} ${partner['name']}`,
		returnPolicy: policy['free'] ? 'Povraćaj depozita: Ispunjeni su uslovi za puni povraćaj depozita. U narednih 7 dana možete očekivati vraćena sredstva uz troškove obrade 2% - 5% od iznosa depozita.' : 'Povraćaj depozita: Na žalost uslovi za povraćaj depozita nisu ispunjeni.',
		returnPrice: `Iznos povraćaja: ${policy['free'] ? currencyFormat(result['deposit'] * 0.95) : 0}`,
		finish: 'Vaš Trilino.'
	};
	const email = { sender, to, bcc, templateId, params };

	return sendEmail(email);
}

export const sendEmailCancelReservationPartner = async (data: IemailGeneral): Promise<any> => {
	const { language, result, partner, policy } = data;

	const dictionary = getLanguage(language);
	const roomObj = getArrayObjectByFieldValue(partner['general']['rooms'], 'regId', result['room']);
	const dateStr = setReservationTimeString(result);

	const sender = {name:'Trilino', email:'no.reply@trilino.com'};
	const bcc = null;
	const templateId = 9;
	const to = [{name: partner['name'], email: partner['contactEmail'] }];

	const params = {
		title: 'Korisnik je otkazao rezervaciju',
		text: 'U nastavku možete videti osnovne podatke o rezervaciji koju je korisnik otkazao. Sada ovaj termin postaje slobodan i dostupan za buduću potencijalnu rezervaciju.',
		date: `${dictionary['paymentUserEmailDate']} ${dateStr}`,
		room: `${dictionary['paymentUserEmailRoom']} ${roomObj['name']}`, 
		guest: `${dictionary['paymentPartnerEmailCelebrant']} ${result['guest']}`,
		returnPolicy: policy['free'] ? 'Povraćaj depozita: Ispunjeni su uslovi za puni povraćaj depozita. Korisniku će biti vraćen depozit u roku od 7 dana.' : 'Povraćaj depozita: Uslovi za povraćaj depozita nisu ispunjeni.',
		finish: 'Vaš Trilino.'
	}

	const email = { sender, to, bcc, templateId, params };

	return sendEmail(email);
}

export const sendEmailReservationConfirmationUser = async (user: object, userParams: object): Promise<any> => {
	const myCriptor = new MyCriptor();

	const sender = {name:'Trilino', email:'no.reply@trilino.com'};
	const to = [{name: `${myCriptor.decrypt(user['firstName'], true)} ${myCriptor.decrypt(user['lastName'], true)}`, email: myCriptor.decrypt(user['contactEmail'], false) }];
	const bcc = null;
	const templateId = 6;
	const email = { sender, to, bcc, templateId, params: userParams};

	return sendEmail(email);
}


export const sendEmailReservationConfirmationPartner = async (data: IemailGeneral): Promise<any> => {
	const { language, reservation, partner, double } = data;
	const dictionary = getLanguage(language);
	const dateHandler = new DateHandler();
	const roomObj = getArrayObjectByFieldValue(partner['general']['rooms'], 'regId', reservation['room']);

	const sender = {name:'Trilino', email:'no.reply@trilino.com'};
	const to = [{name: partner['name'], email: partner['contactEmail'] }];
	const bcc = null;
	const templateId = 7;

	let cateringMsg = setCateringString(reservation, partner);
	let decorationMsg = setDecorationString(reservation, partner);
	let addonMsg = setAddonString(reservation, partner);

	const params = { 
		title: dictionary['paymentPartnerEmailTitle'], 
		sub: dictionary['paymentPartnerEmailSub'], 
		date: `${dictionary['paymentUserEmailDate']} ${dateHandler.getDateString(reservation['fromDate'])}, ${reservation['from']} - ${reservation['double'] ? double['to'] : reservation['to']}`, 
		room: `${dictionary['paymentUserEmailRoom']} ${roomObj['name']}`, 
		guest: `${dictionary['paymentPartnerEmailCelebrant']} ${reservation['guest']}`, 
		catering: `${dictionary['paymentPartnerEmailCatering']} ${cateringMsg}`, 
		decoration: `${dictionary['paymentPartnerEmailDecoration']} ${decorationMsg}`, 
		addons: `${dictionary['paymentPartnerEmailAddon']} ${addonMsg}`, 
		onsitePrice: `${dictionary['paymentPartnerEmailPrice']} ${currencyFormat(reservation['price'] - reservation['deposit'] - reservation['trilinoPrice'])}`,
		finish: dictionary['paymentPartnerEmailFinish']
	};
	const email = { sender, to, bcc, templateId, params };
	return sendEmail(email);
}

export const sendEmailCateringConfirmationUser =  async (user: object, cateringParams: object): Promise<any> => {
	const myCriptor = new MyCriptor();

	const sender = {name:'Trilino', email:'no.reply@trilino.com'};
	const to = [{name: `${myCriptor.decrypt(user['firstName'], true)} ${myCriptor.decrypt(user['lastName'], true)}`, email: myCriptor.decrypt(user['contactEmail'], false) }];
	const bcc = null;
	const templateId = 10;

	const email = { sender, to, bcc, templateId, params: cateringParams };
	return sendEmail(email);
}

export const sendRatingInvitationUser =  async (reservation: object, host: string): Promise<any> => {
	const myCriptor = new MyCriptor();
	const user = reservation['userObj'][0];
	const dictionary = getLanguage(user['userlanguage']);
	const link = `${host}/userProfile?page=rating&item=${reservation['_id']}&language=${user['userlanguage']}`;

	const sender = {name:'Trilino', email:'no.reply@trilino.com'};
	const to = [{name: `${myCriptor.decrypt(user['firstName'], true)} ${myCriptor.decrypt(user['lastName'], true)}`, email: myCriptor.decrypt(user['contactEmail'], false) }];
	const bcc = null;
	const templateId = 12;
	const params = { title: dictionary['ratingEmailTitle'], text1: dictionary['ratingEmailText1'], text2: dictionary['ratingEmailText2'], text3: dictionary['ratingEmailText3'], button: dictionary['ratingEmailButton'], hello: dictionary['ratingEmailHello'], link};

	const email = { sender, to, bcc, templateId, params };
	return sendEmail(email);
}

export const sendUserReminder =  async (reservation: object, host: string): Promise<any> => {
	const myCriptor = new MyCriptor();
	const user = reservation['userObj'][0];
	const partner = reservation['partnerObj'][0];
	const dictionary = getLanguage(user['userlanguage']);
	const link = `${host}/userProfile?language=${user['userlanguage']}`;
	const dateBase = reservation['date'].split('T');
	const restPrice = reservation['price'] - reservation['deposit'] - reservation['trilinoPrice'];

	const sender = {name:'Trilino', email:'no.reply@trilino.com'};
	const to = [{name: `${myCriptor.decrypt(user['firstName'], true)} ${myCriptor.decrypt(user['lastName'], true)}`, email: myCriptor.decrypt(user['contactEmail'], false) }];
	const bcc = null;
	const templateId = 13;
	const params = { 
		title: dictionary['emailUserReminderTitle'], 
		text1: dictionary['emailUserReminderText1'], 
		text2: dictionary['emailUserReminderText2'], 
		text3: `${dictionary['emailUserReminderText3']}${myCriptor.decrypt(user['firstName'], true)} ${dictionary['emailUserReminderText4']}`, 
		info1: `${dictionary['emailUserReminderWhen']} ${dateBase[0].split('-')[2]}.${dateBase[0].split('-')[1]}.${dateBase[0].split('-')[0]}.`,
		info2: `${dictionary['emailUserReminderWhere']} ${partner['name']}, ${partner['general']['address']}, ${getGeneralOptionLabelByValue(generalOptions['cities'], partner['city'])}`,
		info3: `${dictionary['emailUserReminderFocus']} ${myCriptor.decrypt(user['firstName'], true)}`,
		info4: `${dictionary['emailUserReminderPayment']} ${currencyFormat(restPrice)} ${dictionary['currency_rs']}`,
		button: dictionary['emailUserReminderButton'], 
		hello: dictionary['ratingEmailHello'], 
		link
	};

	const email = { sender, to, bcc, templateId, params };
	return sendEmail(email);
}

export const sendCateringReminder =  async (reservation: object, host: string): Promise<any> => {
	const myCriptor = new MyCriptor();
	const user = reservation['userObj'][0];
	const dictionary = getLanguage(user['userlanguage']);
	const link = `${host}/userProfile?language=${user['userlanguage']}`;

	const sender = {name:'Trilino', email:'no.reply@trilino.com'};
	const to = [{name: `${myCriptor.decrypt(user['firstName'], true)} ${myCriptor.decrypt(user['lastName'], true)}`, email: myCriptor.decrypt(user['contactEmail'], false) }];
	const bcc = null;
	const templateId = 14;
	const params = { 
		title: dictionary['emailCateringReminderTitle'], 
		text1: dictionary['emailCateringReminderText1'], 
		text2: `${dictionary['emailCateringReminderText2']} ${reservation['_id']} ${dictionary['emailCateringReminderText3']}`, 
		text3: dictionary['emailCateringReminderText4'],
		button: dictionary['emailUserReminderButton'], 
		hello: dictionary['ratingEmailHello'], 
		link
	};

	const email = { sender, to, bcc, templateId, params };
	return sendEmail(email);
}