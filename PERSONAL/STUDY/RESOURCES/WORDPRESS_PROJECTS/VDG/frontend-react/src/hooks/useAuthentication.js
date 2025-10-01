import { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import { LOGIN_URL, LOGOUT_URL } from '../configs/constants';

import { useApi, useLocalStorage } from '../hooks';

// import useAppStateContext from '../context/AppStateContext';

import NotLoggedInRedirect from '../components/NotLoggedInRedirect/NotLoggedInRedirect';

export const useAuthentication = () => {
	const [token, setToken] = useLocalStorage('accessCode');
	const [expires, setExpires] = useLocalStorage('code_expires');
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [code, setCode] = useState(token);
	const [tokenData, setTokenData] = useState(null);


	const loginProps = {
		endpoint: `/api/login`,
		method: "GET",
		cache: true,
	}
	const { get: _login } = useApi(loginProps);

	const login = useCallback(() => {
		// if (token) return;

		// window.location.href = 'http://localhost:4000/auth';
		// fetch(`http://localhost:4000/auth`, {
        //     method: "GET",
		// 	credentials: 'include',
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        // })
        //     .then((res) => {
        //         if (res.status === 200) {
        //             console.log("REDIRECTING USER TO APP HOMEPAGE!");
		// 			setTokenData(res?.data?.data);
        //         }
        //     })
        //     .catch((_err) => {
		// 		console.log(_err);
        //         // window.location.href = "/auth";
        //     });

		_login().then(data => {
			console.log(data);
			// setIsAuthenticated(data);
		}).catch(err => {
			console.log(err);
		});

	}, []);

	const logoutProps = {
		endpoint: `${LOGOUT_URL}`,
		method: "GET",
		cache: true,
	}

	const { get: _logout } = useApi(logoutProps);

	const logout = () => {
		_logout().then(data => {
			console.log(data);
			// setIsAuthenticated(data);
		});
	}

	const revoke = useCallback((redirect) => {
        if (redirect) {
            // error(<NotLoggedInRedirect/>);
			console.log('redirect');
        }
        setIsAuthenticated(false);
    }, []);

	const refreshTokenProps = {
		endpoint: `/auth`,
		method: "POST",
	};

	const { post: _refreshToken } = useApi(refreshTokenProps);

	const generateRefreshToken = useCallback((_code) => {
		if (_code !== null && _code !== undefined && token) {
			_refreshToken({ code: _code }).then(data => {
				if (data.status === 200) {
					setIsAuthenticated(data);
					window.location.href = '/';
				}
			}).catch(err => {
				console.log(err);
			});
		}

	}, []);

	function getCookie(name) {
		function escape(s) { return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1'); }
		var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
		return match ? match[1] : null;
	}

	useEffect(() => {
		login();
		const url = new URL(window.location.href);
		const _code = url.searchParams.get("code");
		const currentTime = moment().add(10, 'minutes').format('YYYY-MM-DD HH:mm:ss');

		// get SESSION_ID from the cookies
		const sessionId = getCookie('SESSION_ID');
		console.log(sessionId);

		if (_code !== undefined && token === null && token === undefined) {
			setCode(_code);
			setToken(_code);
			setExpires(currentTime);
			generateRefreshToken(_code);
        }
	}, [token]);

	return { isAuthenticated, login, logout, revoke };
}