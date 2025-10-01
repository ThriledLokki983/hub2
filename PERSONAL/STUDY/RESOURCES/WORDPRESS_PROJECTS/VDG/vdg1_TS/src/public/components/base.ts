// import { ButtonEntity } from '../utils/decorators'
import { changeActivePage } from "../utils/helpers";
import { Product, Customer, Account } from "../../utils/devTypes";
import { displayErrorOrSuccessMessage, fetchDataError } from "../error";
import fetchData from "./../../utils/handleRequest";
import { monthsInDutch } from "./../../utils/months";

/**
 * Base component
 * This component is used as a base for all other components
 * @param templateId | string The id of the template to be used
 * @param parentElement | HTMLElement The parent element to append the component to
 * @param insertAtStart  | boolean If true, the component will be inserted at the s
 * tart of the parent element
 * @param newElId | string The id of the new element
 */
// @ButtonEntity
export default abstract class Base<T extends HTMLElement, U extends HTMLElement> {
    readonly templateElement: HTMLTemplateElement;
    readonly buttons: HTMLButtonElement[];
    readonly hostElement: T;
    readonly element: U;
    readonly position: boolean;

    // The constructor takes in a template id and a parent element and what it does is that after initializing the class,
    // it will attach the template to the parent element and will always by default treat the template
    // as a new template.
    constructor(templateId: string, parentElement: string, insertAtStart: boolean, newElId?: string) {
        {
            this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
            this.hostElement = document.getElementById(parentElement)! as T;
            this.position = insertAtStart;

            const importedNode = document.importNode(this.templateElement.content, true);
            this.element = importedNode.firstElementChild as U;
            this.buttons = Array.from(this.element.querySelectorAll("[data-offset]") as NodeListOf<HTMLButtonElement>);

            if (newElId) {
                this.element.id = newElId;
            }

            this.activateButtons();
            this.attach();
        }
    }

    public attach() {
        this.hostElement.insertAdjacentElement(this.position ? "afterbegin" : "beforeend", this.element);
    }

    protected performCustomerSearch = async (
        baseUrl: string,
        searchTerm: string | string[],
        criteria: "fullName" | "name" = "name"
    ) => {
        const shouldFetch = searchTerm !== null && searchTerm !== undefined && searchTerm !== "";
        const URL = `${baseUrl}/contacts/${criteria === "name" ? "customer" : "fullName"}`;

        if (shouldFetch) {
            return await this.getData(URL, `${searchTerm}`);
        }

        return [];
    };

    protected performRelatedAccountSearch = async (baseUrl: string, searchTerm: string) => {
        const shouldFetch = searchTerm !== null && searchTerm !== undefined && searchTerm !== "";
        const URL = `${baseUrl}/accounts/relatedAccounts`;

        if (shouldFetch) {
            return await this.getData(URL, `${searchTerm}`);
        }

        return [];
    };

    // Generic function to fetch data from the API
    protected getData = async (baseUrl: string, url: string, id?: string, customers: boolean = true) => {
        const response = customers
            ? await fetchData(`${baseUrl}/${url}`)
            : await fetchData(`${baseUrl}/${url}?$filter=ID eq guid'${id}'`);

        const data = await response;

        if (!data) {
            fetchDataError("Uw sessie is verlopen, we probeer om het te vernieuwd", "Error", "error");
            // clear the session storage
            window.sessionStorage.clear();
            setTimeout(() => {
                window.location.href = "/auth";
            }, 5000);
        }

        const { error, status, data: _data } = data;

        if (!error && status === "success") {
            const { data } = _data;

            if (data) return data;
            return _data;
        }

        fetchDataError(error, status, "error");
    };

    private activateButtons() {
        this.buttons.forEach((button: HTMLButtonElement) => {
            button.addEventListener("click", this.handleButtonClick);
        });
    }

    /**
     * This function will check if the data passed to it has a FirstName property
     * and if it does
     * It will assume that the data is a customer and will render a list of customers
     * in the search result
     * @param dataArray | array of object(s) what will be used
     * @param parentElement | Position in the DOM where the list should be placed
     * @param htmlElementType | Element type (e.g. option, a) to be used
     */
    protected loadOptions(
        dataArray: Product[] | Customer[] | any[],
        parentElement: HTMLElement,
        htmlElementType: string,
        searchItem: string = "",
        noCustomers: boolean = false,
        accountsArray: any
    ) {
        const noCustomerFound = !dataArray || !dataArray.length || dataArray.length === 0 || noCustomers;

        if (noCustomerFound) {
            parentElement.innerHTML = "";
            const html = `<p>Geen klant gevonden voor: ${searchItem}</p>`;
            parentElement.insertAdjacentHTML("afterbegin", html);
        } else {
            displayErrorOrSuccessMessage("", false);

            const [customer] = dataArray;
            const { FirstName } = customer as Customer;
            const isValidCustomer =
                customer !== undefined && customer !== null && FirstName !== undefined && FirstName !== null;

            if (isValidCustomer) {
                parentElement.innerHTML = "";
                displayErrorOrSuccessMessage("", false);
            }

            dataArray.forEach(async (data: Product | Customer | any) => {
                displayErrorOrSuccessMessage("", false);

                const { FirstName, LastName } = data as Customer;

                if (FirstName || LastName) {
                    this.loadSearchedCustomerDetails(data, parentElement!, false, accountsArray);
                } else if ((data as Customer).Name) {
                    this.loadSearchedCustomerDetails(data, parentElement!, true, accountsArray);
                } else {
                    displayErrorOrSuccessMessage("", false);
                    parentElement
                        .appendChild(document.createElement(`${htmlElementType}`))
                        .appendChild(
                            document.createTextNode(
                                (data as Product).Description ? (data as Product).Description : (data as any)
                            )
                        );
                }
            });
        }
    }

    protected async loadSearchedCustomerDetails(
        data: Customer,
        parentElement: HTMLElement,
        prospect: boolean = false,
        accountsArray: any
    ) {
        accountsArray !== undefined &&
            accountsArray.filter((account: Account) => {
                const { Account, FirstName, LastName, MiddleName } = data as Customer;
                const { ID, EndDate, City, Email } = account as Account;
                const isSame = Account === ID;
                const isNotAccountData = EndDate === null;

                if (!isSame) {
                    return;
                } else {
                    // this should never happen
                    if (!data) {
                        alert(`er zijn geen gegevens doorgegeven aan de functie: LOAD_CUSTOMER_DETAILS in ${this}`);
                    } else if (!prospect && (FirstName || LastName)) {
                        if (isNotAccountData) {
                            const firstLetter = FirstName ? FirstName?.charAt(0).toUpperCase() : "";
                            let name: string = `${firstLetter ? `${firstLetter}.` : ""} ${
                                MiddleName ? MiddleName : ""
                            } ${LastName ? LastName : ""}`;

                            let html = `
                              <li class="customer" id="${Account}">
                                  <p class="p">${name}</p>
                                  <p class="p">${City ? City : ""}</p>
                                  <p class="p">${Email ? Email : ""}</p>
                              </li>`;
                            parentElement.insertAdjacentHTML("afterbegin", html);
                        }
                    }
                }
            });
    }

    protected loadAvailableProducts(
        productArray: Product[],
        productCode: string,
        parentElement: HTMLSelectElement,
        exactMatch: boolean = false,
        type: "extra" | "opties" = "opties"
    ) {
        // if (type === 'opties') {
        if (!productArray || productArray.length <= 0) {
            return;
        } else if (Array.isArray(productArray)) {
            const availableProducts = productArray.filter((product: Product) => {
                if (type === "opties") {
                    return (
                        product.ItemGroupCode === `${productCode}`.toUpperCase() ||
                        (exactMatch === true && product.ItemGroupDescription.toLowerCase().includes(productCode))
                    );
                } else {
                    if (
                        product.Description.toLowerCase() !== "diversen" &&
                        product.Description.toLowerCase() !== "verzend- en administratiekosten"
                    ) {
                        return (
                            product.ItemGroupCode === `${productCode}`.toUpperCase() ||
                            (exactMatch === true && product.ItemGroupDescription.toLowerCase().includes(productCode))
                        );
                    } else {
                        return false;
                    }
                }
            });

            this.loadOptions(availableProducts, parentElement, "option", "", false, []);
        }
    }

    private handleButtonClick(event: Event) {
        event.preventDefault();
        const offset = parseInt((event as unknown as any).target.dataset.offset as string);
        changeActivePage(offset);
    }

    protected postCustomerData = async (
        dataObject: any,
        method: string,
        envURL: string,
        url: string,
        message: string = ""
    ) => {
        const data = await fetch(`${envURL}/${url}`, {
            method: `${method}`,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataObject),
        });

        //TODO: Handle error here
        const { success, data: _data, status } = await data.json();

        if (!success && status !== "success") {
            const actualMessage = `We konden niet de "${message}" opslaan. Probeer het later opnieuw.`;
            fetchDataError(actualMessage, "Info:", "info");
            return { success: false, data: {}, status: "" };
        } else {
            return { status, _data };
        }
    };

    protected handleModal(openClass: string, id: boolean = false) {
        const openModal = id ? document.getElementById(`#${openClass}`) : document.querySelector(`.${openClass}`);
        const modal = document.querySelector("#modal") as HTMLElement;
        const closeModal = document.querySelector(".close-button.data-goto-homepage") as HTMLButtonElement;
        const closeModalSamepage = document.querySelector(".close-button.data-goto-samepage") as HTMLButtonElement;

        openModal?.addEventListener("click", () => {
            (modal as any)?.showModal();
            modal.classList.add("is-active");

            setTimeout(() => {
                (modal as any)?.close();
                modal.classList.remove("is-active");
            }, 20000);
        });

        closeModal?.addEventListener("click", () => {
            modal.setAttribute("closing", "");

            modal.addEventListener(
                "animationend",
                () => {
                    modal.removeAttribute("closing");
                    modal.classList.remove("is-active");
                    (modal as any)?.close();
                },
                { once: true }
            );

            window.location.href = "/";
        });

        closeModalSamepage?.addEventListener("click", () => {
            modal.setAttribute("closing", "");

            modal.addEventListener(
                "animationend",
                () => {
                    modal.removeAttribute("closing");
                    modal.classList.remove("is-active");
                    (modal as any)?.close();
                },
                { once: true }
            );
        });
    }

    protected showSpinner() {
        const modal = document.querySelector("#modal") as HTMLElement;
        (modal!.querySelector(".modal_info .spinner-2") as HTMLDivElement).style.display = "block";
    }

    protected hideSpinner() {
        const modal = document.querySelector("#modal") as HTMLElement;
        (modal!.querySelector(".modal_info .spinner-2") as HTMLDivElement).style.display = "none";
    }

    protected onVisible(element, callback) {
        new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.intersectionRatio > 0) {
                    callback(element);
                    observer.disconnect();
                }
            });
        }).observe(element);
    }

    protected saveCustomerDetails() {
        let customerObject: Customer = {};

        let Title = (document.getElementById("aanhef") as HTMLInputElement).checked
            ? (document.getElementById("aanhef") as HTMLInputElement).value
            : (document.getElementById("mev") as HTMLInputElement).checked
            ? (document.getElementById("mev") as HTMLInputElement).value
            : "";
        let Initials = (document.getElementById("voorletters") as HTMLInputElement).value;
        let FirstName = (document.getElementById("voornaam") as HTMLInputElement).value;
        let MiddleName = (document.getElementById("tussenvoegsel") as HTMLInputElement).value;
        let LastName = (document.getElementById("achternaam") as HTMLInputElement).value;
        let AccountName = (document.getElementById("bedrijfsnummer") as HTMLInputElement).value;
        let Postcode = (document.getElementById("postcode") as HTMLInputElement).value;
        let AddressLine2 = (document.getElementById("adres") as HTMLInputElement).value;
        let City = (document.getElementById("plaats") as HTMLInputElement).value;
        let Country = (document.getElementById("land") as HTMLInputElement).value;
        let Email = (document.getElementById("email") as HTMLInputElement).value;
        let Mobile = (document.getElementById("tel") as HTMLInputElement).value;
        let OPMERK = (document.getElementById("opmerk") as HTMLInputElement).value;

        // push all the new values into the empty customerObject
        customerObject.Title = Title;
        customerObject.FirstName = FirstName;
        customerObject.LastName = LastName;
        customerObject.AccountName = AccountName;
        customerObject.MiddleName = MiddleName;
        customerObject.AddressLine2 = AddressLine2;
        customerObject.Postcode = Postcode;
        customerObject.City = City;
        customerObject.Country = Country;
        customerObject.Email = Email;
        customerObject.Mobile = Mobile;
        customerObject.Modified = new Date().toISOString();
        customerObject.Initials = Initials.trim();
        customerObject.Notes = OPMERK;

        return customerObject;
    }

    protected saveCustomerAccountDetails() {
        let customerAccountDetails: Customer = {};

        // incase we do not get a company's name we will use the customer's name
        let FirstName = (document.getElementById("voornaam") as HTMLInputElement).value;
        let MiddleName = (document.getElementById("tussenvoegsel") as HTMLInputElement).value;
        let LastName = (document.getElementById("achternaam") as HTMLInputElement).value;

        let VATNumber = (document.getElementById("kvk-nummer") as HTMLInputElement).value;
        let AccountName = (document.getElementById("bedrijfsnummer") as HTMLInputElement).value;
        let Phone = (document.getElementById("tel") as HTMLInputElement).value;
        let Postcode = (document.getElementById("postcode") as HTMLInputElement).value;
        let AddressLine1 = (document.getElementById("adres") as HTMLInputElement).value;
        let City = (document.getElementById("plaats") as HTMLInputElement).value;
        let Email = (document.getElementById("email") as HTMLInputElement).value;
        let Remarks = (document.getElementById("opmerk") as HTMLInputElement).value;

        // push all the new values into the empty customerObject
        customerAccountDetails.VATNumber = VATNumber;
        customerAccountDetails.Name = AccountName || `${FirstName.trim()} ${MiddleName.trim()} ${LastName.trim()}`;
        customerAccountDetails.Phone = Phone;
        customerAccountDetails.Postcode = Postcode;
        customerAccountDetails.AddressLine1 = AddressLine1;
        customerAccountDetails.City = City;
        customerAccountDetails.Email = Email;
        customerAccountDetails.Status = "P";
        customerAccountDetails.Remarks = Remarks;

        return customerAccountDetails;
    }

    public loadCustomerDetailsTotalPage(
        customerPersonalDetails: Customer,
        customerAccountDetails: Customer,
        parentElement: HTMLDivElement,
        classList: string[]
    ) {
        parentElement.innerHTML = "";

        const { Title, FirstName, LastName, MiddleName, AddressLine2, Postcode, City } = customerPersonalDetails;
        const { Initials, AddressLine1, Postcode: _Postcode, City: _City } = customerAccountDetails;

        const html = `
        <div class=".cutomer--details-final">
            <div class="cutomer--details-final--item">
                <p class="customer-info">${Title}
                    ${Initials ? Initials : `${FirstName?.charAt(0).toUpperCase()}. ${" "}`}
                    ${MiddleName} ${LastName}
                </p>
            </div>
            <div class="cutomer--details-final--item">
                <p class="customer-info">
                    ${AddressLine2 ? AddressLine2 : AddressLine1 ? AddressLine1 : "-"}
                </p>
            </div>
            <div class="cutomer--details-final--item">
                <p class="customer-info">
                ${Postcode ? Postcode : _Postcode ? _Postcode : ""} ${City ? City : _City ? _City : "-"}</p>
            </div>`;

        parentElement.insertAdjacentHTML("afterbegin", html);
        if (classList.length > 0) {
            this.fillOtherInvoiceDetails(customerPersonalDetails, classList[0], classList[1]);
        }
    }

    protected fillOtherInvoiceDetails(customerData: Customer, date: string, title: string) {
        const invoiceDate = document.querySelector(`.${date}`);
        const invoiceTitle = document.querySelector(`.${title}`);

        // Date on the Invoice
        invoiceDate!.innerHTML = `Dokkum, ${new Date().getDate()} ${
            monthsInDutch[new Date().getMonth()]
        } ${new Date().getFullYear()}`;

        // Right title and Customer's last name
        invoiceTitle!.innerHTML = `Geachte ${customerData.Title?.toLowerCase().trim() === "dhr" ? "heer" : "mevrouw"} ${
            customerData.LastName
        }, `;
    }

    protected displayProductSearchResults(data) {
        const divElement = document.querySelector(".search__results") as HTMLDivElement;
        divElement.innerHTML = "";

        if (data.length > 0) {
            data.forEach((product: Product) => {
                if (product) {
                    const { Description, ItemGroupDescription, Code, ID } = product;

                    const html = `
                      <li href="#" class="search__results--item" id="${ID}">
                        <span class="search__result-data">${Code}</span>
                        <span class="search__result-data">${ItemGroupDescription}</span>
                        <span class="search__result-data group--code">${Description}</span>
                        <button class="btn__add" type="button">+</button>
                      </li>`;
                    divElement.insertAdjacentHTML("afterbegin", html);
                } else {
                    const html = `
                      <div class="search__results--item">
                        <span class="search__result-data">Geen resultaten gevonden</span>
                      </div> `;
                    divElement.insertAdjacentHTML("afterbegin", html);
                }
            });
        } else {
            const html = `
                <div class="search__results--item">
                  <span class="search__result-data">Geen resultaten gevonden</span>
                </div>
                `;
            divElement.insertAdjacentHTML("afterbegin", html);
        }
    }

    protected fillCustomerForm(data1: Account, data2: Customer) {
        if (data1 || data2) {
            displayErrorOrSuccessMessage("", false);

            const { Name, AddressLine1, VATNumber, Postcode, City, Remarks, Phone, Email, CountryName } =
                data1 as Account;
            const {
                FirstName,
                MiddleName,
                LastName,
                Title,
                Initials,
                AddressLine2,
                City: _City,
                Notes,
                Phone: _Phone,
                Email: _Email,
                Country,
            } = data2 as Customer;

            // Check if company Name is the same as the customer name then do not display it
            let companyName = "";
            if (data1 && data2) {
                const company = Name?.trim();
                const customer = `${FirstName} ${MiddleName} ${LastName}`.trim();
                companyName = company === customer ? "" : `${company}`;
            }

            const title = Title?.trim();
            const maleGroup = ["Mr", "Herr", "Dhr", "Meneer"];
            const femaleGroup = ["Mevrouw", "Mvr", "Mv", "Mevr", "Mvrouw", "Mv"];

            Array.from(document.querySelectorAll('input[type="radio"]')).forEach((item) => {
                if (title && maleGroup.includes(title)) {
                    item.nextElementSibling?.classList.remove("required-field");
                    if (maleGroup.includes((item as any).value)) {
                        (item as any).checked = true;
                        item.removeAttribute("required");
                        (item as any).click();
                        (item.nextElementSibling as any)?.click();
                    } else {
                        (item as any).checked = false;
                        item.removeAttribute("required");
                    }
                } else if (title && femaleGroup.includes(title)) {
                    item.nextElementSibling?.classList.remove("required-field");
                    if (femaleGroup.includes((item as any).value)) {
                        (item as any).checked = true;
                        item.removeAttribute("required");
                        (item as any).click();
                        (item.nextElementSibling as any)?.click();
                    } else {
                        (item as any).checked = false;
                        item.removeAttribute("required");
                    }
                } else {
                    item.nextElementSibling?.classList.add("required-field");
                    (item as any).checked = false;
                }
            });
            (document.getElementById("voorletters") as HTMLInputElement).value =
                data2 && Initials ? Initials.trim() : "";
            (document.getElementById("voornaam") as HTMLInputElement).value =
                data2 && FirstName ? FirstName.trim() : "";
            (document.getElementById("tussenvoegsel") as HTMLInputElement).value =
                data2 && MiddleName ? MiddleName.trim() : "";
            (document.getElementById("achternaam") as HTMLInputElement).value =
                data2 && LastName ? LastName.trim() : "";
            (document.getElementById("bedrijfsnummer") as HTMLInputElement).value = companyName;
            (document.getElementById("kvk-nummer") as HTMLInputElement).value = data1 && VATNumber ? VATNumber : "";
            (document.getElementById("adres") as HTMLInputElement).value =
                data1 && AddressLine1 ? AddressLine1.trim() : AddressLine2 ? AddressLine2.trim() : "";
            (document.getElementById("postcode") as HTMLInputElement).value = data1 && Postcode ? Postcode.trim() : "";
            (document.getElementById("plaats") as HTMLInputElement).value =
                data1 && City ? City.trim() : _City ? _City.trim() : "";
            (document.getElementById("selected") as HTMLInputElement).value =
                data1 && CountryName ? CountryName : data2 && Country ? Country : "";
            (document.getElementById("email") as HTMLInputElement).value =
                data2 && _Email ? _Email : data1 && Email ? Email : "";
            (document.getElementById("tel") as HTMLInputElement).value = data1 && Phone ? Phone : _Phone ? _Phone : "";
            (document.getElementById("opmerk") as HTMLInputElement).value =
                data2 && Notes ? Notes : data1 && Remarks ? Remarks : "";
        } else {
            displayErrorOrSuccessMessage("No results found");
        }
    }

    protected clearCustomerForm() {
        Array.from(document.querySelectorAll('input[type="radio"]')).forEach((item) => {
            (item as any).checked = false;
            item.setAttribute("required", "required");
            item.nextElementSibling?.classList.add("required-field");
        });
        (document.getElementById("voorletters") as HTMLInputElement).value = "";
        (document.getElementById("voornaam") as HTMLInputElement).value = "";
        (document.getElementById("tussenvoegsel") as HTMLInputElement).value = "";
        (document.getElementById("achternaam") as HTMLInputElement).value = "";
        (document.getElementById("bedrijfsnummer") as HTMLInputElement).value = "";
        (document.getElementById("kvk-nummer") as HTMLInputElement).value = "";
        (document.getElementById("adres") as HTMLInputElement).value = "";
        (document.getElementById("postcode") as HTMLInputElement).value = "";
        (document.getElementById("plaats") as HTMLInputElement).value = "";
        (document.getElementById("selected") as HTMLInputElement).value = "";
        (document.getElementById("email") as HTMLInputElement).value = "";
        (document.getElementById("tel") as HTMLInputElement).value = "";
        (document.getElementById("opmerk") as HTMLInputElement).value = "";
    }

    abstract configure(): void;
    abstract renderContent(): void;
}
