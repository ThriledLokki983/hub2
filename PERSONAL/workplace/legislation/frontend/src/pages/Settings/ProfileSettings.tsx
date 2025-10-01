import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uuid } from '@grrr/utils';

import { useQueryApi } from 'hooks';
import { useAppStateContext, useUserContext } from 'contexts';

import {
  Form,
  Button,
  ButtonSet,
  FormGroup,
  TopContent,
  IconComponent,
  Footer,
  InputField,
  Select,
} from 'components';

import { INVALID_SELECTION } from 'configs/constants';
import { UPDATE_USER, GET_JOB_ROLES } from 'configs/api-endpoints';
import { UserInterface, UserProfile } from 'hooks/interfaces';

import { JobRole } from 'hooks/interfaces/legislation.interface';
import { Key, ListBoxItem } from 'react-aria-components';
import styles from './ProfileSettings.module.scss';

interface RoleData {
  identifier: string;
  name: string;
  id: string;
  isNew: boolean;
  value: string;
}


const ProfileSettings = ({ ...props }) => {
  const navigate = useNavigate();

  const formRef = useRef<HTMLFormElement | null>(null);
  const { updateUserProfileData, user } = useUserContext();
  const { showMessage, showError } = useAppStateContext();

  const [permissions, setPermission] = useState<string[]>([]);
  const [formValues, setFormValues] = useState([]);
  const [showAddRole, setShowAddRole] = useState(false);
  const [formHasChanged, setFormHasChanged] = useState(false);
  const [roles, setRoles] = useState(
    !user.is_admin ? user.profile.job_role_list
    .map((r) => ({ ...r, id: uuid(), value: r.name, isNew: false })) || []
    : user.profile.groups.map((p) => ({
      id: `${p}-${uuid()}`,
      identifier: `${p}-${uuid()}`,
      value: p,
      name: `${p?.charAt(0).toUpperCase() || ''}${p.slice(1)}`,
      isNew: false,
    }))
  );
  const { get: getJobRoles } = useQueryApi(GET_JOB_ROLES);
  const { post: updateUser } = useQueryApi({...UPDATE_USER, endpoint: `/profiles/profile/${user.profile.identifier}/`});

  const { data, mutate: updateUserDetails, isError, isSuccess } = updateUser();
  const { data: jobRolesData, isLoading } = getJobRoles(null);


  /**
   * Set the job roles data
   */
  const filterRoles = useMemo(() => {
    if (!jobRolesData?.results?.length || isLoading) return [];
    return (jobRolesData.results as JobRole[]);
  }, [jobRolesData, isLoading]);


  /**
   * Check if form is valid.
   */
  const isFormValid = () => {
    return formRef?.current?.checkValidity();
  };


  /**
   * Handle Form input changes.
   */
  const onFormInputChange = (e: any) => {
    if (!formRef.current) {
      setFormHasChanged(false);
      return;
    }

    const dataUpdated: { [key: string]: any } = {};
    const formData = new FormData(formRef.current);

    formData.forEach((value, key) => {
      dataUpdated[key] = value;
    });

    setFormValues((prev) => ({ ...prev, ...dataUpdated }));
    setFormHasChanged(true);
  };


  /**
   * Handle form submission.
   */
  const formSubmitHandler = (e: any) => {
    e.preventDefault();

    if (!isFormValid()) {
      return;
    }

    const formatPayload = (data: any) => {
      const job_role_list: JobRole[] = [];
      const newData: Partial<UserProfile> = {};

      for (const key in data) {
        if (key.startsWith("role_data_")) {
          job_role_list.push((data as any)[key]);
        } else {
          (newData as any)[key] = (data as any)[key];
        }
      }

      // Add already existing jobRoles to the newData
      const existingJobRoles = roles.map((r) => r.identifier);
      const existingPermissions = user.profile.groups.map((p) => p);

      if (user.is_admin) {
        return { ...newData, groups: [...permissions, ...existingPermissions] }
      }

      return { ...newData, job_role_list: [...job_role_list, ...existingJobRoles] };
    };

    const payload = formatPayload(formValues);
    updateUserDetails(payload);
    setFormHasChanged(false)
  };


  /**
   * Update the userdata and the UI
   */
  useEffect(() => {
    if (isSuccess) {
      updateUserProfileData({ profile: { ...data.results as UserProfile } });
      showMessage({
        active: true,
        title: 'Profile successfully updated',
        message: 'You profile is updated with the new data provided',
        type: 'message',
        persistent: false,
      });
    }

    if (isError) {
      showError({
        title: 'Something went wrong',
        message: 'Sorry, something went wrong with updating the profile data. Please try again later.',
        type: 'message',
        active: true,
        persistent: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError])


  /**
   * Add new role to the list
   */
  const onRoleAdd = () => {
    setShowAddRole(true);
  };


  /**
   * Handles adding a new permission which is currently not available
   * However, I anticipate this to be added at a later stage
   * @param newValue
   * @returns
   */
  const onPermissionAdd = (newValue: string) => {
    if (!newValue || newValue.includes(INVALID_SELECTION.toLowerCase().replace(' ', '_'))) {
      setShowAddRole(false);
      return;
    }

    const formattedValue = newValue.replace('_', ' ');

    if (formattedValue) {
      setFormHasChanged(true);
      setPermission((prev) => [ ...prev, formattedValue]);

      // check if the formatted value is already in the roles list
      if (roles.map((r) => r.name.toLowerCase()).includes(formattedValue.toLowerCase())) {
        setShowAddRole(false);
        return;
      }

      const valueIdentifier = filterRoles
        .find((r: any) => r.name.toLowerCase() === formattedValue.toLowerCase())
        ?.identifier ?? `${formattedValue}-${uuid()}`;

      const newRole = {
        id: `${formattedValue}-${uuid()}`,
        identifier: valueIdentifier,
        value: formattedValue,
        name: `${formattedValue?.charAt(0).toUpperCase() || ''}${formattedValue.slice(1)}`,
        isNew: true,
      }

      setRoles((prev) => [ ...prev, newRole]);
      setShowAddRole(false);
    }

  };


  /**
   * Remove role from the list
   * @param index
   */
  const onRoleRemove = (index: number) => {
    setFormHasChanged(true);
    setRoles(roles.filter((_, i) => i !== index));
  };


  /**
   * Handle the input change
   * Update role for the input field that is being changed
   * @param id
   * @param value
   */
  const handleRoleChange = (id: string, value: string) => {
    setRoles((prev) => {
      return [...prev.map((r) => r.id === id ? { ...r, value, name: value } : r)]
    })
  };


  /**
   *  Go back when user last was
   */
  const goBack = () => {
    navigate(-1);
  };


  return (
    <section className={styles.root} data-main-content data-settings>

      {/* Top Content */}
      <TopContent isDetails data-settings-head>
        <Fragment>
          <h3>Account Settings</h3>
          <p>Manage your account details, including the selected roles, with options to view and edit your information.</p>
        </Fragment>
      </TopContent>

      <article className={styles.root__form}>
        <Form
          id={'generalFormId'}
          onSubmit={formSubmitHandler}
          ref={formRef}
          {...props}
        >
          <FormGroup data-form-profile-group>
            <InputField
              name="first_name"
              label='first name'
              inputValue={user.profile.first_name ?? ''}
              data-is-disabled
              readOnly
            />
          </FormGroup>
          <FormGroup data-form-profile-group>
            <InputField
              name="middle_name"
              label='middle name'
              inputValue={'N/A'}
              data-is-disabled
              readOnly
            />
          </FormGroup>
          <FormGroup data-form-profile-group>
            <InputField
              name="last_name"
              label='last name'
              inputValue={user.profile.last_name ?? ''}
              data-is-disabled
              readOnly
            />
          </FormGroup>
          <FormGroup data-form-profile-group>
            <InputField
              name="email"
              label='email'
              inputValue={user.profile.username || user.profile.email || ''}
              data-is-disabled
              readOnly
            />
          </FormGroup>

          <RolePermission
            roleList={roles}
            user={user}
            options={filterRoles?.map((r) => r.name)}
            showAddRole={showAddRole}
            onRoleAdd={onRoleAdd}
            onPermissionAdd={onPermissionAdd}
            onRoleRemove={onRoleRemove}
            handleRoleChange={handleRoleChange}
          />
          <ButtonSet data-btn-set-submit>
            <Button variation="secondary" onClick={goBack}>Go Back</Button>
            <Button variation="primary" type="submit" disabled={!formHasChanged}>Update Profile</Button>
          </ButtonSet>
        </Form>
      </article>

      <Footer data-is-admin={user.is_admin} data-page='navigator'/>
    </section>
  );

};

export default ProfileSettings;


///////////////////////////////////////////
// Role data component
// With Logic to add and remove roles
//////////////////////////////////////////


interface RoleDataInputProps {
  roleList: RoleData[];
  showAddRole: boolean;
  options: string[];
  onRoleAdd: () => void;
  onPermissionAdd: (permission: string) => void;
  user: UserInterface;
  onRoleRemove: (index: number) => void;
  handleRoleChange: (id: string, value: string) => void;
  [key: string]: any;
}

const RolePermission = ({
  roleList,
  user,
  options,
  showAddRole = false,
  onRoleAdd,
  onRoleRemove,
  onPermissionAdd,
  handleRoleChange,
  ...rest
}: RoleDataInputProps) => {

  const [selected, setSelected] = useState<Key | null>(options[0]);


  /**
   * Handles setting the selected role.
   */
  useEffect(() => {
    setSelected('Select Role');
  }, [options]);


  return (
    <div className={styles.root__rolelist}>
      <FormGroup data-form-profile-group data-roles >
        <h6 className={styles.root__rolelistheader}>
          {user.is_admin ? 'admin permissions' : 'selected roles'}
        </h6>
        <span data-subtitle>
          The legislations will be adjusted to the roles you have selected.
        </span>
      </FormGroup>
      <FormGroup data-form-profile-group data-roles >
        <></>
      </FormGroup>
      {roleList.map((role, index) => (
        <FormGroup
            key={`role-${role.identifier}-${index}`}
            className={styles.root__box}
            style={{ viewTransitionName: `b${index}` }}
            data-form-profile-group
            data-roles
          >
          <div className={styles.root__forminput} {...rest}>
            <input
              key={role.identifier}
              id={role.name}
              type='text'
              name={`${!user.is_admin ? `role_data_${role.id}` : ''}`}
              defaultValue={role.name}
              onChange={(e) => handleRoleChange(role.id, e.target.value)}
              disabled
            />
          </div>
          {!user.is_admin ? (
            <Button
              variation='primary'
              onClick={() => onRoleRemove(index)}
            >
              <IconComponent name="DeleteOutlineIcon" />
            </Button>
          ): null }
       </FormGroup>
      ))}
      {!user.is_admin && showAddRole ? (
        <FormGroup data-form-profile-group data-roles >
          <div className={styles.root__dropdown}>
            <Select
              title="Select Role"
              items={options.map((o, index) => ({ name: o, id: index }))}
              selectedKey={selected}
              data-profile-setting
              onSelectionChange={(selected) => {
                setSelected(selected);
                onPermissionAdd(selected as string);
              }}
              placeholder='Select Role'
            >
              {(item) => (
                <ListBoxItem
                  id={item.name}
                  key={`${item.id}-${item.id}`}
                  data-select-item
                  isDisabled={roleList.map((r) => r.name.toLowerCase()).includes(item.name.toLowerCase())}
                >
                  {item.name}
                </ListBoxItem>
              )}
            </Select>
          </div>
      </FormGroup>
      ) : null}
      <FormGroup data-form-profile-group data-roles >
        <ButtonSet data-btn-set data-profile>
          {!user.is_admin ? (
            <Button variation="secondary-trans" onClick={onRoleAdd}>
              <IconComponent name="PlusFillIcon" />
              &nbsp; Add New Role
            </Button>
          ) : null}
        </ButtonSet>
      </FormGroup>
    </div>
  );

};
