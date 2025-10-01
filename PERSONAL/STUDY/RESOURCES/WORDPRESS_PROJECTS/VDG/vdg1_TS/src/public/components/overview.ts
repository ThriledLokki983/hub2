import Base from "./base";
import { Customer, Account, Invoice } from "../../utils/devTypes";
import CustomerOrder from "./customer";
import { Autobind } from "../utils/decorators";
import { fetchDataError } from "../error";
import { monthsInDutch, daysInMonth, daysInFirstMonth } from "../../utils/months";

export default class Overview extends Base<HTMLDivElement, HTMLFormElement> {
    private complete: HTMLButtonElement;
    private customer: Customer = {};
    private account: Account = {};
    private order: any;
    // private printContent: HTMLDivElement;
    private print: HTMLButtonElement;
    private totalCostElement: HTMLSpanElement;
    private months: HTMLSelectElement;
    private days: HTMLSelectElement;
    private years: HTMLSelectElement;
    private inscriptionText: string = "";

    constructor(private classInstance: CustomerOrder) {
        super("overview", "page-4", true);

        this.complete = this.element.querySelector(".complete_transaction") as HTMLButtonElement;

        this.months = this.element.querySelector(".select-develivery-month") as HTMLSelectElement;
        this.days = this.element.querySelector(".select-delivery-day") as HTMLSelectElement;
        this.years = this.element.querySelector(".select-delivery-year") as HTMLSelectElement;

        // this.printContent = document.querySelector(".print__order") as HTMLDivElement;
        this.print = this.element.querySelector(".print") as HTMLButtonElement;
        this.totalCostElement = this.element.querySelector("total__order--price") as HTMLSpanElement;

        this.configure();
        this.renderContent();
    }

    configure() {
        this.complete.addEventListener("click", this.handleSubmit);
        this.print.addEventListener("click", this.handlePrint);
        this.loadOptions(monthsInDutch, this.months, "option", "", false, []);
        this.loadOptions(daysInFirstMonth, this.days, "option", "", false, []);
        this.setYears(5);

        this.handleModal("complete_transaction");

        this.months.addEventListener("change", this.changeEventHandler);

        this.totalCostElement ? (this.totalCostElement.innerHTML = `${this.classInstance.totalOrderPrice}`) : "";

        this.onVisible(this.hostElement, () => {
            const inputArray = Array.from(document.querySelectorAll("input.inscription") as any);

            inputArray.forEach((input) => {
                this.inscriptionText = "";

                const description = (
                    (input as HTMLInputElement).closest('.item__detail-total[data-total="active"]') as any
                )?.querySelector(".description-total");

                const value = (input as HTMLInputElement)?.value;

                value !== "" ? (this.inscriptionText += `${value}`) : "";
                (input as HTMLInputElement)?.remove();

                if (description && this.inscriptionText !== "") {
                    description.insertAdjacentHTML(
                        "afterend",
                        `<span class="inscription-text">${this.inscriptionText}</span>`
                    );
                }
            });
        });
    }

    @Autobind
    private async handleSubmit(event: Event) {
        event.preventDefault();
        this.showSpinner();

        const [_account] = this.classInstance.newAccount;
        const { ID } = this.classInstance.account;

        this.account = _account;

        if (this.account.ID === undefined) {
            this.account.ID = ID;
        }

        this.classInstance.order.OrderAccount = this.account.ID;
        this.account.Status = this.account.Status === "C" ? this.account.Status : "C";

        //  get inside the QuotationLines and remove any empty objects
        const quotationLines = this.classInstance.order.QuotationLines.filter((item) => Object.keys(item).length !== 0);
        this.classInstance.order.QuotationLines = quotationLines;
        this.customer = (await this.postCustomerData(this.classInstance.customer, "PUT", "contacts")) as Customer;

        const { status: customerStatus } = this.customer as any;

        if (customerStatus === "success") {
            this.account = (await this.postCustomerData(this.account, "PUT", "accounts")) as Account;

            const { status: accountStatus } = this.account as any;

            if (accountStatus === "success") {
                this.order = (await this.postCustomerData(this.classInstance.order, "POST", "invoices")) as Invoice;

                const { status: orderStatus } = this.order as any;

                if (orderStatus === "success") {
                    let { classInstance } = this;

                    // set all the data to empty arrays
                    classInstance.allAccounts = [];
                    classInstance.allCustomers = [];
                    classInstance.allOrderedProducts = [];
                    classInstance.allProducts = [];
                    classInstance.newAccount = [];
                    classInstance.newCustomer = [];
                    classInstance.selectedProducts = [];
                    classInstance.order.QuotationLines = [];
                    classInstance.order.OrderAccount = "";
                    classInstance.order.Remarks = "";
                    classInstance.order.Description = "";
                    classInstance.order.Currency = "";
                    classInstance.account = {};
                    classInstance.customer = {};
                    classInstance.totalOrderPrice = 0;

                    fetchDataError("Uw bestelling is succesvol verwerkt.", "success", "success");

                    this.hideSpinner();
                    // this.classInstance.showPage(1); // this will be interesting to add later on
                } else {
                    fetchDataError("Factuur kon niet maken.", "Fout", "error");
                }
            } else {
                fetchDataError("Klantaccount kon niet bijgewerkt worden", "Fout", "error");
            }
        } else {
            fetchDataError("Klantgegevens kon niet bijgewerkt.", "Fout", "error");
        }
    }

    protected postCustomerData = async (dataObject: any, method: string, url: string) => {
        const data = await fetch(`${CustomerOrder.applicationURL}/${url}`, {
            method: `${method}`,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataObject),
        });
        const resp = await data.json();
        const { success, error, data: _data } = resp;
        if (!success && error) {
            fetchDataError(error, "Fout", "error");
        }
        return resp;
    };

    @Autobind
    private handlePrint(event: Event) {
        event.preventDefault();

        this.hostElement.querySelector(".select-delivery-day")?.classList.add("no-border");
        this.hostElement.querySelector(".select-develivery-month")?.classList.add("no-border");
        this.hostElement.querySelector(".select-delivery-year")?.classList.add("no-border");
        this.hostElement.querySelector(".select-salesperson")?.classList.add("no-border");

        const {
            customer: { FirstName, LastName },
        } = this.classInstance;

        const tile = `${FirstName}-${LastName}-bevestiging`;
        document.title = tile;
        window.print();
    }

    @Autobind
    private changeEventHandler(e: any) {
        e.preventDefault();

        const currentMonth = e.target.value;

        this.setDays(currentMonth);
    }

    private setDays(currentMonth: string) {
        this.days.innerHTML = "";

        const daysCount = daysInMonth[monthsInDutch.findIndex((month) => month === currentMonth)];

        const days = Array.from(Array(daysCount).keys()).map((day) => day + 1);

        this.loadOptions(days, this.days, "option", "", false, []);
    }

    private setYears(number: number = 10) {
        this.years.innerHTML = "";
        const currentYear = new Date().getFullYear();

        const years = Array.from(Array(number).keys()).map((year) => currentYear + year);
        this.loadOptions(years, this.years, "option", "", false, []);
    }

    renderContent() {}
}
