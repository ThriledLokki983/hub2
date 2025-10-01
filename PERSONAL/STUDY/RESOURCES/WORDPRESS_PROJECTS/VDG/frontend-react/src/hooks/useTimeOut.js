import { useRef, useEffect, useCallback } from 'react';

export const useTimeOut = (callback, delay) => {
	const callbackRef = useRef(callback);
  const timeOutRef = useRef();

  useEffect(() => {
	callbackRef.current = callback;
  }, [callback]);

	const set = useCallback(() => {
		timeOutRef.current = setTimeout(() => callbackRef.current(), delay);
	}, [delay]);

	const clear = useCallback(() => {
		timeOutRef.current && clearTimeout(timeOutRef.current);
	}, []);

	useEffect(() => {
		set();
		return clear;
	}, [delay, set, clear]);

	const reset = useCallback(() => {
		clear();
		set();
	}, [set, clear]);

	return { reset, clear };

}