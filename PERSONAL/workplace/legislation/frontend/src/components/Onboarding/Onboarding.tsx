import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'helpers/utils';

import { useQueryApi } from 'hooks';
import { useUserContext } from 'contexts';

import { Modal, ButtonSet, Button } from 'components';
import { PATH_NAVIGATOR, PATH_PROJECTS } from 'configs/paths';
import { ROLE_LIST, ONBOARDING_DIALOG_ID, STORAGE_KEY_ONBOARDED } from 'configs/onboarding/onboarding';

import { UPDATE_USER, GET_JOB_ROLES } from 'configs/api-endpoints';
import { OnboardingProps } from './Onboarding.interface';


import FirstOnboardIcon from '../../assets/icons/onboard-1.svg';
import SecondOnboardIcon from '../../assets/icons/onboard-2.svg';
import LastOnboardIcon from '../../assets/icons/onboard-3.svg';
import { UserProfile } from 'hooks/interfaces';
import styles from './Onboarding.module.scss'


const Onboarding = ({ isOnboarded, user }: OnboardingProps) => {
  const navigate = useNavigate();

  const { updateUserProfileData } = useUserContext();
  const [onboardingIsOpen, setOnboardingIsOpen] = useState(true);
  const [step, setStep] = useState(1);
  const [roles, setRoles] = useState(ROLE_LIST);
  const disableSubmitButton = useMemo(() => step === 4 && roles.every((r) => !r.checked), [roles, step]);
  const disableSKipButton = useMemo(() => step >= 3, [step]);

  const { post: updateUserRoles } = useQueryApi({ ...UPDATE_USER, endpoint: `/profiles/profile/${user.profile.identifier}/` });
  const { get: getJobRoles } = useQueryApi(GET_JOB_ROLES);

  const { data, error, isLoading: isrLoading } = getJobRoles(null);
  const { data: updatedProfile, mutate: updateRoles, isSuccess, isError } = updateUserRoles();



  /**
   * Handle onboarding completion, and flag it in the backend and user state if needed.
   */
  const completeOnboarding = (e: any) => {
    const payload = {
      job_role_list: roles.filter((role) => role.checked).map((role: any) => role.identifier)
    };

    if (!payload.job_role_list.length) {
      return;
    }

    updateRoles(payload);
  };

  /**
   * Update the user profile data and close the onboarding dialog if the update was successful
   */
  useEffect(() => {
    if (isSuccess) {
      updateUserProfileData(updatedProfile.results as UserProfile)
      setOnboardingIsOpen(false);
      store(STORAGE_KEY_ONBOARDED, true, { permanent: true });
      window.location.reload();

      user.is_admin
        ? navigate(PATH_PROJECTS)
        : navigate(PATH_NAVIGATOR);

    } else if (isError) {
      // Handle error here
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);


  /**
   * Handle going next in the onboarding steps.
   */
  const nextClickHandler = (e: any) => {
    if (step === 4) {
      completeOnboarding(e);
      return;
    }

    setStep(step + 1);
  };

  /**
   * Toggles the role button and updates the roles state.
   *
   * @param e - The event object.
   * @param index - The index of the role button.
   */
  const toggleRoleButton = (e: any, index: number) => {
    e.target.checked = !e.target.checked;

    setRoles(roles.map((role, roleIndex) => {
      return roleIndex === index ? { ...role, checked: !role.checked } : role;
    }));
  };

  // Get the job roles from the API
  useEffect(() => {
    if (!data?.errors?.length && !isrLoading) {
      const { results } = data;

      // Set the roles state with the fetched roles
      setRoles(results
        .map((r: any) => ({
          identifier: r.identifier,
          label: r.name,
          checked: false,
        }))
        // .sort((a: any, b: any) => a.label.length - b.label.length)
      );
    }
  }, [data, isrLoading]);


  return (
    <Modal
      id={ONBOARDING_DIALOG_ID}
      isOpen={!isOnboarded && onboardingIsOpen}
      onOpen={() => setOnboardingIsOpen(true)}
      onClose={() => setOnboardingIsOpen(false)}
      isDismissable={false}
      data-onboarding
    >

    {/* Onboarding step 2 */}
    <article className={styles.root__content} hidden={step !== 1} data-right={step === 1} data-left={step === 0} data-step={step}>
      <figure>
        <img src={FirstOnboardIcon} alt="First Onboarding illustration"/>
      </figure>
      <h2>Welcome to the Sustainability Legislation Navigator </h2>
      <p>
      The Sustainability Legislation Navigator offers information relevant to you to be
      able to navigate the sustainability legislation landscape, while tailored to your role.
      Whether you're a compliance officer, legal or tax professional, or have another role within
      your company, you can leverage this platform to understand legal implications of your work.
      </p>
    </article>

    {/* Onboarding step 2 */}
    <article className={styles.root__content} hidden={step !== 2} data-right={step === 2} data-left={step === 1}>
      <figure>
        <img src={SecondOnboardIcon} alt="Second Onboarding illustration"/>
      </figure>
      <h2>Filter out and extract relevant insights for you</h2>
      <p>
        Discover relevant insights effortlessly - The Sustainability Legislation
        Navigator lets you filter through mountains of legal legislations using the most relevant criteria.
      </p>
    </article>

    {/* Onboarding step 3 */}
    <article className={styles.root__content} hidden={step !== 3}>
      <figure>
        <img src={LastOnboardIcon} alt="Last Onboarding illustration"/>
      </figure>
      <h2>Stay up to date with all the new legislations</h2>
      <p>
        Stay ahead with the Sustainability Legislation Navigator,
        which contains up-to-date legislations! We monitor and update
        the most recent legislation. With this, you can rely on us for accurate and legal information*.
      </p>
    </article>

    {/* Role selection */}
    <article className={styles.root__form} hidden={step !== 4}>
      <header>
        <h2>Let's make this experience relevant for <strong>you</strong></h2>
      </header>
      <p>Choose from the below. You can adjust these on your Settings anytime:</p>
      <p>Whats you role?</p>

      <ul>
        {roles.map((role: any, index) => (
          <div key={`role-${role}-${index * 178}`} className={styles.root__rolebutton}>
            <label className={styles.root__togglelabel} data-is-checked={role.checked} aria-label={role.label}>
              <span>{role.label}</span>
              <input
                type="checkbox"
                name="default_date_time"
                defaultChecked={role.checked}
                onChange={(e: any) => toggleRoleButton(e, index)}
              />
            </label>
          </div>
        ))}
      </ul>
    </article>

    {/* Navigation */}
    <nav className={styles.root__nav}>
      <ol aria-label="Steps">
        {[1, 2, 3, 4].map((s) => (
          <li key={`onboarding-step-${s}`}>
            <button title={`Go to step ${s}`} onClick={e => setStep(s)} aria-pressed={step === s}><span></span></button>
          </li>
        ))}
      </ol>
    </nav>

    <ButtonSet className={styles.root__footer}>
      <Button variation="secondary-trans" onClick={() => setStep(4)} size="medium" disabled={disableSKipButton}>
        Skip
      </Button>
      <Button type="button" onClick={nextClickHandler} size="medium" disabled={disableSubmitButton}>
        Next
      </Button>

    </ButtonSet>
    {step === 3 ? (
      <div data-extra-info>
        <span>*read more about the legislation monitoring process in our terms of use</span>
      </div>
    ) : null}
  </Modal>
  );

};

export default Onboarding;
