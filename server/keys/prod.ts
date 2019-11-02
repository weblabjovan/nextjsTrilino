
type keyType = {
	mongoURI: string;
	EMAIL_API_KEY: string;
	JWT_SECRET: string;
}

const keys: keyType = {
	mongoURI: process.env.MONGO_URI,
	EMAIL_API_KEY: process.env.EMAIL_API_KEY,
	JWT_SECRET: process.env.JWT_SECRET,
}

export default keys;