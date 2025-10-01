import AbstractService from "@/services/abstract.service";
import { AxiosResponseData } from "@/interfaces/abstract.interface";

class AccountService extends AbstractService {
    constructor() {
        super();
    }

    public async getAccounts(): Promise<AxiosResponseData> {
       const _data: any = {}

        return { data: _data };
    }
}

export default AccountService;
