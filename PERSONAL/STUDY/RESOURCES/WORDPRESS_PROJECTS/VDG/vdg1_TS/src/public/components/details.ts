import Base from "./base";
import CustomerOrder from "./customer";
import { Customer, Account } from "../../utils/devTypes";
import { Autobind } from "../utils/decorators";
import Dialog from "./dialog";
import dutchCountries from "../utils/countries";
import { displayErrorOrSuccessMessage } from "../error";

export default class CustomerDetails extends Base<HTMLDivElement, HTMLFormElement> {
    private customer: Customer = {};
    private countries: HTMLSelectElement;
    private newCustomer: Customer = {};
    private newAccount: Account = {};
    private account: Account = {};
    private vatNumber: HTMLInputElement;
    private saveAndGoNextPageButton: HTMLButtonElement;
    private parentElement: HTMLDivElement;
    private errorMessage: string = "";
    private dialog: Dialog = new Dialog();
    private continueLater: HTMLButtonElement;

    constructor(private classInstance: CustomerOrder) {
        super("customer-details-form", "page-2", true);

        this.continueLater = this.element.querySelector(".continue-later") as HTMLButtonElement;
        this.saveAndGoNextPageButton = this.element.querySelector(".cust_details") as HTMLButtonElement;
        this.parentElement = document.querySelector(".details__page--form") as HTMLDivElement;
        this.countries = this.element.querySelector(".countrypicker") as HTMLSelectElement;
        this.vatNumber = this.element.querySelector('[data-name="kvk-nummer"]') as HTMLInputElement;

        this.configure();
    }

    async configure() {
        const restCountries = dutchCountries.map((data) => (data as any)?.name);
        super.loadOptions(restCountries as any, this.countries && this.countries, "option", "", false, []);

        this.saveAndGoNextPageButton.addEventListener("click", this.checkAndSaveCustomerDetailsAtExact);
        this.vatNumber.addEventListener("input", this.checkInputValue);
        this.continueLater.addEventListener("click", this.continueLaterHandler);
        this.checkRequiredFields();

        this.saveAndGoNextPageButton.disabled = true;
        this.saveAndGoNextPageButton.classList.add("disabled");
    }

    @Autobind
    private checkRequiredFields() {
        const inputs = this.hostElement.querySelectorAll(
            '.input[type="text"].req, .input[type="email"]'
        ) as NodeListOf<HTMLInputElement>;

        const radioInputs = Array.from(this.hostElement.querySelectorAll('input[type="radio"]'));

        this.onVisible(this.hostElement, () => {
            const inputs = Array.from(this.hostElement.querySelectorAll("input.req"));
            const allRadioIsValid = radioInputs.some((input) => (input as any).validity.valid);
            const allIsValid = inputs.every((input) => (input as any).validity.valid);

            inputs.forEach((input) => {
                input.addEventListener("input", this.checkRequiredInputs);
            });

            radioInputs.forEach((input) => {
                input.addEventListener("click", this.checkRadioInputs);
            });

            this.checkValidity(allIsValid, allRadioIsValid);
        });

        this.hostElement.addEventListener("change", () => {
            const allValid = Array.prototype.every.call(inputs, (input) => input.validity.valid);
            const allRadioIsValid = radioInputs.some((input) => (input as any).validity.valid);

            this.checkValidity(allValid, allRadioIsValid);
        });
    }

    @Autobind
    private async checkAndSaveCustomerDetailsAtExact(event: Event) {
        event.preventDefault();

        // if we have a customer
        if (this.classInstance.customer) {
            this.handleCustomerInfo();
            this.saveDetails();

            let _customer;
            const { customer } = this;
            if (customer !== undefined && typeof customer === "object" && !Array.isArray(customer)) {
                _customer = customer;
            }

            if (customer !== undefined && Array.isArray(customer)) {
                _customer = this.customer[0];
            }

            const { ID, Account } = _customer;

            this.newCustomer.ID = ID;
            this.newAccount.ID = Account;

            this.classInstance.customer = this.newCustomer;
            this.classInstance.newAccount = [this.newAccount];
        } else {
            this.newCustomer = this.saveCustomerDetails();
            this.newAccount = this.saveCustomerAccountDetails();

            const { Title, FirstName, LastName, Email } = this.newCustomer;

            const isNotEmptyFields = Title !== "" && FirstName !== "" && LastName !== "" && Email !== "";

            if (isNotEmptyFields) {
                displayErrorOrSuccessMessage("", false);

                const account = await this.postCustomerAccountOrDetailsData(this.newAccount, "POST", "accounts");

                console.log(account);

                if (account.data) {
                    const id = account.data.data.ID;
                    this.newCustomer.Account = id;

                    this.classInstance.newCustomer = [this.newCustomer];
                    const customer = await this.postCustomerAccountOrDetailsData(this.newCustomer, "POST", "contacts");
                    if (customer) this.customer = customer.data.data;

                    this.newCustomer.ID = this.customer.ID;
                    this.newCustomer.StartDate = this.formatDate(
                        this.customer.StartDate! ? this.customer.StartDate : `/Date(${new Date().getTime()})/`
                    );
                    this.newAccount.ID = this.newCustomer.Account;
                    this.newAccount.Created = this.formatDate(
                        this.account.Created! ? this.account.Created : `/Date(${new Date().getTime()})/`
                    );
                    this.classInstance.customer = this.newCustomer;
                    this.classInstance.newAccount = [this.newAccount];
                } else {
                    const title = account.error.split(".")[0].split("'").at(-1);
                    const message = account.error.split(".")[1].split("-")[0];

                    this.errorMessage = `${title} \n ${message}`;
                    this.dialog.confirm(this.errorMessage, (event as any).target);
                }
            }
        }
        this.renderContent();
    }

    @Autobind
    private async continueLaterHandler(event: Event) {
        event.preventDefault();
        this.showSpinner();

        const { customer } = this.classInstance;
        const isNotEmpty = Object.keys(customer).length !== 0;

        if (isNotEmpty) {
            this.handleCustomerInfo();
            this.saveDetails();

            const { ID, Account } = this.classInstance.customer;
            const { ID: _ID, MainContact } = this.classInstance.account;

            this.newCustomer.ID = ID ? ID : MainContact;
            this.newAccount.ID = _ID ? _ID : Account;

            this.classInstance.customer = this.newCustomer;
            this.classInstance.newAccount = [this.newAccount];

            await this.sendCustomerDetailsToExact("PUT");
        } else {
            this.saveDetails();
            await this.sendCustomerDetailsToExact("POST");
        }
    }

    @Autobind
    private checkInputValue(event: Event) {
        const { target } = event;
        const value = (event.target as HTMLInputElement).value;
        const isNotValid = value === null || value === "" || value === undefined;

        if (value.length > 0) {
            (target as HTMLInputElement).classList.add("req");
            this.saveAndGoNextPageButton.disabled = true;
            this.saveAndGoNextPageButton.classList.add("disabled");

            const longFormat = /^NL[0-9]{9}B[0-9]{2}$/;
            const longFormat1 = /^(GB)[0-9]{9}$/;
            const longFormat2 = /^(GB)[0-9]{12}$/;
            const shortFormat = /^(GB)?(GD|HA)?[0-9]{3}$/;

            const isValidFormat =
                longFormat.test(value) || longFormat1.test(value) || longFormat2.test(value) || shortFormat.test(value);

            if (isValidFormat) {
                this.saveAndGoNextPageButton.disabled = false;
                this.saveAndGoNextPageButton.classList.remove("disabled");
                this.vatNumber.setCustomValidity("");
            } else {
                (target as any)?.setCustomValidity("Invalid VAT number");
                this.vatNumber.setCustomValidity("Invalid VAT number");
            }
        } else if (isNotValid) {
            (target as HTMLInputElement).classList.remove("req");
            this.saveAndGoNextPageButton.disabled = false;
            this.saveAndGoNextPageButton.classList.remove("disabled");
        }
    }

    @Autobind
    protected checkRequiredInputs() {
        const inputs = Array.from(this.hostElement.querySelectorAll("input.req"));
        const radioInputs = Array.from(this.hostElement.querySelectorAll('input[type="radio"]'));
        const allRadioIsValid = radioInputs.some((input) => (input as any).validity.valid);
        const allIsValid = inputs.every((input) => (input as any).validity.valid);

        this.checkValidity(allIsValid, allRadioIsValid);
    }

    @Autobind
    private checkRadioInputs(_event: Event) {
        const radioInputs = Array.from(this.hostElement.querySelectorAll('input[type="radio"]'));
        const allRadioIsValid = radioInputs.some((input) => (input as any).validity.valid);

        if (!allRadioIsValid) {
            radioInputs.forEach((input) => {
                input.nextElementSibling?.classList.add("required-field");
                input.removeAttribute("required");

                this.checkValidity(false, false);
            });
        } else {
            radioInputs.forEach((input) => {
                input.nextElementSibling?.classList.remove("required-field");
                input.setAttribute("required", "required");

                this.checkValidity(true, true);
            });
        }
    }

    private checkValidity(allValidTextInputs: boolean, allValidRadioInputs: boolean) {
        if (!allValidTextInputs || !allValidRadioInputs) {
            this.saveAndGoNextPageButton.disabled = true;
            this.saveAndGoNextPageButton.classList.add("disabled");
        } else if (allValidTextInputs && allValidRadioInputs) {
            this.saveAndGoNextPageButton.disabled = false;
            this.saveAndGoNextPageButton.classList.toggle("disabled", !allValidTextInputs);
        }
    }

    protected postCustomerAccountOrDetailsData = async (dataObject: any, method: string, url: string) => {
        const data = await fetch(`${CustomerOrder.applicationURL}/${url}`, {
            method: `${method}`,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataObject),
        })
            .then((res) => res.json())
            .catch((err) => console.log(err));

        return await data;
    };

    private saveDetails() {
        this.newCustomer = this.saveCustomerDetails();
        this.newAccount = this.saveCustomerAccountDetails();
    }

    private async sendCustomerDetailsToExact(method: "POST" | "PUT") {
        if (method === "PUT") {
            const savedCustomer = await this.postCustomerData(
                this.newCustomer,
                `${method}`,
                CustomerOrder.applicationURL,
                "contacts",
                "klantgegevens"
            );
            const savedAccount = await this.postCustomerData(
                this.newAccount,
                `${method}`,
                CustomerOrder.applicationURL,
                "accounts",
                "account gegevens"
            );

            const { status } = savedCustomer;
            const { status: _status } = savedAccount;
            const isSaved = status === "success" && _status === "success";

            if (isSaved) {
                this.hideSpinner();
                (document.querySelector(".modal_info--text") as HTMLSpanElement)!.innerHTML =
                    "Klant gegevens zijn opgeslagen";
            }
        } else {
            const account = await this.postCustomerAccountOrDetailsData(this.newAccount, "POST", "accounts");

            const {
                status: accountStatus,
                data: { data },
            } = account;
            const isNotEmpty = Object.keys(data).length !== 0;
            const isAccountSaved = accountStatus === "success" && isNotEmpty;

            if (isAccountSaved) {
                const { ID } = data;
                this.newCustomer.Account = ID;
                this.classInstance.newCustomer = [data];
                // this.classInstance.newCustomer = [this.newCustomer];

                const customer = await this.postCustomerAccountOrDetailsData(this.newCustomer, "POST", "contacts");

                const {
                    status: customerStatus,
                    data: { data: _data },
                } = customer;
                const isNotEmpty = Object.keys(_data).length !== 0;
                const isCustomerSaved = customerStatus === "success" && isNotEmpty;

                if (isCustomerSaved) {
                    this.customer = _data;
                }

                const currentTime = `/Date(${new Date().getTime()})/`;
                const { ID: customerID, StartDate } = _data || this.customer || this.newCustomer;
                const { Created } = data || this.account || this.newAccount;
                this.newCustomer.ID = customerID;
                const formattedDate = this.formatDate(StartDate || currentTime);

                this.newCustomer.StartDate = formattedDate;
                this.newAccount.ID = ID;
                this.newAccount.Created = this.formatDate(Created || currentTime);
                this.classInstance.customer = this.newCustomer;
                this.classInstance.newAccount = [this.newAccount];

                const isAllDataSaved = isAccountSaved && isCustomerSaved;

                if (isAllDataSaved) {
                    this.hideSpinner();
                    (document.querySelector(".modal_info--text") as HTMLSpanElement)!.innerHTML =
                        "Klant gegevens zijn opgeslagen";
                }
            } else {
                const title = account.error.split(".")[0].split("'").at(-1);
                const message = account.error.split(".")[1].split("-")[0];

                this.errorMessage = `${title} \n ${message}`;
                this.dialog.confirm(this.errorMessage, (event as any).target);
            }
        }
    }

    private handleCustomerInfo() {
        this.customer = this.classInstance.customer;
        this.account = this.classInstance.account;
    }

    renderContent() {
        const { Phone: AccountPhone } = this.account;
        const { Phone: NewAccountPhone } = this.newAccount;
        this.newAccount.Phone = "" ? AccountPhone : NewAccountPhone;

        super.loadCustomerDetailsTotalPage(this.newCustomer, this.newAccount, this.parentElement, [
            "invoice-date",
            "invoice-greeting",
            "invoice-totalPrice",
        ]);
    }

    formatDate(date: Date | string) {
        const dateString = date.toString().replace(/[^0-9]/g, "");
        return new Date(parseInt(dateString));
    }
}
