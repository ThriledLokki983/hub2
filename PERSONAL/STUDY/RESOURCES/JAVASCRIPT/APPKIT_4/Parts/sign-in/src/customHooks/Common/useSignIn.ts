import useFetch from "./useFetch"


const useSignIn = () => {
	const { responseData,  error } = useFetch({urlPath: "", options: {}, redirectToLogin: true, initialValue: {}});

	console.log(responseData);


}

export default useSignIn