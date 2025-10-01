export interface Product {
	ID: string;
	Description: string;
	ExtraDescription: string;
	Price: number;
	ItemGroupCode: string;
	CostPriceStandard: number;
	StatisticalUnits: number;
	ItemGroupDescription: string;
	Title?: string;
	Code?: string;
}

export interface FectchedProductSuccess {
	status: string;
	endpointName: string;
	requestId: string;
	data: {
		status: string;
		totalData: number;
		AllData: {
			data: Product[];
		};
	};
}

export interface Customer {
	ID?: string;
	AccountName?: string;
	Account: string;
	Title?: string;
	FirstName?: string;
	MiddleName?: string;
	LastName?: string;
	Name?: string;
	VATNumber?: string;
	AddressLine1?: string;
	AddressLine2?: string;
	Postcode?: string;
	City?: string;
	Country?: string;
	Email?: string;
	Phone?: string;
	Mobile?: string;
	Created?: Date | string;
	Modified?: Date | string;
	StartDate?: Date | string;
	JobTitleDescription?: string;
	Notes?: string;
	Remarks?: string;
	Status?: string;
	Initials?: string;
}

export interface Account {
	ID?: string;
	Name?: string;
	VATNumber?: string;
	AddressLine1?: string;
	Postcode?: string;
	Phone?: string;
	Country?: string;
	Email?: string;
	City?: string;
	Created?: Date | string;
	Remarks?: string;
	CountryName?: string;
	Status?: string;
	MainContact?: string;
}

export interface Response {
	status: string;
	data: any[];
}
