import { Autobind } from "../utils/decorators";
import { displayErrorOrSuccessMessage, fetchDataError } from "../error";

export default class OAuth {
    private url: string = "";
    private access_Code: string = "";
    public access_Token: string = "";
    private static instance: OAuth;
    static applicationURL: string;

    private constructor() {
        this.configure();
    }

    public static getInstance(urlString: string) {
        this.applicationURL = urlString;

        if (!OAuth.instance) {
            OAuth.instance = new OAuth();
        }
        return OAuth.instance;
    }

    async configure() {
        await this.applicationLogin();
        await this.getAccessCode();
    }

    @Autobind
    handleLoginClick(_event: Event): void {}

    private async getAccessCode() {
        this.url = window.location.href;
        const code = this.url.split("code=")[1];

        if (code !== undefined) {
            this.access_Code = code;
            localStorage.setItem("accessCode", this.access_Code);
            localStorage.setItem("code_expires", (180 + new Date().getTime()).toString());

            await this.generateRefreshToken();
        } else {
            displayErrorOrSuccessMessage("", false);
        }
    }

    private async generateRefreshToken() {
        if (this.access_Code !== "") {
            await this.refreshTokenRequest();

            window.location.href = "/";
        }
    }

    private async refreshTokenRequest() {
        await fetch(`${OAuth.applicationURL}/auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code: this.access_Code }),
        })
            .then(() => {
                window.location.href = "/";
            })
            .catch((err: any) => {
                console.log("SOMETHING WENT WRONG WITH THE SERVER..." + err.message);
            });
    }

    private async applicationLogin() {
        await fetch(`${OAuth.applicationURL}/auth`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (res.status === 200) {
                    console.log("REDIRECTING USER TO APP HOMEPAGE!");
                }
            })
            .catch((_err: any) => {
                fetchDataError("SERVER ERROR: we vernieuwen uw toegang met Exact", "Fout", "info");
                window.location.href = "/auth";
            });
    }
}
