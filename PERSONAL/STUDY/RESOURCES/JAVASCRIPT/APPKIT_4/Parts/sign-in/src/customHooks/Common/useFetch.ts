import { useState, useEffect, useRef } from "react";
import useCookie from 'react-use-cookie';
import useAuthentication from "../Auth/useAuthentication";
const ENDPOINT = process.env.REACT_APP_API_HOST;

interface UseFetchProps {
	urlPath: string;
	options: any;
	initialValue: any;
	redirectToLogin: boolean;
}

/**
 * A custom hook that takes a url and options.
 * Use the useState() hook to initialize the response, error and abort state variables.
 * Use the useEffect() hook to asynchronously call fetch() and update the state variables accordingly.
 * Create and use an AbortController to allow aborting the request. Use it to cancel the request when the component unmounts.
 * Return an object containing the response, error and abort state variables.
 * @param url The url to fetch
 * @param options
 * @returns
 */
const useFetchApi = ({urlPath, options = {}, redirectToLogin = true, initialValue = {} }: UseFetchProps) => {
	 const [csrfToken] = useCookie('csrftoken');
	 const initialValueRef = useRef(initialValue);

	const [responseData, setResponseData] = useState<any>(null);
	const [error, setError] = useState(null);
	const [abort, setAbort] = useState<AbortController>(() => new AbortController());
    const { isAuthenticated, revoke, authenticate } = useAuthentication();



	useEffect(() => {
		const fetchData = async () => {
			const controller = new AbortController();

			const allOptions: any = {
				credentials: "include",
				cachePolicy: "no-cache",
				cors: 'no-cors',
				headers: {
					'X-CSRFToken': csrfToken,
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					"Vary": "Origin",
					"Referrer-Policy": "same-origin",

					...options.headers
				}
			};

			try {
				const signal = controller.signal;
				setAbort(controller);

				const response = await fetch(`${ENDPOINT}/${urlPath}`, {...allOptions, signal });
				if ([401, 403].includes(response.status)) {
					 revoke(redirectToLogin);
                        return response;
				}
                authenticate();


				const json = await response.json();

				if(response.ok) setResponseData(json);
				else setResponseData(initialValueRef.current);

			} catch (error: any) {
				setError(error);
			}
		};

		fetchData();
		return () => {
			 abort.abort();
		}
	}
	, []);

	return { responseData,  error, abort };
}

export default useFetchApi;