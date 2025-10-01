import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PATH_HOME, PATH_RESET_PASSWORD, PATH_SIGNUP } from 'configs/paths';
import { LOGIN } from 'configs/api-endpoints';
import { useMutationApi } from 'hooks/useQueryApi';
import useUserContext from 'contexts/UserContext';
import { handleDashboardRedirect } from './utils';
import Icon from 'components/Icon/Icon';
import LabeledInput from 'components/LabeledInput/LabeledInput';
import styles from './Login.module.scss';
import { UserInterface } from 'hooks/interfaces';
import TokenDebug from './TokenDebug';

// Define the location state interface with returnUrl
interface LocationState {
  returnUrl?: string;
}

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useUserContext();

  // Extract returnUrl from location state if available
  const state = location.state as LocationState;
  const returnUrl = state?.returnUrl || PATH_HOME;

  // Use the mutation API for login
  const { mutate: loginMutation, isPending: loading } = useMutationApi<UserInterface>(LOGIN, {
    onSuccess: response => {
      // First update authentication state in context - this will store the token in our auth context
      login(response.data?.data);

      // Set a flag to prevent redirect loops
      sessionStorage.setItem('justLoggedIn', 'true');

      // Give the system time to update the auth state and store tokens
      setTimeout(() => {
        // Check for a stored return URL from the interceptor
        const storedReturnUrl = sessionStorage.getItem('returnUrl');

        if (storedReturnUrl) {
          sessionStorage.removeItem('returnUrl');
          handleDashboardRedirect(navigate, storedReturnUrl);
        } else {
          handleDashboardRedirect(navigate, returnUrl);
        }

        // Clear the flag after a delay (5 seconds) to prevent potential timing issues
        setTimeout(() => {
          sessionStorage.removeItem('justLoggedIn');
        }, 5000);
      }, 500); // Longer delay to ensure login state is properly set
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : 'Invalid credentials. Please try again.';
      setError(errorMessage);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');

    // Use the mutation to send the login request
    loginMutation({
      email: formData.email,
      password: formData.password,
    });
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.brandSidebar}>
          <div className={styles.brandContent}>
            <h2 className={styles.brandTitle}>HuisHelder</h2>
            <p className={styles.brandTagline}>Find your dream home in the Netherlands</p>
          </div>
        </div>

        <div className={styles.formSection}>
          <div className={styles.header}>
            <h1 className={styles.title}>Welcome Back</h1>
            <p className={styles.subtitle}>Log in to your HuisHelder account</p>
            {returnUrl !== PATH_HOME && (
              <p className={styles.subtitle}>
                <small>You&apos;ll be redirected after login</small>
              </p>
            )}
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <LabeledInput
              id="email"
              label="Email"
              icon={{
                object: () => (
                  <Icon name="envelope" phosphor="Envelope" weight="light" width={20} />
                ),
              }}
            >
              <input
                type="email"
                name="email"
                placeholder=""
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </LabeledInput>

            <div className={styles.passwordContainer}>
              <LabeledInput
                id="password"
                label="Password"
                icon={{
                  object: () => <Icon name="lock" phosphor="Lock" weight="light" width={20} />,
                }}
              >
                <input
                  type="password"
                  name="password"
                  placeholder=""
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </LabeledInput>
              <Link to={PATH_RESET_PASSWORD} className={styles.forgotPassword}>
                Forgot password?
              </Link>
            </div>

            <button type="submit" className={styles.loginButton} disabled={loading}>
              {loading ? (
                <>
                  <Icon
                    name="circle-notch"
                    phosphor="CircleNotch"
                    weight="light"
                    width={20}
                    className={styles.spinnerIcon}
                  />
                  Signing In...
                </>
              ) : (
                <>
                  <Icon name="signin" phosphor="SignIn" weight="light" width={20} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className={styles.footer}>
            <p>
              Don&apos;t have an account?{' '}
              <Link to={PATH_SIGNUP} className={styles.signupLink}>
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
