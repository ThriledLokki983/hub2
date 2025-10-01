/** @format */

export interface Option {
  name: string
  label: string
}

export interface Customer {
  ID?: string
  AccountName?: string
  Account?: string
  Title?: string
  FirstName?: string
  MiddleName?: string
  LastName?: string
  Name?: string
  VATNumber?: string
  AddressLine1?: string
  AddressLine2?: string
  Postcode?: string
  City?: string
  Country?: string
  Email?: string
  Phone?: string
  Mobile?: string
  Created?: Date | string
  Modified?: Date | string
  StartDate?: Date | string
  JobTitleDescription?: string
  Notes?: string
  Remarks?: string
  Status?: string
  Initials?: string
}

export interface Account {
  ID?: string
  Name?: string
  VATNumber?: string
  AddressLine1?: string
  Postcode?: string
  Phone?: string
  Country?: string
  Email?: string
  City?: string
  Created?: Date | string
  Remarks?: string
  CountryName?: string
  Status?: string
  MainContact?: string
  EndDate?: Date | string
}

export interface Watch {
  ID?: string
  Description?: string
  ExtraDescription?: string
  Price?: number
  CostPriceStandard?: number
  StatisticalUnits?: number
  Title?: string
  Code?: string
  ItemGroupCode?: string
}
export interface Band {
  ID?: string
  Description?: string
  ExtraDescription?: string
  Price?: number
  ItemGroupCode?: string
  CostPriceStandard?: number
  StatisticalUnits?: number
  Title?: string
  Code?: string
}

export interface Product {
  ID: string
  Description: string
  ExtraDescription: string
  Price: number
  ItemGroupCode: string
  CostPriceStandard: number
  StatisticalUnits: number
  ItemGroupDescription: string
  Title?: string
  Code?: string
}

export interface Input {
  value: string
}

export interface OrderProcessState {
  order?: any
  customer?: Customer
  customerPersonalDetails?: Customer
  customerAccountDetails?: any
  watches?: Watch[]
  bands?: Band[]
  selectedWatch?: Watch | any
  selectedBand?: Band | any
  watchValue?: string
  bandValue?: string
  availableWatches?: Watch[]
  availableBands?: Band[]
  availableItems?: Product[]
}

export interface SearchResult {
  FirstName: string
  Account: string
  LastName: string
  Email: string
  JobTitleDescription: string
}

export interface Order {
  // products: Product[]
  watch?: Product[]
  band?: Product[]
  extra?: Product[]
  opties?: Product[]
}

export interface ResponseProps {
  data: {
    d: any
  }
  status: number
}

export interface Validateable {
  value: string | number
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
}

export interface DataProps {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
}

export interface ErrorProps {
  message: string
  response?: {
    data: {
      error: {
        message: {
          value: string
        }
      }
    }
  }
}

export interface CurrentState {
  customers?: Customer[]
  products?: Product[]
  customer: Customer
  product: Product
  Account: Account
  watch: Watch
  band: Band
}

export interface Search {
  FirstName: string
  LastName: string
}

export interface Invoice {
  AmountDC: number
  AmountDiscount: number
  AmountFC: number
  Currency: string
  Description: string
  OrderDate: string
  OrderedBy: string
  SalesOrderLines: [{ Watch: string }, { Band: string }]
  WarehouseID: string
}

export interface Order {
  AmountDC?: number
  AmountDiscount?: number
  AmountFC?: number
  Currency?: string
  QuotationDate?: string
  OrderAccount?: string
  QuotationLines: QuotationItem[]
  WarehouseID?: string
  OrderedBy?: string
  DeliveryAddress?: string
  DeliverTo?: string
  InvoiceTo?: string
  Description?: string
  Remarks?: string
}

export interface OrderInterface {
  productType: string
  productID: string
  productPrice: string
  productDescription: string
  productTitle: string
}

type QuotationItem = {
  Description?: string
  Item?: string
  UnitPrice?: number
  Quantity?: number
  QuotationID?: string
}

export interface Session {
  user: string | undefined
}

export interface TokenData {
  access_token: string
  expires_in: number
  refresh_token: string
  token_type: string
  expires: string
}
