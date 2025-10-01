import AbstractService from "@/services/abstract.service";
import { AxiosResponseData } from "@/interfaces/abstract.interface";

class InvoiceService extends AbstractService {
    constructor() {
        super();
    }

    public async getInvoice(): Promise<AxiosResponseData> {
       const _data: any = {}

        return { data: _data };
    }
}

export default InvoiceService;
