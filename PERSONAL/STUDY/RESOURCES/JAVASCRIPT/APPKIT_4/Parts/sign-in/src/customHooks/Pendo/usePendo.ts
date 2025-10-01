import { useCallback } from 'react';

const ENABLED = parseInt(process.env.REACT_APP_PENDO_ENABLED as string, 10) === 1;
const ACCOUNT_ID = process.env.REACT_APP_PENDO_ACCOUNT_ID as string;

const pendo = (window as any).pendo;

interface UserInfo {
	id: number | string
	role: string
	superuser: boolean
}

const usePendo = () => {

	const initialize = useCallback(({ id, role, superuser = false }: UserInfo) => {

		if(!ENABLED) return
		(pendo as any)?.initialize({
			visitor: {
				id,
				role,
				superuser,
			},
			account: {
				id: ACCOUNT_ID
			}

		})

	}, [])

	return initialize

}

export default usePendo


