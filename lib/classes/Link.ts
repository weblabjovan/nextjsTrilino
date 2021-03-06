
interface url {
	path: string;
	query: object;
}

interface objectLink {
	fullUrl: string;
	protocol: string;
	host: string;
	path: string;
	fullPath: string;
	queryString: string;
	queryObject: object;
}

class LinkClass {
	private url: string;
	private linkObject: objectLink;

	constructor(){
		this.linkObject = {
			fullUrl: '',
			protocol: '',
			host: '',
			path: '',
			fullPath: '',
			queryString: '',
			queryObject: {}
		};
		this.url = '';
	}

	public generateLinkFromUrl(urlVal: string){
		this.linkObject = this.createLinkObject(urlVal);
		this.url = urlVal;
	}

	public generateLinkFromContext(ctx: object){
		const protocol = ctx['host'] === 'localhost:3000' ? 'http://' : 'https://';
		const url = `${protocol}${ctx['host']}${ctx['path']}`;

		this.linkObject = this.createLinkObject(url);
		this.url = url;
	}

	public generateLinkFromHeader(header: object){
		return header;
	}

	private createLinkObject(url: string): objectLink{
		const res = {
			fullUrl: url,
			protocol: this.getBasic(url)['protocol'],
			host: this.getBasic(url)['host'],
			path: this.getPath(url)['path'],
			fullPath: this.getPath(url)['fullPath'],
			queryString: this.getQuery(url)['initial'],
			queryObject: this.getQuery(url)['query'],
		}

		return res;
	}

	private getBasic(url: string): object{
		const split = url.split('/');
		const second = url.split(split[2]);

		return {protocol: second[0], host: split[2]};
	}

	private getPath(url:string): object{
		const split = url.split('/');
		const initial = url.split('?');
		const second = initial[0].split(split[2]);
		const path = split[3] ? split[3].split('?') : '';

		return {path: path[0] ? path[0] : '', fullPath: second[1] ? second[1] : '' };
	}

	private  getQuery (url:string):object {
	  const query = {};
	  let initial = "";
	  const init = url.split('?');
	  if (init[1]) {
	  	const second = init[1].split('&');
		  second.forEach((val) => {
		      const ar = val.split('=');
		      query[ar[0]] = ar[1];
		  });
		initial = init[1];
	  }
	  

	  return {initial, query};
	}

	getParsedUrl(): objectLink{
		return this.linkObject;
	}

	formUrl(data: url): string {
		let query = '?';
		for (let key in data.query){
			const string = `${key}=${data.query[key]}&`;
			query = query + string;
		}

		const url = `${this.linkObject.protocol}${this.linkObject.host}/${data.path}${query.substr(0, query.length - 1)}`;

		return url;
	}
}

export default LinkClass;