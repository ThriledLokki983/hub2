import React, { useEffect, useState } from 'react';
import styles from './Login.module.scss';

/**
 * A temporary component to help debug token storage issues
 * This will display all available token storage information
 * Include this in your Login page to debug token issues
 */
const TokenDebug = () => {
  const [tokens, setTokens] = useState<{
    localStorage: string | null;
    sessionStorage: string | null;
    cookies: string[];
    justLoggedIn: string | null;
  }>({
    localStorage: null,
    sessionStorage: null,
    cookies: [],
    justLoggedIn: null,
  });

  useEffect(() => {
    // Function to update token state
    const updateTokenState = () => {
      try {
        // Get token from localStorage
        const localStorageToken = localStorage.getItem('Authorization');

        // Get token from sessionStorage
        const sessionStorageToken = sessionStorage.getItem('Authorization');

        // Get justLoggedIn flag
        const justLoggedInFlag = sessionStorage.getItem('justLoggedIn');

        // Get all cookies
        const allCookies = document.cookie
          .split(';')
          .map(cookie => cookie.trim())
          .filter(cookie => cookie.length > 0);

        // Update state
        setTokens({
          localStorage: localStorageToken,
          sessionStorage: sessionStorageToken,
          cookies: allCookies,
          justLoggedIn: justLoggedInFlag,
        });
      } catch (err) {
        console.error('Error accessing storage:', err);
      }
    };

    // Update initially
    updateTokenState();

    // Set up interval to update tokens regularly
    const interval = setInterval(updateTokenState, 2000);

    // Clean up
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={styles.debugContainer}
      style={{
        margin: '20px',
        padding: '15px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        backgroundColor: '#f9f9f9',
      }}
    >
      <h3 style={{ marginTop: 0 }}>Token Debug Information</h3>

      <div style={{ marginBottom: '10px' }}>
        <strong>localStorage Token:</strong>{' '}
        {tokens.localStorage ? (
          <span style={{ color: 'green' }}>{tokens.localStorage.substring(0, 15)}...</span>
        ) : (
          <span style={{ color: 'red' }}>Not found</span>
        )}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>sessionStorage Token:</strong>{' '}
        {tokens.sessionStorage ? (
          <span style={{ color: 'green' }}>{tokens.sessionStorage.substring(0, 15)}...</span>
        ) : (
          <span style={{ color: 'red' }}>Not found</span>
        )}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>justLoggedIn Flag:</strong>{' '}
        {tokens.justLoggedIn ? (
          <span style={{ color: 'green' }}>{tokens.justLoggedIn}</span>
        ) : (
          <span style={{ color: 'red' }}>Not found</span>
        )}
      </div>

      <div>
        <strong>Cookies:</strong>
        {tokens.cookies.length > 0 ? (
          <ul style={{ margin: '5px 0 0 0', padding: '0 0 0 20px' }}>
            {tokens.cookies.map((cookie, index) => (
              <li key={index}>{cookie}</li>
            ))}
          </ul>
        ) : (
          <span style={{ color: 'red' }}> No cookies found</span>
        )}
      </div>
    </div>
  );
};

export default TokenDebug;
