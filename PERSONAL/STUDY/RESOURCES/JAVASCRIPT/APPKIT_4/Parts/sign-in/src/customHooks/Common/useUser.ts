import { useEffect, useState } from "react"
import useFetch from "./useFetch"
import usePendo from "../Pendo/usePendo"
import { UserInterface } from "../../utils/types"
import testData from "../../utils/testData"

import { checkCookie } from "../../utils/helpers"

const useUser = () => {
	const [loggedInUser, setLoggedInUser] = useState<UserInterface>(testData.emptyUser)
	const { responseData,  error } = useFetch({urlPath: "user/", options: {}, redirectToLogin: true, initialValue: {}});

	const initialize = usePendo();

	checkCookie()

	useEffect(() => {
		if(responseData) {
			setLoggedInUser(responseData);

			const { role, is_superuser, flexx_id } = responseData;
			initialize({ role, id: flexx_id, superuser: is_superuser });
		}
	}, [responseData, initialize]);

	return { loggedInUser, error };
}

export default useUser