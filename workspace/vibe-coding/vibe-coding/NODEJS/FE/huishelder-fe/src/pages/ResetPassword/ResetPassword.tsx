import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PATH_LOGIN } from 'configs/paths';
import Icon from 'components/Icon/Icon';
import LabeledInput from 'components/LabeledInput/LabeledInput';
import { REQUEST_PASSWORD_RESET, CONFIRM_PASSWORD_RESET } from 'configs/api-endpoints';
import { useMutationApi } from 'hooks/useQueryApi';
import styles from './ResetPassword.module.scss';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'request' | 'confirm' | 'success'>('request');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Request password reset mutation using the new axios-based mutation
  const { mutate: requestReset, isPending: requestLoading } = useMutationApi(
    REQUEST_PASSWORD_RESET,
    {
      onSuccess: () => {
        setStep('confirm');
      },
      onError: (err: any) => {
        setError('Could not process your request. Please try again.');
        console.error('Password reset request error:', err);
      },
    },
  );

  // Confirm password reset mutation using the new axios-based mutation
  const { mutate: confirmReset, isPending: confirmLoading } = useMutationApi(
    CONFIRM_PASSWORD_RESET,
    {
      onSuccess: () => {
        setStep('success');
      },
      onError: (err: any) => {
        setError('Could not reset your password. Please try again.');
        console.error('Password reset confirmation error:', err);
      },
    },
  );

  const handleRequestReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setError('');
    requestReset({ email });
  };

  const handleConfirmReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setError('');
    confirmReset({
      email,
      code,
      password: newPassword,
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
          {step === 'request' && (
            <>
              <div className={styles.header}>
                <h1 className={styles.title}>Reset Your Password</h1>
                <p className={styles.subtitle}>
                  We&apos;ll email you instructions to reset your password
                </p>
              </div>

              {error && <div className={styles.errorMessage}>{error}</div>}

              <form className={styles.form} onSubmit={handleRequestReset}>
                <LabeledInput
                  id="reset-email"
                  label="Email Address"
                  icon={{
                    object: () => (
                      <Icon
                        name="envelope"
                        phosphor="Envelope"
                        weight="light"
                        width={20}
                        color="#3A4F41"
                      />
                    ),
                  }}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </LabeledInput>

                <button type="submit" className={styles.resetButton} disabled={requestLoading}>
                  {requestLoading ? (
                    <>
                      <Icon
                        name="circle-notch"
                        phosphor="CircleNotch"
                        weight="light"
                        width={20}
                        className={styles.spinnerIcon}
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Icon
                        name="paper-planet"
                        phosphor="PaperPlaneTilt"
                        weight="light"
                        width={20}
                      />
                      Send Reset Instructions
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {step === 'confirm' && (
            <>
              <div className={styles.header}>
                <h1 className={styles.title}>Create New Password</h1>
                <p className={styles.subtitle}>
                  Enter the code we sent to {email} and create your new password
                </p>
              </div>

              {error && <div className={styles.errorMessage}>{error}</div>}

              <form className={styles.form} onSubmit={handleConfirmReset}>
                <LabeledInput
                  id="reset-code"
                  label="Verification Code"
                  icon={{
                    object: () => (
                      <Icon
                        name="shield-check"
                        phosphor="ShieldCheck"
                        weight="light"
                        width={20}
                        color="#3A4F41"
                      />
                    ),
                  }}
                >
                  <input
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    required
                  />
                </LabeledInput>

                <LabeledInput
                  id="reset-new-password"
                  label="New Password"
                  icon={{
                    object: () => (
                      <Icon
                        name="lock-simple"
                        phosphor="LockSimple"
                        weight="light"
                        width={20}
                        color="#3A4F41"
                      />
                    ),
                  }}
                >
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="8+ characters"
                    required
                  />
                </LabeledInput>

                <LabeledInput
                  id="reset-confirm-password"
                  label="Confirm New Password"
                  icon={{
                    object: () => (
                      <Icon
                        name="lock-key"
                        phosphor="LockKey"
                        weight="light"
                        width={20}
                        color="#3A4F41"
                      />
                    ),
                  }}
                >
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                  />
                </LabeledInput>

                <button type="submit" className={styles.resetButton} disabled={confirmLoading}>
                  {confirmLoading ? (
                    <>
                      <Icon
                        name="circle-notch"
                        phosphor="CircleNotch"
                        weight="light"
                        width={20}
                        className={styles.spinnerIcon}
                      />
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      <Icon name="key" phosphor="Key" weight="light" width={20} />
                      Reset Password
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {step === 'success' && (
            <div className={styles.successState}>
              <div className={styles.header}>
                <Icon
                  name="check-circle"
                  phosphor="CheckCircle"
                  weight="light"
                  width={48}
                  color="#3A4F41"
                  className={styles.successIcon}
                />
                <h1 className={styles.title}>Password Reset Successful</h1>
                <p className={styles.subtitle}>Your password has been successfully updated</p>
              </div>

              <Link to={PATH_LOGIN} className={styles.loginButton}>
                <Icon phosphor="SignIn" weight="light" width={20} />
                Return to Login
              </Link>
            </div>
          )}

          <div className={styles.footer}>
            <p>
              Remembered your password?{' '}
              <Link to={PATH_LOGIN} className={styles.loginLink}>
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
