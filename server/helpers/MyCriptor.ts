import Keys from '../keys';

export default class MyCriptor {
	private table: Array<string>;
	
	constructor() {
		this.table = Keys.CRYPTO_PASSWORD.split('');
	}

	public encrypt = (text: string, withPrefix: boolean): string => {
		const num = this.changeTextToNum(text);
		const enc = this.changeNumToEnc(num);

		return this.finalizeEnc(enc, withPrefix);
	}

	private changeTextToNum = (text: string): string => {
		let num = '';

		for (var i = 0; i < text.length; ++i) {
			let preNum = text.charCodeAt(i);
			if (preNum.toString().length === 5) {
				num = num + preNum;
			}else{
				let s = preNum.toString();
				let nS = '00000'.slice(0,(5-s.length));
				const nSa = nS + s;
				num = num + nSa;
			}
		}

		return num;
	}

	private changeNumToEnc = (num: string): string => {
		let enc = '';

		for (var i = 0; i < num.length; ++i) {
			const add = this.table[parseInt(num[i])];
			enc = enc + add;
		}

		return enc;
	}

	private finalizeEnc = (enc: string, prefix: boolean): string => {
		let str = '';
		if (prefix) {
			const n = Math.floor(Math.random()*90000) + 10000;
			const na = n.toString();

			for (var i = 0; i < na.length; ++i) {
				const add = this.table[parseInt(na[i])];
				str = str + add;
			}
		}

		return str + enc;
	}

	public decrypt = (text: string, withPrefix: boolean):string => {
		const arr = this.decomposeEncription(text, withPrefix);
		const numArr = this.encItemsToNum(arr);

		return this.numToText(numArr);
	}

	private decomposeEncription = (text: string, prefix: boolean): Array<string> => {
		if (prefix) {
			const base = text.substr(5);
			return base.match(/.{1,5}/g);
		}else{
			return text.match(/.{1,5}/g);
		}
	}

	private encItemsToNum = (arr: Array<string>): Array<number> => {
		const nums = [];

		for (var i = 0; i < arr.length; ++i) {
			let str = '';
			const sp = arr[i].split('');
			sp.map(char => {
				str = str + this.table.indexOf(char);
			});
			nums.push(parseInt(str));
		}

		return nums;
	}

	private numToText = (numArr: Array<number>): string => {
		const str = [];
		for (var i = 0; i < numArr.length; ++i) {
			str.push(String.fromCharCode(numArr[i]));
		}

		return str.join('');
	}
}