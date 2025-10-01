import { useState, useEffect, useRef } from 'react';

export const usePersistUser = (name: string, defaultValue: any) => {
	const [user, setUser] = useState(defaultValue);
	const nameRef = useRef(name);

	useEffect(() => {
		try {
			const storedValue = localStorage.getItem(name);
			if (storedValue !== null) setUser(storedValue);
			else localStorage.setItem(name, defaultValue);
		} catch {
			setUser(defaultValue);
		}
	}, [name, defaultValue]);

	useEffect(() => {
		try {
			localStorage.setItem(nameRef.current, user);
		} catch {}
	}, [user]);

	useEffect(() => {
		const lastName = nameRef.current;
		if (name !== lastName) {
			try {
				localStorage.setItem(name, user);
				nameRef.current = name;
				localStorage.removeItem(lastName);
			} catch {}
		}
	}, [name, user]);

	return [user, setUser];
};
