import Base from "./base";
import { Customer, Account, Product, Order } from "../../utils/devTypes";
import { Autobind } from "../utils/decorators";
import { displayErrorOrSuccessMessage, fetchDataError } from "../error";
import fetchData from "./../../utils/handleRequest";

let progress, spinner, page1, page2;
if (typeof window !== "undefined") {
    (progress = document.querySelector(".progress-bar") as HTMLElement),
        (spinner = document.querySelector(".spinner") as HTMLElement),
        (page1 = document.querySelector(".page-1") as HTMLInputElement),
        (page2 = document.querySelector(".page-2") as HTMLInputElement);
}

const INIT = { status: "", data: [] };

// CLASS FOR THE CUSTOMER DETAILS
export default class CustomerOrder extends Base<HTMLDivElement, HTMLFormElement> {
    private searchButton: HTMLButtonElement;
    private searchInputValue: HTMLInputElement;
    private resultListElement: HTMLDivElement;
    readonly button: HTMLButtonElement;
    public customer: Customer = {};
    public account: Account = {};
    public allProducts: Product[] = [];
    public allOrderedProducts: any[] = [];
    public selectedProducts: any[] = [];
    public totalOrderPrice: number = 0;
    public allCustomers: Customer[] = [];
    public allAccounts: Account[] = [];
    public order: Order = {
        QuotationLines: [],
    };
    public newAccount: Account[] = [];
    public newCustomer: Customer[] = [];
    private static instance: CustomerOrder;
    static applicationURL: string;

    private constructor() {
        super("customer-search-form", "page-1", true);

        this.searchInputValue = this.element.querySelector(".search-input") as HTMLInputElement;
        this.searchButton = this.element.querySelector(".customer-search") as HTMLButtonElement;
        this.resultListElement = this.element.querySelector(".result__list") as HTMLDivElement;
        this.button = this.element.querySelector(".newClient") as HTMLButtonElement;

        this.configure();
    }

    static getInstance(urlString: string) {
        this.applicationURL = urlString;
        if (!CustomerOrder.instance) {
            CustomerOrder.instance = new CustomerOrder();
        }
        return CustomerOrder.instance;
    }

    configure() {
        this.searchButton.addEventListener("click", this.searchButtonHandler);
        this.button.addEventListener("click", this.newClientHandler);
    }

    /**
     * This function calls the getData function which in turn fetches the data from the API
     * @returns an instance of this class with customer and product data fetched from the API
     */
    public async init() {
        this.disableInput();

        this.allProducts = (await this.getData(CustomerOrder.applicationURL, "items/bulk")) as unknown as Product[];

        this.enableInput();
    }

    protected disableInput() {
        spinner.style.display = "block";
        this.searchInputValue.disabled = true;
        this.button.disabled = true;
        this.button.classList.add("disabled");
    }

    protected enableInput() {
        this.button.disabled = false;
        this.button.classList.remove("disabled");
        this.searchInputValue.disabled = false;
        spinner.style.display = "none";
    }

    // GETTERS
    public get AllProducts(): Product[] {
        return (this.allProducts ??= this.allProducts);
    }
    public get AllCustomers(): Customer[] {
        return (this.allCustomers ??= this.allCustomers);
    }
    public get AllAccounts(): Account[] {
        return (this.allAccounts ??= this.allAccounts);
    }

    private gatherUserInput(): string | string[] | void {
        const inputValue = this.searchInputValue.value.trim();
        const inputArray = inputValue.split(" ");

        if (inputArray.length === 2) {
            const firstName = inputArray[0].trim();
            const lastName = inputArray[1].trim();

            if (firstName === "" && lastName === "") {
                fetchDataError("Start typing first name and/or last name!", "Info: ", "info");
                return undefined;
            } else {
                let searchInput = [firstName, lastName];
                return searchInput;
            }
        } else if (inputArray.length === 3) {
            const firstName = inputArray[0].trim();
            const middleName = inputArray[1].trim();
            const lastName = inputArray[2].trim();

            if (firstName === "" && middleName === "" && lastName === "") {
                fetchDataError("Start typing first name and/or last name!", "Info: ", "info");

                return undefined;
            } else {
                let searchInput = [firstName, middleName, lastName];
                return searchInput;
            }
        }

        if (inputValue === "") {
            return undefined;
        } else {
            displayErrorOrSuccessMessage("", false);
            return inputValue;
        }
    }

    @Autobind
    private async searchButtonHandler(e: any) {
        e.preventDefault();

        const { applicationURL } = CustomerOrder;

        spinner.style.display = "block";
        const searchTerm = this.gatherUserInput() as string | string[];

        if (searchTerm === '' || searchTerm === undefined || searchTerm === null) {
            fetchDataError(`Please enter a valid customer name "First or Last" name.`, "Info 🔭", "info");
            spinner.style.display = "none";
            return
        }

        if (!Array.isArray(searchTerm) && searchTerm !== "") {
            this.allCustomers = (await this.performCustomerSearch(
                applicationURL,
                searchTerm as any
            )) as unknown as Customer[];

            if (this.allCustomers.length === 0) {
                fetchDataError(`No customer found for "${searchTerm}"`, "Info 🔭", "info");
            }

            let allAccounts = "";
            if (!this.allCustomers || !this.allCustomers.length) {
                spinner.style.display = "none";
                return;
            }

            this.allCustomers.forEach((customer: Customer) => {
                allAccounts += `${customer.Account} `;
            });

            if (allAccounts !== "") {
                this.allAccounts = (await this.performRelatedAccountSearch(
                    applicationURL,
                    allAccounts
                )) as unknown as Account[];
            }

            this.showResults(this.AllCustomers as any, searchTerm as string, this.allAccounts);
        } else if (Array.isArray(searchTerm)) {
            const searchTermString = searchTerm.join(" ");

            this.allCustomers = (await this.performCustomerSearch(
                applicationURL,
                searchTermString as any,
                "fullName"
            )) as unknown as Customer[];

            let allAccounts = "";
            this.allCustomers.forEach((customer) => {
                allAccounts += `${customer.Account}  `;
            });

            if (allAccounts !== "") {
                this.allAccounts = (await this.performRelatedAccountSearch(
                    applicationURL,
                    allAccounts
                )) as unknown as Account[];
            }

            this.showResults(this.AllCustomers as any, searchTermString as string, this.allAccounts as any);

            spinner.style.display = "none";
        }
    }

    private showResults(
        dataArray: Product[] | Customer[] | any[] | [],
        searchTerm: string | "",
        accountsArray: any[] | []
    ) {
        if (dataArray) {
            this.loadOptions(dataArray, this.resultListElement, "a", searchTerm as string, false, accountsArray);

            const options = this.resultListElement.querySelectorAll(".customer");
            options.forEach((option) => {
                option.addEventListener("click", this.clickHandler);
            });
            spinner.style.display = "none";
        } else {
            spinner.style.display = "none";
            this.loadOptions([], this.resultListElement, "p", searchTerm as string, true, []);
        }
    }

    @Autobind
    private async clickHandler(event: Event) {
        const { target } = event;
        event.preventDefault();

        const id = (target as any).closest(".customer")?.id as string;

        // make a request for the most recent account data
        const accountData = id !== "" ? await this.findAccountOrCustomer(id, "account", "account gegevens") : INIT;

        const {
            status,
            data: { results },
        } = accountData as any;

        if (status === "success") {
            const [_account] = results;
            this.account = _account;
        } else {
            this.account = {};
        }

        // find the customer whose Account ID matches the id above
        this.customer = (this.allCustomers as any).filter((customer: Customer) => customer.Account === id);

        // make a request for the most current customer data
        const customerData = (await this.findAccountOrCustomer(
            this.account.MainContact!,
            "customer",
            "klant gegevens"
        )) as any;

        const {
            status: _customerStatus,
            data: { data },
        } = customerData;

        if (_customerStatus === "success") {
            this.customer = data;
        } else {
            this.customer = {};
        }

        progress.style.width = `${25}%`;
        page1.classList.remove("active", "animated");
        page2.classList.add("active", "animated-right");
        this.renderContent();
    }

    @Autobind
    private newClientHandler(event: Event) {
        event.preventDefault();

        this.clearCustomerForm();
    }

    protected findAccountOrCustomer = async (id: string, url: "account" | "customer", message: string) => {
        const { applicationURL } = CustomerOrder;

        const data = await fetchData(`${applicationURL}/${url === "account" ? "accounts" : "contacts"}/${id}`);

        if (data.status === "success") {
            return data;
        }

        const actualMessage = `We kunnen niet de "${message}" ophalen.`;
        fetchDataError(actualMessage, "Error: 💥", "error");
        return INIT;
    };

    async renderContent() {
        let _customer = {} as Customer;
        if ((this.customer as any).length) {
            _customer = this.customer[0];
        }

        if (_customer.Account) {
            this.fillCustomerForm(this.account, _customer);
        }
    }
}
