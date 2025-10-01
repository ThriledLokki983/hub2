import React, { useState, useRef, useEffect } from 'react';

const REDIRECT_URL = process.env.REACT_APP_SIGNIN_URL;

const NotLoggedInRedirect = () => {
    const [seconds, setSeconds] = useState(5);

    const intervalRef = useRef();

    useEffect(() => {
        (intervalRef as any).current = setInterval(() => {
            setSeconds(p => p - 1);
        }, 1000);

        return () => {
            clearInterval(intervalRef.current);
        };
    }, []);

    useEffect(() => {
        if (!seconds) {
            clearInterval(intervalRef.current);
            (window as any).location = REDIRECT_URL;
        }
    }, [seconds]);

    return (
        <>
            Je wordt over <strong>{seconds} seconde{seconds === 1 ? '' : 'n'}</strong> doorgestuurd naar de inlogpagina.
        </>
    );
};

export default NotLoggedInRedirect;
