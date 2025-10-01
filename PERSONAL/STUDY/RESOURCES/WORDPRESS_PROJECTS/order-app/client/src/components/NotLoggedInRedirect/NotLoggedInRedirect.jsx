import React, { useState, useRef, useEffect } from 'react';
import { LOGIN_URL } from '../../configs/constants';

const NotLoggedInRedirect = () => {
    const [seconds, setSeconds] = useState(5);

    const intervalRef = useRef();

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setSeconds(p => p - 1);
        }, 1000);

        return () => {
            clearInterval(intervalRef.current);
        };
    }, []);

    useEffect(() => {
        if (!seconds) {
            clearInterval(intervalRef.current);
            window.location = LOGIN_URL;
        }
    }, [seconds]);

    return (
        <>
            Je wordt over <strong>{seconds} seconde{seconds === 1 ? '' : 'n'}</strong> doorgestuurd naar de inlogpagina.
        </>
    );
};

export default NotLoggedInRedirect;
