import { useMemo, useRef } from 'react';
import { Button, ButtonSet, Form } from 'components';

import { REVIEW_STATE } from 'configs/legislation/legislation';

import { EditProps } from './TabPages/interfaces';
import { Legislation } from 'hooks/interfaces';
import styles from './Edit.module.scss';

const JOB_ROLES = 'job_roles';

const EditRoleContent = ({   legislation,
  user,
  isEditing,
  setIsEditing,
  filters,
  ...props
}: EditProps) => {
  const formRef = useRef<HTMLFormElement | null>(null);

  // Unique IDs to be used
  const generalFormId = useMemo(() => crypto.randomUUID(), []);


  /**
   * Handle form submission.
   */
  const formSubmitHandler = (e: any) => {
    e.preventDefault();
  };


  /**
   * Show the correct button
   */
  const editButton = () => {
    return (
      <ButtonSet className={styles.root__buttongroup}>
        <Button
          variation='cancel'
          size="small"
          type='button'
          title={`Save changes for: ${(legislation as Legislation)?.name_generic || ''}`}
          onClick={() => setIsEditing(false)}
        >
          Cancel
        </Button>
        <Button
          variation='primary'
          size="small"
          title={`${user.is_approver && legislation.preparation_state === REVIEW_STATE
            ? 'Approved for:'
            : 'Send '}'${(legislation as Legislation)?.name_generic || '' }' ${user.is_approver
              ? '' : 'for review'
            }`
          }
          data-user-type={user.is_approver && legislation.preparation_state === REVIEW_STATE ? 'approver' : 'preparer'}
          type='submit'
        >
          Save
        </Button>
      </ButtonSet>
    );
  };

  return (
    <section
      className={styles.root}
      hidden={!isEditing}
      data-main-content
      data-edit-content
      data-role-specific
      {...props}
    >
      <Form
        id={generalFormId}
        data={{}}
        onSubmit={formSubmitHandler}
        ref={formRef}
        {...props}
      >
        <header className={styles.root__header}>
          <div className={styles.root__headertop}>
            <h3>Client specific content</h3>
            {editButton()}
          </div>

          <h4>{legislation.name_generic === 'nan' ? legislation.name_local : legislation.name_generic}</h4>
          <p>Add client role-specific content for this legislation. This will appear on the equivalent client-defined user roles.</p>
        </header>
        <p>This part is still under development. (EditRoleContent.tsx) &nbsp; ¯\_(ツ)_/¯</p>
      </Form>
    </section>
  );

};

export default EditRoleContent;
