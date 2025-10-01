import { useState, useReducer, useCallback } from 'react';

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

	// const [loading, setLoading] = useState(false);
	const [error, setError] = useState(ERROR_DEFAULTS);

    // store global loading state
    const [{ loading }, dispatchLoading] = useReducer(loadingReducer, { apis: [], loading: false });
    const startLoading = useCallback((id) => { dispatchLoading({ type: 'START', id }); }, []);
    const stopLoading = useCallback((id) => { dispatchLoading({ type: 'STOP', id }); }, []);


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
		error,
        loading,
        startLoading,
        stopLoading,
		showError,
		hideError,
    };
}


// global loading state reducer
function loadingReducer (state, action) {
    const { type, id } = action;
    const { apis } = state;

    switch (type) {
        case 'START': {
            if (!apis.includes(id)) {
                apis.push(id);
            }

            return { apis, loading: true };
        }
        case 'STOP': {
            const _apis = apis.filter((_id) => _id !== id);

            return {
                apis: _apis,
                loading: !!_apis.length,
            };
        }
        default: {
            return state;
        }
    }
}
