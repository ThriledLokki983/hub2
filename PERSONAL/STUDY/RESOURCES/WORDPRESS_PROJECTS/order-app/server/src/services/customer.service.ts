import AbstractService from "@/services/abstract.service";
import { ServiceResponseData } from "@/interfaces/abstract.interface";
import {
    API_DIV_URL,
    API_CUSTOMER_DIVISION,
} from '@/config/config';
import { HttpException } from "@/exceptions/HttpException";

const INITIAL_DATA = {
    data: {
        d: {
            results: [],
            __next: null
        }
    }
}

class CustomerService extends AbstractService {
    constructor() {
        super();
    }

    public async getAllCustomers(): Promise<ServiceResponseData> {
        const allCustomers = []
        let data: any = INITIAL_DATA;
        let __next: string = '';

        const _url = `${API_DIV_URL}/${API_CUSTOMER_DIVISION}/Contacts`;
        data = await this.get(_url);

        if (!data) throw new HttpException(404, "No customers found")

        const { data: __data } = data
        __next = __data.d.__next;
        allCustomers.push(...__data.d.results)

        if(__data.d.__next !== null) {
            __next = '';
            const { d:  { __next: url }  } = __data;
            __next = url;
            data = await this.get(url);

            if (!data) return;
            allCustomers.push(...__data.d.results);

            // await this.pullData(__data, allCustomers);

            if (data.data.d.__next !== null) {
                __next = '';
                const { d:  { __next: url }  } = __data;
                __next = url;
                data = await this.get(url);

                if (!data) return;
                allCustomers.push(...__data.d.results)

                // await this.pullData(__data, allCustomers);


                if (data.data.d.__next !== null) {
                    __next = '';
                    const { d:  { __next: url }  } = __data;
                    __next = url;
                    data = await this.get(url);

                    if (!data) return;
                    allCustomers.push(...__data.d.results)

                    // await this.pullData(__data, allCustomers);

                    if (data.data.d.__next !== null) {
                        __next = '';
                        const { d:  { __next: url }  } = __data;
                        __next = url;
                        data = await this.get(url);

                        if (!data) return;
                        allCustomers.push(...__data.d.results)

                        // await this.pullData(__data, allCustomers);

                        if (data.data.d.__next !== null) {
                            __next = '';
                            const { d:  { __next: url }  } = __data;
                            __next = url;
                            data = await this.get(url);

                            if (!data) return;
                            allCustomers.push(...__data.d.results)

                            // await this.pullData(__data, allCustomers);
                        }
                    }
                }
            }
        }

        allCustomers.push(...__data.d.results);


        return { data: allCustomers, length: allCustomers.length };
    }

    public async getCustomerById(): Promise<ServiceResponseData> {
        const _data: any = {}

         return { data: _data, length: 2 };
     }

    public async getCustomerByAccount(): Promise<ServiceResponseData> {
    const _data: any = {}

        return { data: _data, length: 2 };

    }

    public async getCustomerByName(): Promise<ServiceResponseData> {
        const _data: any = {}

         return { data: _data, length: 2 };
     }

    public async getCustomerByFullName(): Promise<ServiceResponseData> {
        const _data: any = {}

         return { data: _data, length: 2 };
    }

    public async createCustomer(): Promise<ServiceResponseData> {
        const _data: any = {}

         return { data: _data, length: 2 };
    }


    public async updateCustomer(): Promise<ServiceResponseData> {
        const _data: any = {}

         return { data: _data, length: 2 };
    }

    private async pullData(data: any, list: any): Promise<any> {
        console.log(data);


        const { d:  { __next: url }  } = data;
        data = await this.get(url);

        if (!data) return;

        if (!data) return;
        list.push(...data.d?.results)
    }

    private changeNextUrl(url: string, next: string) {
        if (url === null) next === url;

        next = undefined;
    }

}

export default CustomerService;
