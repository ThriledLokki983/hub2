import { fetchDataError } from "../public/error";

export const fetchData = async (url: string) => {
    return await fetch(`${url}`, {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    })
        .then((res) => {
            if (!res.ok || res.status === 500) {
                return res.json();
            }
            return res.json();
        })
        .catch((error) => {
            handleError(error);
        });
};

function handleError(_error: any) {
    const { error, success, stack } = _error;

    if (error && error.includes("401")) {
        console.log("401 error", success, stack);
    } else if (error && error.includes("500")) {
        console.log("500 error");
    } else {
        fetchDataError(error);
    }
}

export default fetchData;
