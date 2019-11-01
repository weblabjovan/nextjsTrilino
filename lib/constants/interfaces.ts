export interface IpartnerModel{
	name: string;
	taxNum: number;
	city: string;
	country: string;
	contactPerson: string;
	contactEmail: string;
	contactPhone: string;
	password?: string | null;
	verified: boolean;
	created: Date;
}