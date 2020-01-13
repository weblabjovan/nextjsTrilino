
type keyType = {
	mongoURI: string;
	EMAIL_API_KEY: string;
	JWT_SECRET: string;
	ADMIN_PASS: string;
	ADMIN_USER: string;
	AWS_PARTNER_PHOTO_ACCESS_KEY: string;
	AWS_PARTNER_PHOTO_SECRET_ACCESS_KEY: string;
	AWS_PARTNER_PHOTO_LINK: string;
}

const keys: keyType = {
	mongoURI: process.env.MONGO_URI,
	EMAIL_API_KEY: process.env.EMAIL_API_KEY,
	JWT_SECRET: process.env.JWT_SECRET,
	ADMIN_PASS: process.env.ADMIN_PASS,
	ADMIN_USER: process.env.ADMIN_USER,
	AWS_PARTNER_PHOTO_ACCESS_KEY: process.env.AWS_PARTNER_PHOTO_ACCESS_KEY,
	AWS_PARTNER_PHOTO_SECRET_ACCESS_KEY: process.env.AWS_PARTNER_PHOTO_SECRET_ACCESS_KEY,
	AWS_PARTNER_PHOTO_LINK: process.env.AWS_PARTNER_PHOTO_LINK,
}

export default keys;