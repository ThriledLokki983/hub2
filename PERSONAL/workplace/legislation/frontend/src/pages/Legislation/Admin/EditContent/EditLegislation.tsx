import { useMemo, useState, useRef, useEffect, ReactNode } from 'react';
import { uuid } from '@grrr/utils';
import { store, restore } from 'helpers/utils';
import { formatAttentionPointData, formatPayload, getAllJobRoles } from 'helpers/legislations/legislation';
import {
  ButtonSet,
  Button,
  Form,
  Tabs,
  Icon,
  SplitButton,
  IconComponent,
  AlertBar,
} from 'components';

import {
  UPDATE_LEGISLATION,
  CREATE_ROLE_CONTENT,
  UPDATE_ATTENTION_POINT,
  UPDATE_CLIENT_LEGISLATION,
} from 'configs/api-endpoints';
import { useQueryApi } from 'hooks';

import { useAppStateContext, useLegislationContext } from 'contexts';
import { General, Requirements, RoleSpecific } from './TabPages';
import {
  EDIT_TABS,
  REVIEW_STATE,
  CREATED_STATE,
  GENERAL_FILTER_DATA,
  JOB_ROLE_KEY,
  APPROVED_STATE,
} from 'configs/legislation/legislation';

import { Legislation } from 'hooks/interfaces';
import { EditProps, JobRoleContent } from './TabPages/interfaces';
import { useParams } from 'react-router-dom';
import { ProjectLegislation } from 'hooks/interfaces/project.interface';
import { Filter } from 'hooks/interfaces/legislation.interface';
import styles from './Edit.module.scss';

const CURRENT_FORM_DATA_ID = 'current-edit-form-data';
interface ErrorData {
  message: string;
  errors: { [key: string]: any };
  results: null;
}


const EditLegislation = ({
  legislation,
  user,
  isEditing,
  setIsEditing,
  refetch: refetchClientLegislation,
  filters,
  editingType = "default",
  renderNotice = () => null,
  setIsReadyToDelete,
  setIsDeleted,
  isDeleted = false,
  setRequirementIdentifier,
  ...props
}: EditProps & {
  refetch?: () => void;
  renderNotice?: () => ReactNode;
  isDeleted?: boolean;
  setIsReadyToDelete?: (value: boolean) => void;
  setIsDeleted?: (value: boolean) => void;
  setRequirementIdentifier?: ({ identifier, type }: { identifier: string, type: string }) => void;
}) => {

  const { projectId } = useParams<{ projectId: string }>();

  // Form reference
  const formRef = useRef<HTMLFormElement | null>(null);
  const generalTabRef = useRef<HTMLDivElement | null>(null);
  const requirementsTabRef = useRef<HTMLDivElement | null>(null);
  const roleSpecificTabRef = useRef<HTMLDivElement | null>(null);
  const tabRef = useRef<HTMLDivElement | null>(null);

  // Unique IDs to be used
  const generalFormId = useMemo(() => uuid(), []);
  const { state, stateDispatch, stateActions } = useLegislationContext();
  const { showToast } = useAppStateContext();

  const savedFormData = restore(CURRENT_FORM_DATA_ID, { permanent: false });
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [inputType, setInputType] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savingOnly, setSavingOnly] = useState(false);
  const [isDecline, setIsDecline] = useState(false);
  const [errorIsHidden, setErrorIsHidden] = useState(false);

  const [direction, setDirection] = useState<'next' | 'previous' >('next');
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
  const [attentionPointKey, setAttentionPointKey] = useState<string>('');
  const [attentionPointValues, setAttentionPointValues] = useState<{ [key: string]: any}>({})
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [currentLegislationData, setCurrentLegislationData] = useState<Legislation>(isEditing ? legislation : {} as Legislation);
  const jobRoles = useMemo(() => state?.filters.find((f) => f.label === JOB_ROLE_KEY)?.data || [], [state?.filters]);

  const permission = useMemo(() => {
    const isApprover = user.is_approver;
    const isPreparer = user.is_preparer;
    return isApprover ? 'approver' : isPreparer ? 'preparer' : 'others';
  }, [user.is_approver, user.is_preparer]);


  const { post: updateClientLegislation } = useQueryApi(UPDATE_CLIENT_LEGISLATION);
  const { post: createRoleContent } = useQueryApi(CREATE_ROLE_CONTENT);
  const { patch: updateRoleContent } = useQueryApi(UPDATE_ATTENTION_POINT);
  const { patch: update } = useQueryApi({
    ...UPDATE_LEGISLATION,
    endpoint: `${UPDATE_LEGISLATION.endpoint}${legislation.identifier}/`,
  });


  const { mutate: updateJobRole } = updateRoleContent();
  const { mutate: createJobRole, isError } = createRoleContent();
  const { data: approvalData, mutate: updateLegislationForClient, isSuccess: isApproveSuccess } = updateClientLegislation();
  const { data: legislationData, mutate: updateLegislation, isSuccess, isError: isLegislationError, error } = update();
  const [errorData, setErrorData] = useState<ErrorData | null>(null);

  /**
   * Initially set the legislation data for the editing state
   */
  useEffect(() => {
    if (legislation?.identifier && isEditing) {
      setCurrentLegislationData(legislation);
      !isError && !isLegislationError && setFormValues({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [legislation, state?.filters, isError, isLegislationError]);


  /**
   * Update the current legislation data when the update fails
   */
  useEffect(() => {
    if (savedFormData && Object.keys(savedFormData).length) {
      if ((isError || isLegislationError) && Object.keys(savedFormData).length !== Object.keys(currentLegislationData).length && error) {
        setCurrentLegislationData((prev) => ({ ...prev, ...savedFormData }));
        setErrorData(JSON.parse(error?.message || "{}"));
      }
    }

  }, [currentLegislationData, error, isError, isLegislationError, savedFormData]);


  /**
   * Check if form is valid.
   */
  const isFormValid = () => {
    // return formRef?.current?.checkValidity();
    if (!formRef?.current) return false;

    return formRef?.current?.querySelectorAll('input:invalid, textarea:invalid').length === 0;
  };

  /**
   * Handle tab click.
   */
  const tabClickHandler = (tab: string) => {
    const correctIndex = tab.includes('details')
      ? 1 : tab.includes('type') ? 2 : 3;

    if (selectedIndex > Number(correctIndex)) {
      setDirection('previous');
    } else {
      setDirection('next');
    }
    setSelectedIndex(Number(correctIndex));
  };


  /**
   * Handle going next in the edit steps/pages.
   */
  const nextClickHandler = (e: any, d: 'next' | 'previous') => {
    setDirection(d);

    if (d === 'next') {
      if (selectedIndex === 3) {
        return;
      }
      setSelectedIndex(selectedIndex + 1);
    } else if (d === 'previous') {
      if (selectedIndex === 1) {
        return;
      }
      setSelectedIndex(selectedIndex - 1);
    }
  };


  /**
   * Update the current legislation data
   */
  useEffect(() => {
    if (!Object.keys(formValues).length || ['text', 'textarea'].includes(inputType)) {
      return;
    }

    // Format the payload
    const data = { data: formValues, legislation: currentLegislationData, jobRoles };
    const { legislation_requirements } = formatPayload(data);

    // Update the legislation data
    GENERAL_FILTER_DATA.forEach((key) => {
      const data = (legislation_requirements as any)[key];
      if (data) {
        const filteredData = data.map((item: any) => {
          return { ...item, label: item.name, identifier: item.name.toLowerCase().replace(/ /g, '_'),
            checked: true, is_approved: true,
          }
        });
        (legislation_requirements as any)[key] = filteredData;
      }
    });

    setCurrentLegislationData((prev) => ({ ...prev, ...legislation_requirements }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues, jobRoles]);


  /**
   * Make the request to update the Jobrole simultaneously
   * @param jobRoles
   * @returns void
   */
  const saveAllJobRoleContent = (jobRoles: JobRoleContent[]) => {
    if (!Object?.length) {
      !isError && !isLegislationError && setIsEditing(false);
      return Promise.resolve({ errors: [], results: [] });
    }

    return Promise.all(
      jobRoles.map((role: any) => {
        if (!role.identifier) {
          createJobRole({ ...role })
        } else {
          const { identifier, legislation, ...rest } = role;
          const updateUrl = `${UPDATE_ATTENTION_POINT.endpoint}${identifier}/custom-update/`;
          updateJobRole({ ...rest, endpoint: updateUrl });
        }
      }
    ));
  };


  /**
   * Reset the form values/date
   */
  const resetFormData = () => {
    if (!isError && !isLegislationError && !savingOnly) {
      setIsEditing(false);
      setSelectedIndex(1);
      setCurrentLegislationData({} as Legislation);
      setFormValues({});
      setMissingFields([]);
    }
    return;
  };


  /**
   * Update the role-content -- this is a better way to handle the
   * attention-points update since we do not want to get out of the request
   * loop if any of them should fail, we take one success as enough and can proceed further
   * Update JobRoleData
   * @param jobRolePayload
   */
  const updateJobRoleData = (jobRolePayload: any) => {
    if (!jobRolePayload.length) {
      return;
    }

    saveAllJobRoleContent(jobRolePayload)
      .then(() => { resetFormData() })
      .catch(() => { resetFormData() });
  };


  /**
   * Update the Legislation data
   * @param payload
   */
  const updateLegData = (payload: any) => {
    // Saving for re-use in case of error
    store(CURRENT_FORM_DATA_ID, { ...formValues, ...payload,  }, { permanent: false });
    updateLegislation({ ...payload });
  };


  /**
   * Get Edit Title
   */
  const editTitle = () => {
    return currentLegislationData.preparation_state === CREATED_STATE
      ? 'Edit Legislation'
      : currentLegislationData.preparation_state === REVIEW_STATE
        ? 'Review Legislation' : 'Preview Legislation'
  };

  /**
   * Show the Default Edit buttons
   */
  const defaultLegislationEditButtons = () => {
    return (
      <ButtonSet className={styles.root__buttongroup}>
        <Button
          variation='cancel'
          size="small"
          type='button'
          title={`Save changes for: ${(legislation as Legislation)?.name_generic || ''}`}
          onClick={() => {
            setIsEditing(false);
            setSelectedIndex(1);
            setCurrentLegislationData({} as Legislation);
            setFormValues({});
            setMissingFields([]);
          }}
        >
          Cancel
        </Button>
        <SplitButton
          primaryType='button'
          primaryAction={onSaveLegislationOnlyHandler}
          primaryText='Save'
          disabled={!isFormValid()}
          title={`Save changes for: ${(legislation as Legislation)?.name_generic || '' }`}
          data-user-type={user.is_approver ? 'approver' : 'preparer'}
          variant='secondary'
        >
          <li>
            <Button
              variation='tertiary'
              size="small"
              type='button'
              title={`Save changes for: ${(legislation as Legislation)?.name_generic || ''}`}
              onClick={onSaveLegislationOnlyHandler}
              disabled={missingFields.length > 0}
              data-user-type={user.is_approver && legislation.preparation_state === REVIEW_STATE ? 'approver' : 'preparer'}
            >
              <span>
                Save
                <small>Continue after saving</small>
              </span>
            </Button>
          </li>
          <li>
            <Button
              variation='tertiary'
              size="small"
              type='button'
              title={`Save changes for: ${(legislation as Legislation)?.name_generic || ''}`}
              onClick={onSaveLegislationClickHandler}
              disabled={missingFields.length > 0}
              data-user-type={user.is_approver && legislation.preparation_state === REVIEW_STATE ? 'approver' : 'preparer'}
            >
              <span>
                Save and close
                <small>Save changes and close</small>
              </span>
            </Button>
          </li>
        </SplitButton>

        {user.is_approver && (legislation.preparation_state === REVIEW_STATE) ? (
          <SplitButton
            primaryType='submit'
            primaryAction={() => {}}
            primaryText='Approve'
            disabled={!isFormValid()}
            title={`${user.is_approver && legislation.preparation_state === REVIEW_STATE
              ? 'Approved for:'
              : 'Send '}'${(legislation as Legislation)?.name_generic || '' }' ${user.is_approver
                ? '' : 'for review'
              }`
            }
            data-user-type={user.is_approver && legislation.preparation_state === REVIEW_STATE ? 'approver' : 'preparer'}
          >
            <li title="Save and close">
              <Button
                variation="tertiary"
                size="small"
                disabled={!isFormValid()}
                title={`${user.is_approver && legislation.preparation_state === REVIEW_STATE
                  ? 'Approved for:'
                  : 'Send '}'${(legislation as Legislation)?.name_generic || '' }' ${user.is_approver
                    ? '' : 'for review'
                  }`
                }
                aria-controls={generalFormId}
                form={generalFormId}
                data-user-type={user.is_approver && legislation.preparation_state === REVIEW_STATE ? 'approver' : 'preparer'}
                type='button'
                onClick={formSubmitHandler}
              >
                <IconComponent name="CircleCheckmarkFillIcon" data-approve />
                <span>
                  {user.is_approver && legislation.preparation_state === REVIEW_STATE ? 'Approve' : 'Send for review'}:
                  <small>Send to published list</small>
                </span>
              </Button>
            </li>
            {user.is_approver && (legislation.preparation_state === REVIEW_STATE) ? (
              <li title={`Decline: ${(legislation as Legislation).name_generic}`}>
                <Button
                  type='button'
                  variation="tertiary"
                  size="small"
                  title={`Decline: ${(legislation as Legislation).name_generic}`}
                  disabled={!isFormValid() || legislation?.identifier === undefined}
                  onClick={onDeclineLegislationClickHandler}
                >
                  <IconComponent name="CircleDeleteFillIcon" data-decline />
                  <span>Decline: <small>Back back to edit</small></span>
                </Button>
              </li>
            ) : null}
          </SplitButton>
        ) : null}

        {([CREATED_STATE, REVIEW_STATE, APPROVED_STATE].includes(legislation.preparation_state) && !user.is_approver)
          || ([CREATED_STATE, APPROVED_STATE].includes(legislation.preparation_state) && user.is_approver) ? (
          <Button
            variation='primary'
            size="small"
            disabled={[REVIEW_STATE, APPROVED_STATE].includes(legislation.preparation_state) && !user.is_approver || !isFormValid()}
            title={`Send ${(legislation as Legislation)?.name_generic || '' } 'for review'}`}
            data-user-type="preparer"
            type='submit'
          >
            Send for review
          </Button>
        ) : null}
      </ButtonSet>
    );
  };


  /**
   * Show the Project Edit buttons
   */
  const projectLegislationEditButtons = () => {

    const canSaveChanges = ():boolean => {
      return (!user.is_approver && legislation.preparation_state === APPROVED_STATE)
      || missingFields.length > 0 || !isFormValid();
    }

    const canPublishLegislation = (): boolean => {
      const legData = (legislation as ProjectLegislation);

      return legData?.isPublishedForClient;
    }


    return (
      <ButtonSet className={styles.root__buttongroup}>
        <Button
          variation='cancel'
          size="small"
          type='button'
          title={`Cancel changes for: ${(legislation as ProjectLegislation)?.name_generic || ''}`}
          onClick={() => {
            setIsEditing(false);
            setSelectedIndex(1);
            setCurrentLegislationData({} as ProjectLegislation);
            setFormValues({});
            setMissingFields([]);
          }}
        >
          Cancel
        </Button>

        {/*  Save Changes made the the form */}
        <SplitButton
          primaryType='button'
          primaryAction={onSaveLegislationOnlyHandler}
          primaryText='Save'
          disabled={(!user.is_approver && (legislation as ProjectLegislation).isPublishedForClient) || canSaveChanges()}
          title={`Save changes for: ${(legislation as Legislation)?.name_generic || '' }`}
          data-user-type={user.is_approver ? 'approver' : 'preparer'}
          variant='secondary'
        >
          <li>
            <Button
              variation='tertiary'
              size="small"
              type='button'
              title={`Save changes for: ${(legislation as Legislation)?.name_generic || ''}`}
              onClick={onSaveLegislationOnlyHandler}
              disabled={canSaveChanges()}
              data-user-type={user.is_approver && legislation.preparation_state === REVIEW_STATE ? 'approver' : 'preparer'}
            >
              <span>
                Save
                <small>Continue edit after saving</small>
              </span>
            </Button>
          </li>
          <li>
            <Button
              variation='tertiary'
              size="small"
              type='button'
              title={`Save changes for: ${(legislation as Legislation)?.name_generic || ''}`}
              onClick={onSaveLegislationClickHandler}
              disabled={canSaveChanges()}
              data-user-type={user.is_approver && legislation.preparation_state === REVIEW_STATE ? 'approver' : 'preparer'}
            >
              <span>
                Save and close
                <small>Save changes and close</small>
              </span>
            </Button>
          </li>
        </SplitButton>

        {/*  Approve or send legislation for Review */}
        {user.is_approver && (legislation.preparation_state === REVIEW_STATE) ? (
          <SplitButton
            primaryType='submit'
            primaryAction={() => {}}
            primaryText='Approve'
            disabled={!isFormValid()}
            title={`${user.is_approver && legislation.preparation_state === REVIEW_STATE
              ? 'Approved for:'
              : 'Send '}'${(legislation as Legislation)?.name_generic || '' }' ${user.is_approver
                ? '' : 'for review'
              }`
            }
            data-user-type={user.is_approver && legislation.preparation_state === REVIEW_STATE ? 'approver' : 'preparer'}
          >
            <li title="Save and close">
              <Button
                variation="tertiary"
                size="small"
                disabled={!user.is_approver || !isFormValid()}
                title={`${user.is_approver && legislation.preparation_state === REVIEW_STATE
                  ? 'Approved for:'
                  : 'Send '}'${(legislation as Legislation)?.name_generic || '' }' ${user.is_approver
                    ? '' : 'for review'
                  }`
                }
                aria-controls={generalFormId}
                form={generalFormId}
                data-user-type={user.is_approver && legislation.preparation_state === REVIEW_STATE ? 'approver' : 'preparer'}
                type='button'
                onClick={formSubmitHandler}
              >
                <IconComponent name="CircleCheckmarkFillIcon" data-approve />
                <span>
                  {user.is_approver && legislation.preparation_state === REVIEW_STATE ? 'Approve' : 'Send for review'}:
                  <small>Send to approved list</small>
                </span>
              </Button>
            </li>
            <li title={`Decline: ${(legislation as Legislation).name_generic}`}>
              <Button
                type='button'
                variation="tertiary"
                size="small"
                title={`Decline: ${(legislation as Legislation).name_generic}`}
                disabled={!user.is_approver || !isFormValid() || legislation?.identifier === undefined}
                onClick={onDeclineLegislationClickHandler}
              >
                <IconComponent name="CircleDeleteFillIcon" data-decline />
                <span>Decline: <small>Back back to edit</small></span>
              </Button>
            </li>
          </SplitButton>
        ) : null}

        {user.is_approver
          && (legislation.preparation_state === APPROVED_STATE )
          && !(legislation as ProjectLegislation).isPublishedForClient ? (
          <SplitButton
            primaryType='button'
            primaryAction={onProjectLegislationPublish}
            primaryText='Publish to client'
            disabled={!!(legislation as ProjectLegislation).isPublishedForClient || !isFormValid()}
            title={`Publish: ${(legislation as Legislation)?.name_generic || '' } for the project`}
            data-user-type={user.is_approver ? 'approver' : 'preparer'}
          >
            <li title={`Publish: ${(legislation as Legislation).name_generic}`}>
              <Button
                type='button'
                variation="tertiary"
                size="small"
                title={`Publish: ${(legislation as Legislation).name_generic} for the project`}
                disabled={canPublishLegislation() || !isFormValid()}
                onClick={onProjectLegislationPublish}
              >
                <IconComponent name="CircleCheckmarkFillIcon" data-approve />
                <span>Publish: <small>Publish for client view</small></span>
              </Button>
            </li>
            <li title={`Send: ${(legislation as Legislation).name_generic} for review`}>
              <Button
                variation="tertiary"
                size="small"
                disabled={!isFormValid()}
                title={`Send ${(legislation as Legislation)?.name_generic || '' } 'for review'}`}
                data-user-type="preparer"
                type='submit'
              >
                <IconComponent name="RedoOutlineIcon" data-default />
                <span>Back to review: <small>Send back to review</small></span>
              </Button>
            </li>
            <li title={`Decline: ${(legislation as Legislation).name_generic}`}>
              <Button
                type='button'
                variation="tertiary"
                size="small"
                title={`Decline: ${(legislation as Legislation).name_generic}`}
                disabled={true || !user.is_approver}
                onClick={onProjectLegislationDecline}
              >
                <IconComponent name="CircleDeleteFillIcon" data-decline />
                <span>Decline: <small>Send back to edit</small></span>
              </Button>
            </li>
          </SplitButton>
        ) : null}

        {/* Send back to review if already published to client */}
        {user.is_approver
          && (legislation.preparation_state === APPROVED_STATE )
          && (legislation as ProjectLegislation).isPublishedForClient ? (
            <Button
              variation='primary'
              size="small"
              onClick={onProjectLegislationPublish}
              disabled={!isFormValid()}
              title={`Send ${(legislation as Legislation)?.name_generic || '' } 'for review'}`}
              data-user-type="preparer"
              data-action-type="retract"
              type='button'
            >
              Retract from client
            </Button>
        ) : null}

        {/* Send for Review in create state */}
        {[CREATED_STATE, REVIEW_STATE, APPROVED_STATE].includes(legislation.preparation_state) && !user.is_approver
        || legislation.preparation_state === CREATED_STATE && user.is_approver ? (
          <Button
            variation='primary'
            size="small"
            disabled={[REVIEW_STATE, APPROVED_STATE].includes(legislation.preparation_state) || !isFormValid()}
            title={`Send ${(legislation as Legislation)?.name_generic || '' } 'for review'}`}
            data-user-type="preparer"
            type='submit'
          >
            Send for review
          </Button>
        ) : null}
      </ButtonSet>
    )
  };


  /**
   * Approve the client legislation for a specific project (only for approvers)
   */
  const onProjectLegislationPublish = (e: any) => {
    if (!isFormValid() || !projectId) {
      alert('Something is wrong with the form data and can\'t be approved - Try again later');
      return;
    }

    const actionType = e?.currentTarget?.dataset?.actionType !== "retract";

    // Post the data to the API
    updateLegislationForClient({
      client_identifier: projectId,
      legislation_identifier: legislation.identifier,
      is_published: actionType,
    });
  };


  /**
   * Handle the success message for the approval of the legislation
   */
  useEffect(() => {
    if (isApproveSuccess && approvalData?.results) {
      showToast({
        title: 'Successfully Published',
        message: `The legislation has been published and is now available for all clients in this project.`,
        active: true,
        type: 'message',
        persistent: false,
      });

      resetFormData();
      refetchClientLegislation?.();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApproveSuccess, approvalData]);


  /**
   * Decline the client legislation for a specific project (only for approvers)
   */
  const onProjectLegislationDecline = () => {
    const finalPayload = {
      ...currentLegislationData,
      preparation_state: 'CREATED',
    }

    // Patch the data to the API
    updateLegData(finalPayload);
    console.log('Decline the legislation');
  };


  /**
   * Handle form submission for the legislation (send for review/approve)
   * Approvers can approve the legislation and send it for review
   * Preparers can only send the legislation for review
   * @e {Event}
   */
  const formSubmitHandler = (e: any) => {
    e.preventDefault();

    if (!isFormValid()) {
      return;
    }

    const payload = { data: formValues, legislation: currentLegislationData, jobRoles };
    const { legislation_requirements, job_roles } = formatPayload(payload,);

    const finalPayload = {
      ...legislation_requirements,
      preparation_state: user.is_approver && legislation.preparation_state === REVIEW_STATE
        ? APPROVED_STATE : REVIEW_STATE
    }

    // Patch the data to the API
    updateLegData(finalPayload);
    updateJobRoleData(Object.values(attentionPointValues));
  };


  /**
   * Save Legislation for future editing (for both preparers and approvers)
   * @param e
   */
  const onSaveLegislationClickHandler = () => {
    const payload = { data: formValues, legislation: currentLegislationData, jobRoles };
    const { legislation_requirements, job_roles } = formatPayload(payload);
    const reqLength = Object.keys(legislation_requirements).length;

    // Patch the data to the API
    if (reqLength > 0 || Object.keys(attentionPointValues).length > 0) {
      setIsSaving(true);
      updateLegData(legislation_requirements);
      updateJobRoleData(Object.values(attentionPointValues));
    }
  };


  /**
   * Save Legislation for future editing (for both preparers and approvers) and continue editing
   * Do not close the form after saving
   */
  const onSaveLegislationOnlyHandler = () => {
    const payload = { data: formValues, legislation: currentLegislationData, jobRoles };
    const { legislation_requirements, job_roles } = formatPayload(payload);
    const reqLength = Object.keys(legislation_requirements).length;

    // Patch the data to the API
    if (reqLength > 0 || Object.keys(attentionPointValues).length > 0) {
      setIsSaving(true);
      setSavingOnly(true);
      updateLegData(legislation_requirements);
      updateJobRoleData(Object.values(attentionPointValues));
    }
  };


  /**
   * Decline a legislation for further review (only for approvers)
   * @param e
   */
  const onDeclineLegislationClickHandler = (_e: any) => {
    const { legislation_requirements } = formatPayload({ data: formValues, legislation: currentLegislationData, jobRoles });
    const finalPayload = { ...legislation_requirements, preparation_state: 'CREATED' };

    // Patch the data to the API
    setIsDecline(true);
    updateLegData(finalPayload);
  };


  /**
   * Handle the success/error messages
   */
  useEffect(() => {
    const getToastTitle = (updatedLegislation: Legislation) => {
      const isApproved = user.is_approver && updatedLegislation.preparation_state === APPROVED_STATE;

      return isSaving ? 'Successfully Saved'
      : isDecline ? 'Legislation Not Approved'
            : isApproved
              ? 'Successfully Approved' : 'Sent for Review';
    };

    const getToastMessage = (updatedLegislation: Legislation) => {
      return isSaving
        ? 'Until this legislation is sent for review, it will remain active for further editing.'
        : isDecline ? 'Legislation has been sent back for further review/update.'
          : user.is_approver && !([CREATED_STATE, REVIEW_STATE].includes(updatedLegislation.preparation_state))
            ? 'Please be aware that this legislation is published and can no longer be edited.'
            : 'Please be aware that this legislation is now under review, the approver will check and finally publish/decline.';
    };

    if (isSuccess && !legislationData?.errors?.length) {
      !savingOnly && setIsEditing(false);

      showToast({
        title: getToastTitle(legislationData?.results),
        message: getToastMessage(legislationData?.results),
        active: true,
        type: 'message',
        persistent: false,
        orientation: savingOnly ? 'left' : 'right',
      });

      setIsDecline(false);
      setIsSaving(false);
      setSavingOnly(false);
      // setIsPublishedToClient(false);
      refetchClientLegislation?.();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permission, isSuccess]);


  /**
   * Handle the error messages in case of failure in the TOAST
   * This is to ensure that the user is aware of the error and can try again
   */
  useEffect(() => {
    const isApprove = permission === 'approver';

    if (isLegislationError || isError) {
      setCurrentLegislationData((prev) => ({ ...prev, ...savedFormData }));
      setSelectedIndex(selectedIndex);
      setIsEditing(true);

      showToast({
        title: 'Something went wrong',
        message: `Please try ${isSaving
            ? 'saving this legislation'
            : isApprove
              ? 'approving this legislation'
              : 'sending this legislation for review'}  again later.`,
        type: 'error',
        active: false,
        persistent: false,
        orientation: 'left',
      });

      setIsSaving(false);
      setIsDecline(false);
    }
  }, [isLegislationError, isError, permission, selectedIndex, setIsEditing, showToast, isSaving, savedFormData]);


  /**
   * Set the legislation data after successful update to the state
   * This is to ensure that the state is updated with the new data
   */
  useEffect(() => {
    if (isSuccess) {
      const finalLegislations = state.legislations?.map((l) => {
        if (l.identifier === legislationData.results.identifier) {
          return legislationData.results;
        }
        return l;
      }) || [];
      stateDispatch(stateActions.initState({ legislations: finalLegislations || [], permission }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, legislationData, permission]);


  /**
   * Helper function to get the index and the kind of requirement we are currently dealing with
   * @param name
   * @returns
   */
  const getIndex = (name: string, isRequirement: boolean = true) => {
    const keyword = isRequirement ? "_requirements" : "attention_point";
    const index = name.indexOf(keyword);

    const trimmedField = name.substring(0, index + keyword.length);
    const lastIndex = name.charAt(name.length - 1);

    return { index, trimmedField, lastIndex };

  };


  /**
   * Gather all the requirement data that has been touched
   * @param name
   * @param isRawData
   * @returns
   */
  const getFields = (name: string, isRawData: boolean = false, isRequirement: boolean = true) => {
    const { index, trimmedField, lastIndex } = getIndex(name);
    const requirementData = {}; const attentionData = {};
    if (isRequirement) {
      if (isRawData) {
        (Array
          .from(formRef.current?.querySelectorAll(`[name*="${trimmedField}"]`) || []) as HTMLInputElement[])
          .filter((field) => field.name.includes(lastIndex))
          .forEach((inputField) => {
            (requirementData as { [key: string]: string })[inputField.name] = inputField.value;
          });

        return requirementData;
      }

      if (!isRawData) {
        return (Array
          .from(formRef.current?.querySelectorAll(`[name*="${trimmedField}"]`) || []) as HTMLInputElement[])
          .filter((field) => field.name.includes(lastIndex))
          .map((field) => {
            return { [field
              .name
              .substring(index + '_requirements'.length + 1)
              .replace(/-\d+$/, '')
            ]: field.value }
          })
          .reduce((acc, curr) => {
            return { ...acc, ...curr };
          }, {});
      }
    }

    if (!isRequirement) {
      (Array
        .from(formRef.current?.querySelectorAll(`[name*="${trimmedField}"]`) || []) as HTMLInputElement[])
        .filter((field) => field.name.includes(lastIndex))
        .forEach((inputField) => {
          (attentionData as { [key: string]: string })[inputField.name] = inputField.value;
        });
      return attentionData;
    }
  };



  /**
   * Update the form values when the input changes (text, textarea)
   */
  const onInputChange = (name: string, newValue: string) => {
    const { index: requirementIndex } = getIndex(name);
    const { index: attentionIndex, trimmedField, lastIndex } = getIndex(name, false);

    if (attentionIndex !== -1) {
      const data: { [key: string]: string } = getFields(name, true, false) || {};
      setAttentionPointValues((prev) => ({
        ...prev,
        [`${trimmedField}-${lastIndex}`]: {
          ...(prev[`${trimmedField}-${lastIndex}`] || {}),
          ...formatAttentionPointData(data),
        }
      }))
    }

    if (requirementIndex !== -1) {
      const data = getFields(name, true);
      setFormValues((prev) =>  ({ ...prev, ...data }));
    }
    setFormValues((prev) => ({ ...prev, [name]: newValue }));
  };


  /**
   * Update the form values when the toggle button is clicked
   */
  const onToggleChange = (groupname: string, dataName: string, isChecked: boolean) => {
    setFormValues((prev) => {
      const updatedGroup = prev[groupname] || [];
      const updatedData = isChecked
      ? [
          ...updatedGroup.filter((data: any) => data.name !== dataName), { name: dataName },
          ...(updatedGroup.length
            ? []
            : (legislation[groupname as keyof Legislation] || []) as Filter[]).filter(a => a.name !== dataName
          )
        ]
      : [
          ...updatedGroup.filter((data: any) => data.name !== dataName),
          ...(updatedGroup.length
            ? []
            : (legislation[groupname as keyof Legislation] || []) as Filter[]).filter(a => a.name !== dataName
          )
        ];

      return { ...prev, [groupname]: updatedData };
    });
  };


  const onAttentionToggleChange = (groupname: string, dataName: string, isChecked: boolean) => {
    setAttentionPointKey(groupname);
  };


  /**
   * Format the jobRole data to be update or created anew
   */
  useEffect(() => {
    if (attentionPointKey && formRef.current) {
      const data = getAllJobRoles(attentionPointKey, legislation)
      setAttentionPointValues((prev) => ({
        ...prev,
        [attentionPointKey]: { ...(prev[attentionPointKey] || {}), ...data }
      }))

      setAttentionPointKey('');
    }
  }, [attentionPointKey, legislation]);


  /**
   * Handles the radio button change for the the date of the legislation
   */
  const onRadioChangeHandler = (name: string, value: string) => {
    if (!name || !value) {
      alert('Something went wrong with the radio button selection');
      return;
    }

    if (name === 'is_in_effect') {
      setFormValues((prev) => ({ ...prev, [name]: value === 'Yes' }));
    }
  };

  /**
   * Check if the General tab has any errors
   */
  const { general, requirements, roleSpecific } = useMemo(() => {
    if (!Object.keys(formValues).length) {
      return { general: false, requirements: false, roleSpecific: false };
    }

    const general = generalTabRef.current
      ? generalTabRef.current.querySelectorAll('input:invalid, textarea:invalid, input[data-invalid="true"]').length > 0 : false;
    const requirements = requirementsTabRef.current
      ? requirementsTabRef.current.querySelectorAll('textarea:invalid').length > 0 : false;
    const roleSpecific = roleSpecificTabRef.current
      ? roleSpecificTabRef.current.querySelectorAll('input:invalid, textarea:invalid').length > 0 : false;

    return { general, requirements, roleSpecific };
  }, [formValues]);


  const tabs = useMemo(() => {
    return EDIT_TABS.map((tab, index) => {
      if (index === 0) {
        return { ...tab, isError: general };
      }

      if (index === 1) {
        return { ...tab, isError: requirements };
      }

      if (index === 2) {
        return { ...tab, isError: roleSpecific };
      }

      return { ...tab };
    });
  }, [general, requirements, roleSpecific]);



  return (
    <section
      className={styles.root}
      hidden={!isEditing}
      data-main-content
      data-edit-content
      {...props}
    >
      <Form
        id={generalFormId}
        onSubmit={formSubmitHandler}
        ref={formRef}
        {...props}
      >
        <header className={styles.root__header}>
          <div className={styles.root__headertop}>
            <h4>{editTitle()}</h4>
            {editingType === "default"
              ? defaultLegislationEditButtons()
              : projectLegislationEditButtons()
            }
          </div>

          {renderNotice?.()}

          {isError || isLegislationError ? (
            <AlertBar data-hidden={errorIsHidden} variation="notice" data-notice>
              <h3>Check the errors below</h3>
              <p>Please check for any missing/required field and try again.</p>
              {/* {errorData?.errors ? Object.keys(errorData.errors || {})?.map((key, index) => {
                return (
                  <div key={index} data-error-list>
                    <h5>{index+1}: {key.replaceAll("_", " ")}</h5>
                    <ul>
                      {errorData.errors[key]?.map((error: any, i: number) => {
                        if (typeof error === 'string') {
                          return (
                            <li key={i}>
                              <p>{error}</p>
                            </li>
                          );
                        }

                        return Object.keys(error) && Object.keys(error || {})?.map((k, j) => {
                          return (
                            <li key={j}>
                              {error[k].length && error[k]?.map((e: string, l: number) => {
                                return (
                                  <p key={l}><em>{e}----</em>&nbsp;{k.replaceAll('_', ' ')}</p>
                                );
                              })}
                            </li>
                          );
                        });
                      })}
                    </ul>
                  </div>
                );
              }): (
                null
              )} */}
              <ButtonSet data-btn-set>
              <Button
                variation="primary"
                size='small'
                type="button"
                onClick={() => setErrorIsHidden(true)}
              >
                <Icon name="cross-fill" color="currentColor"/>
              </Button>
            </ButtonSet>
            </AlertBar>
          ) : null}

          <div className={styles.root__tabs}>
            <Tabs
              tabSelected={selectedIndex}
              options={tabs}
              onTabClick={tabClickHandler}
              data-tabs
              type='pages'
              align='left'
              ref={tabRef}
            />
          </div>

          {/* Missing fields */}
          {missingFields?.length ? (
            <AlertBar data-hidden={errorIsHidden} variation="error" data-error-notice>
              <h6>Missing fields:&nbsp;</h6>
              <ul>
                {missingFields.map((field, index) => (
                  <li key={index}><small>{field}</small></li>
                ))}
              </ul>
            </AlertBar>
          ) : null}
        </header>

        {/* Page 1: */}
          <General
            filters={filters}
            data-direction={direction}
            selectedIndex={selectedIndex}
            data={currentLegislationData}
            onNotApplicable={setFormValues}
            onInputChange={onInputChange}
            onToggleChange={onToggleChange}
            onRadioChange={onRadioChangeHandler}
            ref={generalTabRef}
          />

        {/* Page 2: */}
          <Requirements
            filters={filters}
            selectedIndex={selectedIndex}
            isEditing={isEditing}
            data={currentLegislationData}
            onNotApplicable={setFormValues}
            setMissingFields={setMissingFields}
            onRequirementInputChange={onInputChange}
            setIsReadyToDelete={setIsReadyToDelete}
            isDeleted={isDeleted}
            setIsDeleted={setIsDeleted}
            setRequirementIdentifier={setRequirementIdentifier}
            ref={requirementsTabRef}
          />

        {/* Page 3: */}
          <RoleSpecific
            user={user}
            filters={filters}
            showToast={showToast}
            data-direction={direction}
            selectedIndex={selectedIndex}
            onInputChange={onInputChange}
            onAttentionToggleChange={onAttentionToggleChange}
            data={currentLegislationData}
            ref={roleSpecificTabRef}
          />

        <ButtonSet className={styles.root__buttonset}>
          {selectedIndex === 1 ? (
            <>&nbsp;</>
          ) : (
            <Button
              variation="secondary"
              size='small'
              type="button"
              onClick={(e: any) => nextClickHandler(e, 'previous')}
            >
              Previous
            </Button>
          )}
          {selectedIndex === 3 ? (
            <>&nbsp;</>
          ) : (
            <Button
              variation="primary"
              size='small'
              type="button"
              onClick={(e: any) => nextClickHandler(e, 'next')}
            >
              Next
            </Button>
          )}
        </ButtonSet>
      </Form>
    </section>
  );

};

export default EditLegislation;
