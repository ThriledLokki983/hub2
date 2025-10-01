/** @format */
import { Request, Response, NextFunction } from "express";
import axios from "axios";
import catchAsync from "../utils/catchAsync";
import { ResponseProps } from "../utils/devTypes";
import { API_CUSTOMER_DIVISION, API_DIV_URL } from "../utils/secrets";
import helper from "../utils/helpers";

/************************************************************************************
 **                     CUSTOMERS ACCOUNT INFORMATION e.g BSN, VAT                 **
 **                     Endpoint to retrieve all the customer from EXACT-API       **
 **                     Endpoint to update and existing customer data              **
 **                     Endpoint to Create new Customer data                       **
 ***********************************************************************************/

/**
 * This is the endpoint to get all the customer's account from exact-api which will be reached by the client
 * Thus even viewing the page source will not reveal anything about the request to exact but to
 * @param req | Request
 * @param res | Response
 * @param next | NextFunction
 * @return {Promise} | Promise - returns the list of all the customer's accounts
 */
const getAllCustomersAccounts = catchAsync(
    async (_req: Request, res: Response, _next: NextFunction) => {
        const options = {
            headers: {
                authorization: `Bearer ${await helper.getAccessToken()}`,
                "Content-Type": "application/json",
            },
        };
        let data: any = [];
        await axios
            .get(`${API_DIV_URL}/${API_CUSTOMER_DIVISION}/Accounts`, options)
            .then(async (resp: ResponseProps) => {
                data = resp.data.d.results;

                if (resp.data.d.__next) {
                    const next = resp.data.d.__next;

                    await axios
                        .get(next, options)
                        .then(async (nextResp: ResponseProps) => {
                            const nextData = nextResp.data.d.results;
                            data = [...data, ...nextData];

                            if (nextResp.data.d.__next) {
                                const next = nextResp.data.d.__next;
                                await axios.get(next, options).then((nextResp: ResponseProps) => {
                                    const nextData = nextResp.data.d.results;
                                    data = [...data, ...nextData];
                                });
                            }
                        })
                        .catch((error: any) => {
                            throw new Error(error.message);
                        });
                }
            })
            .catch(async (error: any) => {
                if (error.response.data) {
                    await helper.logError("getAllCustomersAccounts", error.data.error_description);
                    throw new Error(error.response.data.error_description);
                } else {
                    helper.logError("getAllCustomersAccounts", error.message);
                    throw new Error(error.message);
                }
            });

        res.status(200).json({
            status: "success",
            length: data.length,
            data,
        });
    }
);

const getBulkAccounts = catchAsync(async (_req: Request, res: Response, _next: NextFunction) => {
    const options = {
        headers: {
            authorization: `Bearer ${await helper.getAccessToken()}`,
            "Content-Type": "application/json",
        },
    };

    let data: any = [];

    await axios
        .get(`${API_DIV_URL}/bulk/CRM/Accounts?$select=ID,Name,City,EndDate,StartDate`, options)
        .then(async (resp: ResponseProps) => {
            data = resp.data.d.results;

            if (resp.data.d.__next) {
                const next = resp.data.d.__next;

                await axios
                    .get(next, options)
                    .then(async (nextResp: ResponseProps) => {
                        const nextData = nextResp.data.d.results;
                        data = [...data, ...nextData];

                        if (nextResp.data.d.__next) {
                            const next = nextResp.data.d.__next;

                            await axios.get(next, options).then(async (nextResp: ResponseProps) => {
                                const nextData = nextResp.data.d.results;
                                data = [...data, ...nextData];

                                if (nextResp.data.d.__next) {
                                    const next = nextResp.data.d.__next;

                                    await axios
                                        .get(next, options)
                                        .then(async (nextResp: ResponseProps) => {
                                            const nextData = nextResp.data.d.results;
                                            data = [...data, ...nextData];

                                            if (nextResp.data.d.__next) {
                                                const next = nextResp.data.d.__next;

                                                await axios
                                                    .get(next, options)
                                                    .then(async (nextResp: ResponseProps) => {
                                                        const nextData = nextResp.data.d.results;
                                                        data = [...data, ...nextData];
                                                    });
                                            }
                                        });
                                }
                            });
                        }
                    })
                    .catch((error: any) => {
                        throw new Error(error.message);
                    });
            }
        })
        .catch(async (error: any) => {
            if (error.response.data) {
                await helper.logError("getAllCustomersAccounts", error.data.error_description);
                throw new Error(error.response.data.error_description);
            } else {
                helper.logError("getAllCustomersAccounts", error.message);
                throw new Error(error.message);
            }
        });

    res.status(200).json({
        status: "success",
        length: data.length,
        data,
    });
});

/**
 * This is the endpoint to create a new customer account data
 * @param req | Request
 * @param res | Response
 * @param next | NextFunction
 * @return {Promise} | Promise - creates a new customer account and return the data
 */
const createCustomerAccount = catchAsync(
    async (req: Request, res: Response, _next: NextFunction) => {
        const options = {
            headers: {
                authorization: `Bearer ${await helper.getAccessToken()}`,
                "Content-Type": "application/json",
                Prefer: "return=representation",
            },
        };
        const data = await axios
            .post(
                `${API_DIV_URL}/${API_CUSTOMER_DIVISION}/Accounts`,
                JSON.stringify(req.body),
                options
            )
            .then((resp: ResponseProps) => {
                if (resp.status === 400) {
                } else {
                    return resp.data.d;
                }
            })
            .catch(async (error: any) => {
                if ((error as any).response.data) {
                    await helper.logError(
                        "createCustomerAccount",
                        error.response.data.error.message.value
                    );
                    throw new Error((error as any).response.data.error.message.value);
                } else {
                    helper.logError("createCustomerAccount", error.message);
                    throw new Error(error.message);
                }
            });

        res.status(200).json({
            status: "success",
            data: {
                data,
            },
        });
    }
);

/**
 * This is the endpoint to update an existing customer account  data
 * @param req | Request
 * @param res | Response
 * @param next | NextFunction
 * @return {Promise} | Promise - updates the customer account data and return the data
 */
const updateCustomerAccountInfo = catchAsync(
    async (req: Request, res: Response, _next: NextFunction) => {
        const options = {
            headers: {
                authorization: `Bearer ${await helper.getAccessToken()}`,
                "Content-Type": "application/json",
            },
        };
        const data = await axios
            .put(
                `${API_DIV_URL}/${API_CUSTOMER_DIVISION}/Accounts(guid'${req.body.ID}')`,
                JSON.stringify(req.body),
                options
            )
            .then((resp: ResponseProps) => {
                if (resp.status === 400) {
                    console.log(resp.data);
                }
                return resp.data.d;
            })
            .catch(async (error: any) => {
                if ((error as any).response.data) {
                    await helper.logError(
                        "updateCustomerAccountInfo",
                        error.response.data.error.message.value
                    );
                    throw new Error((error as any).response.data.error.message.value);
                } else {
                    helper.logError("updateCustomerAccountInfo", error.message);
                    throw new Error(error.message);
                }
            });

        res.status(200).json({
            status: "success",
            data: {
                data,
            },
        });
    }
);

// get only one account
const getOneCustomerAccount = catchAsync(
    async (req: Request, res: Response, _next: NextFunction) => {
        const options = {
            headers: {
                authorization: `Bearer ${await helper.getAccessToken()}`,
                "Content-Type": "application/json",
            },
        };
        const data = await axios
            .get(
                `${API_DIV_URL}/${API_CUSTOMER_DIVISION}/Accounts?$filter=ID eq guid'${req.params.id}'`,
                options
            )
            .then((resp: ResponseProps) => {
                return resp.data.d;
            })
            .catch(async (error: any) => {
                if (error.response.data) {
                    await helper.logError("getOneCustomerAccount", error.data.error_description);
                    throw new Error(error.response.data.error_description);
                } else {
                    helper.logError("getOneCustomerAccount", error.message);
                    throw new Error(error.message);
                }
            });

        res.status(200).json({
            status: "success",
            data,
        });
    }
);

// get only one account
const getRelatedCustomerAccount = catchAsync(
    async (req: Request, res: Response, _next: NextFunction) => {
        const allIDs = req.params.allIDs.split(" ");

        let queryString = "";

        allIDs.forEach((id: string, index: number) => {
            if (id === "") {
                return;
            } else if (index === 0) {
                queryString += `ID eq guid'${id}'`;
            } else {
                queryString += ` or ID eq guid'${id}'`;
            }
        });

        const options = {
            headers: {
                authorization: `Bearer ${await helper.getAccessToken()}`,
                "Content-Type": "application/json",
            },
        };

        const data = await axios
            .get(
                `${API_DIV_URL}/${API_CUSTOMER_DIVISION}/Accounts?$filter=${queryString}&$select=ID,Name,City,Email,CountryName,StartDate,EndDate,Postcode,VATNumber,Status,AddressLine1,Remarks`,
                options
            )
            .then((resp: ResponseProps) => {
                return resp.data.d.results;
            })
            .catch(async (error: any) => {
                if (error.response.data) {
                    await helper.logError("getOneCustomerAccount", error.data.error_description);
                    throw new Error(error.response.data.error_description);
                } else {
                    helper.logError("getOneCustomerAccount", error.message);
                    throw new Error(error.message);
                }
            });

        res.status(200).json({
            status: "success",
            data,
        });
    }
);

export default {
    getAllCustomersAccounts,
    getOneCustomerAccount,
    updateCustomerAccountInfo,
    createCustomerAccount,
    getBulkAccounts,
    getRelatedCustomerAccount,
};
