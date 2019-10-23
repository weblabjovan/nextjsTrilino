
type keyType = {
	mongoURI: string;
}

const keys: keyType = {
	mongoURI: process.env.MONGO_URI,
}

export default keys;