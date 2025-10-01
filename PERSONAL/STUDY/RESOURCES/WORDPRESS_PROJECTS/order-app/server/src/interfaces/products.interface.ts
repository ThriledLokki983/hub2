export interface GetProductOptions {
    headers: {
        "Allow-Control-Allow-Origin"?: string;
        authorization: string;
        'Content-Type': string;
    }
}


export interface ResponseData {
    data: {
        d: {
            results: Product[];
        }
    }
}

export interface Product {
    Code: string;
    CostPriceStandard: number;
    Description: string;
    ExtraDescription: string;
    ID: string;
    ItemGroupCode: string;
    ItemGroupDescription: string;
    StandardSalesPrice: number;
    UnitDescription: string;
}
