import { Fragment, useState, useMemo, useRef, useEffect } from 'react';
import { uuid } from '@grrr/utils';
import { PATH_HOME } from 'configs/paths';
import { EXTERNAL_LOGIN_URL, LOGIN_URL } from 'configs/constants';

import { Button, ButtonSet, Footer, FormGroup, IconComponent, InputField, Modal } from 'components';
import LogoOutline from 'assets/pwc-logo-outline.svg';
import LogoutSearchIcon from 'assets/icons/logout-search.svg?react';
import useUserContext from 'contexts/UserContext';

import styles from './Login.module.scss';
const APP_LOGIN_FAILED_FORM_ID = 'app-login-failed-form';
const FAILED_LOGIN_MODAL_ID = 'failed-login-modal-id';


const FailedLogin = () => {

  const formRef = useRef<HTMLFormElement | null>(null);
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({ email: ''});
  const { clearCsrfToken } = useUserContext();
  const [isActive, setIsActive] = useState(true);

  // Unique IDs to be used
  const generalFormId = useMemo(() => uuid(), []);


  /**
   * Check if form is valid.
   */
  const isFormValid = () => {
    if (!formRef?.current) return;
    const isValidEmail = formValues?.email?.length > 1 && formValues.email.includes('@');
    return formRef.current?.checkValidity();
  };

  /**
   * Handle Form input changes.
  */
  const onFormInputChange = (_e: any) => {
    if (!formRef.current) return;

    const dataUpdated: { [key: string]: any } = Object.fromEntries(new FormData(formRef.current).entries());
    setFormValues(dataUpdated);
  }


  /**
   * Clear the CSRF token when the user logs out
   */
  useEffect(() => {
    clearCsrfToken();
  }, [clearCsrfToken]);


  return (
    <Fragment>
      <section className={styles.root}>
        <article>
          <header className={styles.root__header}>
            <img src={LogoOutline} alt="PwC Logo" />
          </header>

          <h2>Welcome to the <br /> Sustainability Legislation Navigator</h2>
          <p className={styles.root__text}>
            Your personalized destination for sustainability legislation information, streamlining legal compliance documents,
            and fostering collaboration across your company departments.
          </p>
          <p className={styles.root__text}>Get the information you need, precisely when you need it.</p>

          <div data-btn-groups>
            <form
              action={EXTERNAL_LOGIN_URL}
              method='POST'
              id={`${APP_LOGIN_FAILED_FORM_ID}-${generalFormId}`}
              onChange={onFormInputChange}
              ref={formRef}
            >
              <FormGroup data-group="external_sso">
              <InputField
                name="email"
                type='email'
                label=''
                subLabel='Verified email address or SSO code:'
                inputValue={''}
                placeholder='example@complany.com'
              />
              </FormGroup>
              <ButtonSet>
                <Button
                  variation="primary"
                  size="large"
                  type='submit'
                  data-disabled={!isFormValid()}
                  aria-controls={`${APP_LOGIN_FAILED_FORM_ID}-${generalFormId}`}
                  form={`${APP_LOGIN_FAILED_FORM_ID}-${generalFormId}`}
                  title='Continue to Login using your email address'
                >
                  Click here to try again
                </Button>
              </ButtonSet>
            </form>
            <ButtonSet data-pwc-sso>
              <p data-other-choice>Or continue with:</p>
              <Button variation="secondary" size="large" type='button' onClick={() => window.location.assign(LOGIN_URL)}>
                PwC SSO Login
              </Button>
            </ButtonSet>
          </div>
        </article>

        <section className={styles.root__account}>
          <div hidden>
            <p>No account?</p>
            <Button variation="tertiary" size="large" url={PATH_HOME}>Create a PwC SSO account</Button>
          </div>
          <p>Having trouble logging in? Please request assistance from your PwC Contact.</p>
        </section>

        <div className={styles.root__searcicon}>
          <LogoutSearchIcon />
        </div>

        <Footer data-is-admin={false} data-page='logout'/>
      </section>
      <Modal
        id={FAILED_LOGIN_MODAL_ID}
        isOpen={isActive}
        onOpen={() => setIsActive(true)}
        onClose={() => setIsActive(false)}
        data-login-failed
      >
        <header data-project-create-header>
          <Button
            variation='transparent'
            onClick={() => setIsActive(false)}
            size='small'
          >
            <IconComponent name="CloseOutlineIcon" />
          </Button>
        </header>
        <figure>
          <IconComponent name="LoginFailedIcon" />
      </figure>
      <h3>No login method found</h3>
      <p>The <strong><em>email address</em></strong> you entered is not linked to a valid login method. Please check your email address or contact your administrator for assistance.</p>

      <ButtonSet data-go-back>
        <Button variation="primary" size="large" type='button' onClick={() => setIsActive(false)}>
          Back to Login Page
        </Button>
      </ButtonSet>
      </Modal>
    </Fragment>
  );

};

export default FailedLogin;
