import { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import { LOGIN_URL, LOGOUT_URL } from '../configs/constants';

import { useApi, useLocalStorage } from '../hooks';

// import useAppStateContext from '../context/AppStateContext';

import NotLoggedInRedirect from '../components/NotLoggedInRedirect/NotLoggedInRedirect';

export const useAuthentication = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [token, setToken] = useLocalStorage('accessCode');
	// const [expires, setExpires] = useLocalStorage('code_expires');

    const refreshTokenProps = { endpoint: `refreshToken`, method: "POST"};
	const { post: _refreshToken, fetched } = useApi(refreshTokenProps);

	const generateRefreshToken = useCallback((_code) => {
        _refreshToken({ code: _code }).then(data => {
            if (data.status === 200) {
                window.location.href = '/';
            }
        }).catch(err => {
            console.log(err);
        });
	}, []);


	const loginProps = { endpoint: `login`, method: "GET", cache: true }
	const { get: _login } = useApi(loginProps);

	const login = useCallback( async () => {
		const response = await _login()

		if (response.authUrl) {
			const { authUrl: _url } = response;
			window.location = _url;
		};

		if (response.sessionId) {
			const { sessionId, isAuthenticated  } = response;

			if (isAuthenticated) {
				setIsAuthenticated(isAuthenticated);
				setToken(sessionId);
				// setExpires(moment(expiresIn * 1000).format('YYYY-MM-DD HH:mm:ss'));

                // refresh token
                const url = new URL(window.location.href);
                const _code = url.searchParams.get("code");

                if (!_code) return;

                if(_code) {
                    generateRefreshToken(_code);
                }
			}
		}
	}, [_login, setToken, setIsAuthenticated, generateRefreshToken]);





	useEffect(() => {
		if (isAuthenticated || token) return;

        if (fetched) return;

		login();

	}, [isAuthenticated, token, fetched]);


	return { isAuthenticated, login };
}
