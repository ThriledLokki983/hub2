import { Customer } from "./../../utils/devTypes";
import { Autobind } from "../utils/decorators";
import Base from "./base";
import CustomerOrder from "./customer";
// import { jsPDF } from "jspdf";

export default class Complete extends Base<HTMLDivElement, HTMLFormElement> {
    private downloadButton: HTMLButtonElement;
    private customer: Customer = {};

    constructor(private classInstance: CustomerOrder) {
        super("complete", "page-5", true);
        this.customer = { ...this.classInstance.newCustomer[0] };
        this.downloadButton = this.element.querySelector(".download") as HTMLButtonElement;

        this.configure();
    }

    configure() {
        this.downloadButton.addEventListener("click", this.handleDownload);
        this.customer.ID === undefined; // just testing purposes
    }

    @Autobind
    private handleDownload() {
        const divContents = $("#page-4").html();
        const printWindow = window.open("", "PRINT", "height=400,width=800, background-color: red");

        printWindow!.document.write('<link rel="stylesheet" href="/order-style.css" type="text/css" />');
        printWindow!.document.write("<html><head><title>File</title>");
        printWindow!.document.write("</head><body >");
        printWindow!.document.write(divContents);
        printWindow!.document.write("</body></html>");
        printWindow!.document.close();
        printWindow!.print();
    }

    renderContent() {}
}
