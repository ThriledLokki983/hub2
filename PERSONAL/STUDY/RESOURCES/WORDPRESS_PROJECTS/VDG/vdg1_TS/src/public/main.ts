/** @format */
// import './styles/main.scss'
import OAuth from "./components/oAuth";
import CustomerOrder from "./components/customer";
import Complete from "./components/complete";
import Overview from "./components/overview";
import CustomerDetails from "./components/details";
import ProductOrder from "./components/order";

/**
 * Perform action only when the DOM is fully loaded
 * Get all elements that are going to be used to perform actions on the page/pages
 */
if (typeof window !== "undefined") {
    window.addEventListener("DOMContentLoaded", async (_event: Event) => {
        console.log("Starting Application...");

        class App {
            private prod: string = "https://vdg-order-app.herokuapp.com";
            private dev: string = "https://9b01-134-238-140-0.eu.ngrok.io";
            // private dev: string = 'https://30aa-82-72-124-253.ngrok.io'
            readonly url: "dev" | "prod";

            constructor(url: "dev" | "prod" = "dev") {
                this.url = url;
            }

            public async initializeApplication() {
                const url = `${this.url === "dev" ? this.dev : this.prod}`;

                OAuth.getInstance(url);
                const customer = CustomerOrder.getInstance(url);
                new Overview(customer);
                await customer.init();
                new CustomerDetails(customer);
                ProductOrder.getInstance(customer);
                new Complete(customer);
            }
        }

        await new App().initializeApplication(); // development
        // await new App("prod").initializeApplication(); // production
    });
}
