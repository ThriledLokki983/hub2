import { Autobind } from "../utils/decorators";
import Base from "./base";
import { Watch, Band, Product, OrderInterface, Customer } from "../../utils/devTypes";
import CustomerOrder from "./customer";
import ProductItem from "./product";
import { displayErrorOrSuccessMessage } from "../error";
import Dialog from "./dialog";

const BAND_CODE = "horlogeband";
const WATCH_CODE = "horloge";
const WATCH = "serie";
// const EXTRA = "extra";
// const CLOSING = "sluiting";

export default class ProductOrder extends Base<HTMLDivElement, HTMLFormElement> {
    private specificationsDiv: HTMLDivElement;
    private extraOptions: HTMLDivElement;
    private specialInfoDiv: HTMLDivElement;
    private specialInfo: HTMLDivElement;
    private watchInput: HTMLInputElement;
    private watchInputValue: string = "";
    private bandInput: HTMLInputElement;
    private bandInputValue: string = "";
    private descriptionFields: any;

    private itemList: HTMLAnchorElement[] | null = [];

    private searchWatchButton: HTMLButtonElement;
    private searchBandButton: HTMLButtonElement;
    private addInscriptionButtons: any;
    private deleteButtons: any;
    private printA5Button: HTMLButtonElement;

    private extraSelect: HTMLSelectElement | null = null;
    private extraSelectValue: string = "";
    private specialInfoValue: string = "";
    private optiesSelect: HTMLSelectElement | null = null;
    private optiesSelectValue: string = "";
    private addExtraButton: HTMLButtonElement | null = null;
    private addOptionButton: HTMLButtonElement | null = null;

    private results: HTMLDivElement;
    private edit: HTMLButtonElement;
    private totalOrderPrice: HTMLSpanElement;

    private watch: Watch[] = [];
    private band: Band[] = [];

    private selectedWatch: any;
    private selectedBand: any;
    private selectedExtra: any;
    private selectedOpties: any;

    private totalPrice = 0;
    private static instance: ProductOrder;
    private dialog: Dialog = new Dialog();
    private currencyToNLLocale = new Intl.NumberFormat("nl-NL", {
        style: "currency",
        currency: "EUR",
        useGrouping: true,
    });

    private constructor(private classInstance: CustomerOrder) {
        super("purchase-details-form", "page-3", true);

        this.specificationsDiv = this.element.querySelector(".specifications") as HTMLDivElement;

        this.extraOptions = this.element.querySelector(".select--group") as HTMLDivElement;
        this.specialInfo = this.extraOptions.querySelector(".form__field .input.special") as HTMLInputElement;
        this.specialInfoDiv = this.element.querySelector(".special__title") as HTMLDivElement;

        this.watchInput = this.element.querySelector(".input.watch-input") as HTMLInputElement;
        this.bandInput = this.element.querySelector(".input.band-input") as HTMLInputElement;

        this.searchWatchButton = this.element.querySelector(".watch-search") as HTMLButtonElement;
        this.searchBandButton = this.element.querySelector(".band-search") as HTMLButtonElement;

        this.results = this.element.querySelector(".search__results") as HTMLDivElement;

        this.edit = this.element.querySelector(".price-edit") as HTMLButtonElement;

        this.deleteButtons = this.element.querySelectorAll(".remove--button") as unknown as HTMLButtonElement;

        this.totalOrderPrice = this.element.querySelector(".total__order--price") as HTMLSpanElement;

        this.printA5Button = this.element.querySelector(".print-a5") as HTMLButtonElement;

        this.configure();
    }

    static getInstance(classInstance: CustomerOrder) {
        if (!ProductOrder.instance) {
            ProductOrder.instance = new ProductOrder(classInstance);
        }

        return ProductOrder.instance;
    }

    configure() {
        this.specificationsDiv.style.display = "none";
        this.extraOptions.style.display = "none";

        this.handleModal("continue-later");

        this.edit.addEventListener("click", this.editPriceHandler);

        this.searchWatchButton.addEventListener("click", (e) => this.performProductSearch(e, WATCH_CODE));
        this.searchBandButton.addEventListener("click", (e) => this.performProductSearch(e, BAND_CODE));

        this.watchInput.addEventListener("keyup", (e) => this.keyPressHandler(e, WATCH_CODE), false);
        this.bandInput.addEventListener("keyup", (e) => this.keyPressHandler(e, BAND_CODE), false);

        this.specialInfo.addEventListener("input", this.specialInfoHandler);

        this.printA5Button.addEventListener("click", this.printA5Handler);

        this.edit.disabled = true;
        this.edit.classList.add("disabled");
        this.activateSelectOptions();
    }

    @Autobind
    private performProductSearch(event: Event, searchGroup: typeof WATCH_CODE | typeof BAND_CODE) {
        if (searchGroup === WATCH_CODE) {
            event.preventDefault();
            this.watchInputValue = this.watchInput.value;

            if (this.watchInputValue) {
                this.watch = this.searchProduct(searchGroup);
            }
            this.displayProductSearchResults(this.watch);
            this.watchInput.value = "";
        } else if (searchGroup === BAND_CODE) {
            event.preventDefault();
            this.bandInputValue = this.bandInput.value;

            if (this.bandInputValue) {
                this.band = this.searchProduct(searchGroup);
            }
            this.displayProductSearchResults(this.band);
            this.bandInput.value = "";
        }

        this.adjustProductSearchResultsStyling();

        this.activateAddToCartButton();
    }

    @Autobind
    private keyPressHandler(event: KeyboardEvent, searchGroup: typeof WATCH_CODE | typeof BAND_CODE) {
        if (searchGroup === WATCH_CODE) {
            if (event.key === "Enter") {
                const { value } = this.watchInput;
                this.watchInputValue = value;

                if (this.watchInputValue) {
                    this.watch = this.searchProduct(searchGroup);
                }
                this.displayProductSearchResults(this.watch);
                this.watchInput.value = "";
            }
        } else if (searchGroup === BAND_CODE) {
            if (event.key === "Enter") {
                const { value } = this.bandInput;

                this.bandInputValue = value;

                if (this.bandInputValue) {
                    this.band = this.searchProduct(searchGroup);
                }
                this.displayProductSearchResults(this.band);
                this.bandInput.value = "";
            }
        }

        this.activateAddToCartButton();
    }

    @Autobind
    private specialInfoHandler(event: Event) {
        const target = event.target as HTMLInputElement;
        const specialInfo = target.value;

        if (specialInfo) {
            this.specialInfoValue = specialInfo;

            const html = `
        <div class="special__content" data-state="active">
            <h5 class="title">Bijzonderheden</h5>
            <span>${this.specialInfoValue}</span>
        </div>
      `;

            this.specialInfoDiv.innerHTML = html;
        } else {
            console.log("no special info");
        }
    }

    private searchProduct(searchGroup: typeof WATCH_CODE | typeof BAND_CODE) {
        const { allProducts } = this.classInstance;

        return allProducts.filter((item: Product) => {
            const { ItemGroupDescription, Code } = item;

            if (searchGroup === WATCH_CODE) {
                if (ItemGroupDescription.toLowerCase().includes(WATCH)) {
                    return (
                        ItemGroupDescription?.toLowerCase().includes(this.watchInputValue.toLowerCase()) ||
                        Code?.toLowerCase().includes(this.watchInputValue.toLowerCase())
                    );
                } else {
                    return;
                }
            } else if (searchGroup === BAND_CODE) {
                const { ItemGroupDescription, Description, Code: _Code } = item;

                if (ItemGroupDescription.toLowerCase().includes(BAND_CODE)) {
                    if (!this.bandInputValue.endsWith(",")) {
                        this.bandInputValue += ",";
                    }

                    let [first, second, third, fourth] = this.bandInputValue.split(",");
                    let [_, groupDescription] = ItemGroupDescription.split(" ");
                    let [firstDesc, secondDesc, thirdDesc] = Description.split(",");

                    if ((fourth && fourth.length) || (third && third.length)) {
                        // [alli, h, maat xl, blauw] // [alli, h, maat xl]
                        return (
                            groupDescription
                                ?.toLowerCase()
                                ?.replace(",", "")
                                .trim()
                                .includes(first.toLowerCase().trim()) &&
                            firstDesc?.toLowerCase().trim().includes(second?.toLowerCase().trim()) &&
                            third?.toLowerCase().trim() === secondDesc?.toLowerCase().trim() &&
                            thirdDesc?.toLowerCase().trim().includes(fourth?.toLowerCase().trim())
                        );
                    } else {
                        const valueToCheck = this.bandInputValue?.replace(",", "").trim();

                        return (
                            ItemGroupDescription?.toLowerCase().includes(valueToCheck.toLowerCase()) ||
                            _Code?.trim() === valueToCheck ||
                            Description?.toLowerCase().includes(valueToCheck.toLowerCase())
                        );
                    }
                } else {
                    return;
                }
            } else {
                return;
            }
        });
    }

    @Autobind
    protected changeEventHandler(event: any) {
        event.preventDefault();

        if (event.target.classList.contains("extrapicker")) {
            this.extraSelectValue = event.target.options[event.target.selectedIndex].text;
        } else if (event.target.classList.contains("optiespicker")) {
            this.optiesSelectValue = event.target.options[event.target.selectedIndex].text;
        }
    }

    @Autobind
    private addExtraProductHandler(event: Event, group: "extra" | "opties") {
        event.preventDefault();
        (event.target as any).previousElementSibling.options[0].selected = true;

        if (group === "extra" && this.extraSelectValue !== "") {
            this.displayExtraProducts("extra");
            this.extraSelectValue = "";
            // render the add inscription button again
        } else if (group === "opties" && this.optiesSelectValue !== "") {
            this.displayExtraProducts("opties");
            this.optiesSelectValue = "";
        }
    }

    @Autobind
    private addToCartHandler(event: any) {
        event.preventDefault();

        const targetId = event.target.closest(".search__results--item").id;
        const targetGroupCode = event.target.previousElementSibling.previousElementSibling.innerText;

        if (targetGroupCode.toLowerCase().includes(WATCH) && targetId !== "undefined") {
            this.selectedWatch = new ProductItem(this.watch.find((watch: Watch) => watch.ID === targetId));

            if (!this.selectedWatch) {
                return;
            } else {
                this.extraOptions.style.display = "flex";
                this.specificationsDiv.style.display = "block";
                this.selectedWatch.loadWatchDetails();

                this.edit.disabled = false;
                this.edit.classList.remove("disabled");
                this.removeAllElements();
            }
        } else if (targetGroupCode.toLowerCase().includes(BAND_CODE) && targetId !== "undefined") {
            this.selectedBand = new ProductItem(this.band.find((band: Band) => band.ID === targetId));

            if (!this.selectedBand) {
                return;
            } else {
                this.extraOptions.style.display = "flex";
                this.specificationsDiv.style.display = "block";
                this.selectedBand.loadBandDetails();

                this.edit.disabled = false;
                this.edit.classList.remove("disabled");

                this.removeAllElements();
            }
        }

        this.getAllDeleteButtons();
        this.getAllInscriptionsButtons();
        this.activateInputsHandler();
        this.calculateTotalPrice();
        this.handleDescriptionClick();
    }

    private removeAllElements() {
        const parentElement: HTMLDivElement = document.querySelector(".search__results")!;

        parentElement?.querySelectorAll("li").forEach((element: HTMLElement) => {
            element.remove();
        });
    }

    @Autobind
    private calculateTotalPrice() {
        this.totalPrice = 0;
        const priceFields = Array.from(
            this.hostElement.querySelectorAll(".price-field") as NodeListOf<HTMLInputElement>
        );

        priceFields.forEach((field: HTMLInputElement) => {
            const price = parseFloat(field.value.replace(/[€.]/g, ""));
            this.totalPrice += price;
        });

        this.totalOrderPrice.innerHTML = this.currencyToNLLocale.format(
            this.totalPrice !== Number(this.totalPrice) ? 0.0 : this.totalPrice
        );

        this.classInstance.totalOrderPrice = this.totalPrice;

        if (priceFields.length === 0) {
            this.edit.disabled = true;
            this.edit.classList.add("disabled");
        } else {
            this.edit.disabled = false;
            this.edit.classList.remove("disabled");
        }
    }

    private handleDescriptionClick() {
        this.descriptionFields = Array.from(
            document.querySelectorAll(".desc-box > p.description")
        ) as HTMLParagraphElement[];

        this.descriptionFields.forEach((field: HTMLParagraphElement) => {
            field.addEventListener("click", (event: Event) => {
                event.preventDefault();

                if ((event.target as any)?.getAttribute("contentEditable") !== true) {
                    (event.target as any)?.setAttribute("contentEditable", "true");
                } else {
                    (event.target as any)?.removeAttribute("contentEditable");
                }
            });
        });
    }

    @Autobind
    private editPriceHandler(event: Event) {
        event.preventDefault();
        this.saveSelectedOrder();
        this.saveInscriptionHandler(event);

        if (!this.selectedWatch && !this.selectedBand && !this.selectedExtra && !this.selectedOpties) {
            this.dialog.confirm("Please select a watch, a band, an extra or an optie", (event as any).target);
            return;
        } else if (
            (this.selectedBand && this.selectedBand.isValid()) ||
            (this.selectedWatch && this.selectedWatch.isValid()) ||
            (this.selectedExtra && this.selectedExtra.isValid()) ||
            (this.selectedOpties && this.selectedOpties.isValid())
        ) {
            // ! we have Remarks and Description to add the "Bijzonderheden" value to the order === Discuss with Johan
            this.classInstance.order = {
                QuotationLines: this.classInstance.allOrderedProducts.map((product: OrderInterface) => {
                    if (product.productType) {
                        return {
                            Description: product.productType,
                            Item: product.productID,
                            UnitPrice: Number(
                                product.productPrice
                                    ?.replace(/[^0-9]/g, "")
                                    .toString()
                                    .slice(0, -2)
                            ),
                            Quantity: 1,
                            QuotationID: this.classInstance.newAccount[0]?.ID!,
                        };
                    } else {
                        return {};
                    }
                }),
                Description: `${this.classInstance.allOrderedProducts
                    .map((item) => {
                        return item.productInscription ? `${item.productTitle}: ${item.productInscription} |` : "";
                    })
                    .join(" ")}`,
                Currency: "EUR",
                Remarks: "",
            };
        } else {
            displayErrorOrSuccessMessage("Please select a watch and a band that are valid");
            this.dialog.confirm("Please select a watch and a band that are valid", (event as any).target);
        }

        const orderBorder = document.querySelector(".order__border") as HTMLHRElement;
        const string = `<h2>${this.classInstance.customer[0]?.Notes}</h2>`;
        orderBorder?.parentElement?.insertAdjacentHTML("beforeend", string);
    }

    protected displayExtraProducts(group: "extra" | "opties") {
        const product = this.findProduct(group);

        if (group === "extra") {
            this.selectedExtra = new ProductItem(product);
            this.selectedExtra.loadProductDetails(`${group}__title`);
        } else if (group === "opties") {
            this.selectedOpties = new ProductItem(product);
            this.selectedOpties.loadProductDetails(`${group}__title`);
        }

        this.getAllDeleteButtons();
        this.getAllInscriptionsButtons();
        this.activateInputsHandler();
        this.calculateTotalPrice();
        this.handleDescriptionClick();
    }

    private findProduct(area: "extra" | "opties" | "all" = "all") {
        if (area === "extra") {
            return this.classInstance.allProducts.find((product: Product) => {
                if (product.ItemGroupDescription.toLowerCase().includes("extra")) {
                    return product.Description.toLowerCase() === this.extraSelectValue.toLowerCase();
                } else {
                    return;
                }
            });
        } else if (area === "opties") {
            return this.classInstance.allProducts.find((product: Product) => {
                if (product.ItemGroupDescription.toLowerCase().includes("sluiting")) {
                    return product.Description.toLowerCase() === this.optiesSelectValue.toLowerCase();
                } else {
                    return;
                }
            });
        } else {
            return;
        }
    }

    private activateAddToCartButton() {
        if (this.results) {
            this.itemList = Array.from(
                this.element.querySelectorAll(
                    ".search__results .search__results--item"
                ) as NodeListOf<HTMLAnchorElement>
            );

            if (this.itemList) {
                this.itemList.forEach((item: HTMLAnchorElement) => {
                    item.querySelector(".btn__add")?.addEventListener("click", this.addToCartHandler);
                });
            }
        }
    }

    private activateSelectOptions() {
        this.extraSelect = this.element.querySelector(".extrapicker") as HTMLSelectElement;
        this.optiesSelect = this.element.querySelector(".optiespicker") as HTMLSelectElement;
        this.addExtraButton = this.element.querySelector(".add-extra") as HTMLButtonElement;
        this.addOptionButton = this.element.querySelector(".add-option") as HTMLButtonElement;

        if (this.extraSelect) {
            this.loadAvailableProducts(this.classInstance.allProducts, "extra", this.extraSelect!, true, "extra");
            this.extraSelect.addEventListener("change", this.changeEventHandler);
        }

        if (this.optiesSelect) {
            this.loadAvailableProducts(this.classInstance.allProducts, "sluiting", this.optiesSelect!, true);
            this.optiesSelect.addEventListener("change", this.changeEventHandler);
        }

        this.addExtraButton?.addEventListener("click", (e) => this.addExtraProductHandler(e, "extra"));
        this.addOptionButton?.addEventListener("click", (e) => this.addExtraProductHandler(e, "opties"));
    }

    private getAllDeleteButtons() {
        this.deleteButtons = Array.from(
            this.hostElement.querySelectorAll(".remove--button") as NodeListOf<HTMLButtonElement>
        );

        this.deleteButtons.forEach((button: HTMLButtonElement) => {
            button.addEventListener("click", (e) => {
                this.deleteFromCartHandler(e);
                this.calculateTotalPrice();
                this.handleDescriptionClick();
            });
        });
    }

    private getAllInscriptionsButtons() {
        this.addInscriptionButtons = Array.from(
            this.hostElement.querySelectorAll(".add--inscription") as NodeListOf<HTMLButtonElement>
        );

        this.addInscriptionButtons.forEach((button: HTMLButtonElement) => {
            button.addEventListener(
                "click",
                (event) => {
                    this.renderInputElementWithEvent(event);

                    button.disabled = true;
                    button.classList.add("disabled");
                },
                { once: true }
            );
        });
    }

    private deleteFromCartHandler(event: Event) {
        event.preventDefault();
        const button = event.target as HTMLButtonElement;
        const parent = button.closest('.watch__title--detail[data-state="active"]') as any;

        parent?.classList.add("hide");
        delete parent?.dataset.state;
        parent?.remove();
    }

    @Autobind
    private renderInputElementWithEvent(event: Event) {
        event.preventDefault();

        const target = (event.target as any).closest("button");
        const description = (target.closest('.watch__title--detail[data-state="active"]') as any).querySelector(
            ".description"
        );

        const input = this.createInputField();
        description.querySelector("input") ? "" : description.appendChild(input);

        input.addEventListener("keyup", (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                this.saveInscriptionHandler(event);
            }
        });
    }

    private createInputField() {
        const input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("placeholder", "max: 17 - chars");
        input.setAttribute("class", "inscription");
        input.setAttribute("maxlength", "17");

        return input;
    }

    private saveInscriptionHandler(event: Event) {
        event.preventDefault();
        const target = (event.target as any).closest("input");
        const description = (target?.closest('.watch__title--detail[data-state="active"]') as any).querySelector(
            ".description"
        );

        const value = target?.value;

        target?.remove();

        description?.insertAdjacentHTML("afterend", `<span class="inscription-text">${value}</span>`);
    }

    private activateInputsHandler() {
        const priceFields = Array.from(
            this.hostElement.querySelectorAll(".price-field") as NodeListOf<HTMLInputElement>
        );

        priceFields.forEach((field: HTMLInputElement) => {
            field.addEventListener("input", this.calculateTotalPrice);
            const price = parseFloat(field.value.replace(/[€.]/g, ""));

            this.totalPrice += price;
        });

        this.totalOrderPrice.innerHTML = this.currencyToNLLocale.format(
            this.totalPrice !== Number(this.totalPrice) ? 0.0 : this.totalPrice
        );
    }

    private saveSelectedOrder() {
        this.classInstance.allOrderedProducts = [];
        this.classInstance.selectedProducts = [];
        const allElements = Array.from(this.element.querySelectorAll('[data-state="active"]'));

        allElements.forEach((element: any) => {
            const productTitle = element.querySelector(".watch__title--name")?.innerHTML.trim();
            const productDescription = element.querySelector(".description")?.innerHTML;
            const productInscription = element.querySelector(".desc .inscription-text")?.innerHTML;
            const productPrice = element.querySelector(".price-field")?.value;
            const productID = element.querySelector(".watch__title--name")?.dataset.id;
            const productType = element.querySelector(".watch__title--name")?.dataset.type;
            const productGroupDescription = element.querySelector(".watch__title--name")?.dataset.group;
            const productSpecialInfo = this.specialInfoValue;

            const {
                classInstance: { allProducts },
            } = ProductOrder.instance;
            this.classInstance.selectedProducts.push(allProducts.find((product: Product) => product.ID === productID));

            const product = {
                productID,
                productTitle,
                productDescription,
                productInscription,
                productGroupDescription,
                productPrice,
                productType,
                productSpecialInfo,
            };
            this.classInstance.allOrderedProducts.push(product);
        });

        this.renderContent();
    }

    adjustProductSearchResultsStyling() {
        const searchResults = document.querySelector(".search__results") as HTMLDivElement;

        const { offsetHeight, scrollHeight } = searchResults;

        if (offsetHeight < scrollHeight) {
            searchResults?.classList.add("search__results--overflow");
        }
    }

    renderContent() {
        if (this.selectedBand) {
            this.selectedBand.loadProductDetailsTotalPage(this.classInstance.allOrderedProducts);
            this.selectedBand.loadTotalOrderCost(this.totalPrice);
        } else if (this.selectedWatch) {
            this.selectedWatch.loadProductDetailsTotalPage(this.classInstance.allOrderedProducts);
            this.selectedWatch.loadTotalOrderCost(this.totalPrice);
        }
    }

    @Autobind
    private printA5Handler() {
        this.handleContentDisplay();
        this.saveSelectedOrder();
        const { classInstance } = ProductOrder.instance;

        const { customer, selectedProducts } = classInstance;

        this.fillA5Table(customer, selectedProducts as any);
        const tile = `VDG-Order-A5-${customer?.FirstName}-${customer?.LastName}`;
        document.title = tile;
        window.print();
    }

    private fillA5Table(customer: Customer, products: any[]) {
        const extraList = products.filter((product) => product.ItemGroupDescription.toLowerCase() === "extra");
        const closingList = products.filter((product) => product.ItemGroupDescription.toLowerCase() === "sluiting");
        const watchList = products.filter((product) => product.ItemGroupDescription.toLowerCase().includes(WATCH));
        const bandList = products.filter((product) => product.ItemGroupDescription.toLowerCase().includes(BAND_CODE));
        const { Title, FirstName, MiddleName, LastName } = customer;
        const client = document.querySelector(".a5-client") as HTMLTableElement;
        const watch = document.querySelector(".a5-watch") as HTMLTableElement;
        const band = document.querySelector(".a5-band") as HTMLTableElement;
        const extra = document.querySelector(".a5-extra") as HTMLTableElement;
        const closing = document.querySelector(".a5-closing") as HTMLTableElement;
        const date = document.querySelector(".a5-date") as HTMLTableElement;

        let watchLIElement = "";
        let bandLIElement = "";
        let extraLIElement = "";
        let closingLIElement = "";
        watchList.forEach((product: any) => {
            const { ItemGroupDescription, Code } = product;
            const cleanName = ItemGroupDescription.split(",")[1].trim();

            watchLIElement += `<li>${Code} / ${cleanName}</li>`;
        });

        bandList.forEach((product: any) => {
            const { Description, Code, ItemGroupDescription } = product;
            const cleanName = ItemGroupDescription.split(" ")[1].trim().replace(",", "");

            bandLIElement += `<li>${Description} - [${Code} / ${cleanName}]</li>`;
        });

        extraList.forEach((product: any) => {
            const { Description, Code } = product;
            extraLIElement += `<li>${Description} - [${Code.trim()}]</li>`;
        });

        closingList.forEach((product: any) => {
            const { Description, Code } = product;
            closingLIElement += `<li>${Description} - [${Code.trim()}]</li>`;
        });

        const today: any = new Date();
        const dd = String(today.getDate()).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const yyyy = today.getFullYear();

        client.innerHTML = `${Title} ${FirstName} ${MiddleName} ${LastName}`;
        watch.innerHTML = watchLIElement ? watchLIElement : "Geen horloge geselecteerd";
        band.innerHTML = bandLIElement ? bandLIElement : "Geen horlogeband geselecteerd";
        extra.innerHTML = extraLIElement ? extraLIElement : "Geen extra's geselecteerd";
        closing.innerHTML = closingLIElement ? closingLIElement : "Geen sluiting geselecteerd";
        date.innerHTML = `${mm} / ${dd} / ${yyyy}`;
    }

    public handleContentDisplay() {
        window.addEventListener("beforeprint", () => {
            const form = document.querySelector(".form.collectie__form") as HTMLFormElement;
            const specs = document.querySelector(".specifications") as HTMLDivElement;
            const a5Doc = document.querySelector(".a5-doc") as HTMLDivElement;

            specs.classList.add("hide");
            form.classList.add("hide");
            a5Doc.classList.add("show");
        });

        window.addEventListener("afterprint", () => {
            const form = document.querySelector(".form.collectie__form") as HTMLFormElement;
            const specs = document.querySelector(".specifications") as HTMLDivElement;
            const a5Doc = document.querySelector(".a5-doc") as HTMLDivElement;

            specs.classList.remove("hide");
            form.classList.remove("hide");
            a5Doc.classList.remove("show");
        });
    }
}

// heren,maat M, kleur geel, toon-in-toon stiksel
// alli,d,maat xl, blauw
