import { useState } from 'react';

import {
    useNotifications,
    useScreenSize,
} from '.';

const ERROR_DEFAULTS = {
	active: false,
  };

export function useAppState () {
    const screen = useScreenSize();
    const notifications = useNotifications();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(ERROR_DEFAULTS);


	/**
   * Error helpers.
   */
	const showError = ({ title, message, persistent, reload }) => setError({
	active: true,
	style: 'error',
	title,
	message,
	persistent,
	reload,
	});

	const hideError = () => setError(e => ({ ...e, active: false }));



    /* * * * * *
     * OUTPUT  *
    ** * * * * */
    return {
        notifications,
        screen,
		loading,
		error,
		setLoading,
		showError,
		hideError,
    };
}
