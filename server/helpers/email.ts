import SibApiV3Sdk from 'sib-api-v3-sdk';
import Keys from '../keys';

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

	apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
	  console.log('API called successfully. Returned data: ' + data);
	}, function(error) {
	  console.error(error);
	});
}

