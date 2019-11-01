type keyType = {
	mongoURI: string;
	EMAIL_API_KEY: string;
	JWT_SECRET: string;
}

let getKeys = async (): Promise<any> => {
	if (process.env.NODE_ENV === 'production') {
		return await import('./prod');
	}else{
		return await import('./dev');
	}
}





export default getKeys();