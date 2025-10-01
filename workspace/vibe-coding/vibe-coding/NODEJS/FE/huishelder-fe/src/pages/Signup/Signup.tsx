import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PATH_LOGIN, PATH_HOME, PATH_JOURNEY_DASHBOARD } from 'configs/paths';
import { SIGN_UP } from 'configs/api-endpoints';
import { useMutationApi } from 'hooks/useQueryApi';
import useUserContext from 'contexts/UserContext';
import { Icon, LabeledInput } from 'components';
import styles from './Signup.module.scss';

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useUserContext();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  // Use the mutation API for signup
  const { mutate: signupMutation, isPending: loading } = useMutationApi(SIGN_UP, {
    onSuccess: response => {
      // Login the user with the returned data
      login(response.data);

      // Check if the user has completed onboarding
      const userData = response.data;
      const hasCompletedOnboarding =
        userData &&
        typeof userData === 'object' &&
        'onboarding_completed' in userData &&
        userData.onboarding_completed === true;

      // If onboarding is completed, redirect to Journey Dashboard
      if (hasCompletedOnboarding) {
        navigate(PATH_JOURNEY_DASHBOARD, { replace: true });
      } else {
        // Otherwise navigate to home after successful signup
        navigate(PATH_HOME, { replace: true });
      }
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : 'Could not create your account. Please try again.';
      setError(errorMessage);
      console.error('Signup error:', error);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { firstName, lastName, email, password, confirmPassword } = formData;

    // Simple validation
    if (!firstName || !lastName || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setError('');

    // Send signup data to the backend using mutation
    signupMutation({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
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
            <h1 className={styles.title}>Create Your Account</h1>
            <p className={styles.subtitle}>Join HuisHelder to start your property journey</p>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
              <LabeledInput
                id="firstName"
                label="First Name"
                icon={{
                  object: () => <Icon name="user" phosphor="User" weight="light" width={20} />,
                }}
              >
                <input
                  type="text"
                  name="firstName"
                  placeholder=""
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </LabeledInput>

              <LabeledInput
                id="lastName"
                label="Last Name"
                icon={{
                  object: () => <Icon name="user" phosphor="User" weight="light" width={20} />,
                }}
              >
                <input
                  type="text"
                  name="lastName"
                  placeholder=""
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </LabeledInput>
            </div>

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

            <LabeledInput
              id="confirmPassword"
              label="Confirm Password"
              icon={{
                object: () => <Icon name="lock" phosphor="Lock" weight="light" width={20} />,
              }}
            >
              <input
                type="password"
                name="confirmPassword"
                placeholder=""
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </LabeledInput>

            <div className={styles.terms}>
              <p>
                <Icon name="check" phosphor="Check" weight="light" width={16} color="#3A4F41" />
                By creating an account, you agree to our <a href="/terms">
                  Terms of Service
                </a> and <a href="/privacy">Privacy Policy</a>.
              </p>
            </div>

            <button type="submit" className={styles.signupButton} disabled={loading}>
              {loading ? (
                <>
                  <Icon
                    name="circle-notch"
                    phosphor="CircleNotch"
                    weight="light"
                    width={20}
                    className={styles.spinnerIcon}
                  />
                  Creating Account...
                </>
              ) : (
                <>
                  <Icon name="user-plus" phosphor="UserPlus" weight="light" width={20} />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className={styles.footer}>
            <p>
              Already have an account?{' '}
              <Link to={PATH_LOGIN} className={styles.loginLink}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
