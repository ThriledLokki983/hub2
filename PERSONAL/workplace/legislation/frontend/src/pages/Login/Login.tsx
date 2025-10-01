import { useEffect, useMemo, useRef, useState } from 'react';
import { uuid } from '@grrr/utils';
import { PATH_HOME } from 'configs/paths';
import { EXTERNAL_LOGIN_URL } from 'configs/constants';

import { Button, ButtonSet, Footer, FormGroup, InputField } from 'components';
import LogoOutline from 'assets/pwc-logo-outline.svg';
import LogoutSearchIcon from 'assets/icons/logout-search.svg?react';
import useUserContext from 'contexts/UserContext';

import styles from './Login.module.scss';
const APP_LOGIN_FORM_ID = 'app-login-form';
const PWC_REGISTER = 'https://login.pwc.com/identity/register';
const PWC_CONTACT = 'https://pwceur.sharepoint.com/sites/Spark/SitePages/Item-Not-Migrated.aspx?requestUrl=https://pwceur.sharepoint.com/SitePages/Templates/Page-not-in-Sharepoint.aspx';


const Login = () => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({ email: ''});

  const { clearCsrfToken, login, user } = useUserContext();


  // Unique IDs to be used
  const generalFormId = useMemo(() => uuid(), []);


  /**
   * Check if form is valid.
   */
  const isFormValid = () => {
    if (!formRef?.current) return false;
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
    <section className={styles.root}>
      <article>
        <header className={styles.root__header}>
          <img src={LogoOutline} alt="PwC Logo" />
        </header>

        <h2>Welcome to the <br /> Sustainability Legislation Navigator</h2>
        <p className={styles.root__text}>
          Your personalized destination for sustainability legislation information,
          providing compliance and reporting information, and fostering collaboration
          across your company's departments.
        </p>
        <p className={styles.root__text}>Get the information you need, precisely when you need it.</p>

       <div data-btn-groups>
        <form
          action={EXTERNAL_LOGIN_URL}
          method='POST'
          id={`${APP_LOGIN_FORM_ID}-${generalFormId}`}
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
              aria-controls={`${APP_LOGIN_FORM_ID}-${generalFormId}`}
              form={`${APP_LOGIN_FORM_ID}-${generalFormId}`}
              title='Continue to Login using your email address'
              >
              Continue
            </Button>
          </ButtonSet>
        </form>
          <ButtonSet data-pwc-sso>
            <p data-other-choice>Or continue with:</p>
            <Button variation="secondary" size="large" type='button' onClick={login}>
              PwC SSO Login
            </Button>
          </ButtonSet>
       </div>
      </article>

      <section className={styles.root__account}>
        <div>
          <p>No account?</p>
          <Button variation="tertiary" size="large" url={PWC_REGISTER}>Create a PwC SSO account</Button>
        </div>
        <p>Having trouble logging in? Please request assistance from your <Button variation='tertiary' url={PWC_CONTACT} size='small'>PwC Contact</Button>.</p>
      </section>

      <div className={styles.root__searcicon}>
        <LogoutSearchIcon />
      </div>

      <Footer data-is-admin={user?.is_admin || false } data-page='logout'/>
    </section>
  );

};

export default Login;
