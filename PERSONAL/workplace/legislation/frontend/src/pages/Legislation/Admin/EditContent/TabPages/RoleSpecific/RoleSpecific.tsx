import { useState, useMemo, useEffect, forwardRef } from 'react'
import { uuid } from '@grrr/utils';

import { FormGroup, Accordion, AccordionItem, IconComponent, Button, InputField, CustomToggleList } from 'components';
import { EditHeader, GroupHeader } from '..';
import { RoleSpecificProps } from '../interfaces';
import { FilterOption } from 'hooks/interfaces/legislation.interface';
import { JOB_ROLE_KEY, SELECT_ALL_FILTER_KEY } from 'configs/legislation/legislation';
import { REMOVE_ROLE_CONTENT, GET_LEGISLATIONS_BY_ID } from 'configs/api-endpoints';
import { useQueryApi } from 'hooks';

const TAB_TITLE = 'Role specific'
const TAB_CONTENT = 'Fill in the below metadata attributes to provide additional context and categorization for the uploaded regulation.'
interface AttentionPoint {
  roles: any[];
  name: string;
  note?: string;
  identifier: string;
  activeKey: string;
  data_identifier: string | undefined;
  attention_point_identifier: string;
  is_new_attention_point: boolean;
}

// TODO: Fix bugs (2):
// 1. On successful delete, the toast is behind the modal backdrop, it should be in front

const RoleSpecific = forwardRef<HTMLDivElement, RoleSpecificProps & {
  onInputChange: (name: string, newValue: string) => void;
  onAttentionToggleChange: (groupname: string, dataName: string, isChecked: boolean) => void;
}>(({
  user,
  data,
  filters = [],
  showToast,
  selectedIndex,
  onInputChange,
  onAttentionToggleChange,
  ...props
}, ref) => {
  const roleSpecificAccordionId = useMemo(() => uuid(), []);
  const [roles, setRoles] = useState<FilterOption[]>(filters?.find((f) => f.label === JOB_ROLE_KEY)?.data || []);
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [attentionPoints, setAttentionPoints] = useState<AttentionPoint[]>([]);

  const { delete: removeRoleContent } = useQueryApi({
    ...REMOVE_ROLE_CONTENT,
    url: `${GET_LEGISLATIONS_BY_ID.endpoint}${data.identifier}/`,
  });
  const { mutate: deleteRoleContent, isSuccess, isError } = removeRoleContent();

  /**
   * Update the roles state
   */
  useMemo(() => {
    setRoles(filters.find((f) => f.label === JOB_ROLE_KEY)?.data.filter((r: FilterOption) => !r.identifier.includes(SELECT_ALL_FILTER_KEY)) || []);
  }, [filters])


  /**
   * Update the roles state
   */
  useEffect(() => {
    if (data?.attention_point_list?.length > 0) {
      const attentionPoints = data.attention_point_list.map((attention, index) => {

        const updatedAttentionPoints = attention.job_role_list.map((role: any) => ({
          ...role, checked: true, is_approved: true
        })).concat(
          roles.filter((role) => !attention.job_role_list.some((attentionRole: any) => attentionRole.identifier === role.identifier))
            .map((role) => ({ ...role, checked: false, is_approved: false }))
          );

        return {
          activeKey: `attention_point-${index + 1}`,
          identifier: `attention_point-${index + 1}`,
          name: 'Attention point',
          note: attention.note,
          data_identifier: attention.identifier,
          attention_point_identifier: attention.identifier,
          is_new_attention_point: true,
          roles: updatedAttentionPoints,
        };
      });
      setAttentionPoints([...attentionPoints]);
    } else {
      setAttentionPoints([
        {
          activeKey: 'attention_point-1',
          identifier: 'attention_point-1',
          name: 'Attention point',
          data_identifier: undefined,
          is_new_attention_point: true,
          attention_point_identifier: '',
          roles: roles,
        }
      ]);
    }
  }, [data?.attention_point_list, roles]);


  /**
   * Handles accordion click event
   * @param activeKeys
   */
  const onClickAccordion = (activeKeys: string[]) => {
    setActiveKeys(activeKeys);
  };


  /**
   * Add more handler
   * When clicked, it will add another requirement to the requirement group list and display the fields
   */
  const onAddMoreHandler = (_e: any, index: number ) => {
    const newAttentionPoint = {
      activeKey: `attention_point-${index + 1}`,
      identifier: `attention_point-${index + 1}`,
      name: 'Attention point',
      is_new_attention_point: true,
      attention_point_identifier: '',
      data_identifier: undefined,
      roles: roles,
    };
    setAttentionPoints([...attentionPoints, newAttentionPoint]);
    setActiveKeys([newAttentionPoint.activeKey]);
  };


  /**
   * Handles removing an already added attention point
   * @param e
   */
  const onAttentionPointRemoveHandler = (e: any) => {
    const attentionName = e.target.closest('li').dataset.attentionName;
    if (!attentionName) return;

    const attentionData = attentionPoints.find((a: any) => a.identifier === attentionName);
    const attentionIdentifier = e.target.closest('li').dataset.attentionIdentifier;

    if (!attentionIdentifier) {
      if (!attentionData) return;
      setAttentionPoints(attentionPoints.filter((attention: any) => attention.identifier !== attentionName));
      return;
    }

    if (attentionIdentifier && attentionName) {
      setAttentionPoints(attentionPoints.filter((attention: any) => attention.identifier !== attentionName));
      const deleteUrl = `${REMOVE_ROLE_CONTENT.endpoint}${attentionIdentifier}/`;
      deleteRoleContent({ endpoint: deleteUrl });
    }
  };


  /**
   * Show toast message on successful delete
   */
  useEffect(() => {
    if (isSuccess) {
      showToast({
        title: 'Successfully Deleted',
        message: 'Attention point has successfully been removed from this legislation.',
        type: 'message',
        persistent: false,
        active: true,
        orientation: 'left',
      });
    }

    if (isError) {
      showToast({
        title: 'Unable to Delete',
        message: 'An error occurred while trying to remove the attention point from this legislation.',
        type: 'error',
        persistent: false,
        active: true,
        orientation: 'left',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);


  return (
    <div data-content-wrapper {...props} data-hidden={!(selectedIndex === 3)}>
      <FormGroup>
        <EditHeader title={TAB_TITLE} content={TAB_CONTENT} />
      </FormGroup>

      <FormGroup data-form-inputs data-group="background_and_risk_of_non_compliance">
        <InputField
          name="background"
          label='background'
          subLabel='Short background information to help understand tis legislation.'
          inputValue={data.background || ''}
          onInputChange={onInputChange}
          rows={5}
          // maxLength={1000}
          showCheckbox
          isTextArea
          data-role-specific
        />
        <InputField
          name="non_compliance_risk"
          label='risk of non-compliance'
          subLabel='Short information on the risk of non-compliance with this legislation.'
          inputValue={data.non_compliance_risk || ''}
          onInputChange={onInputChange}
          rows={5}
          // maxLength={1000}
          showCheckbox
          isTextArea
          data-role-specific
        />
      </FormGroup>

      <FormGroup data-original-group >
        <GroupHeader title="attention points">
          <p data-group-subtitle>
            Click on <IconComponent name="PlusFillIcon"/> to expand/close on the attention point and add more details about their relevance in the current legislation
          </p>
        </GroupHeader>

        <Accordion
          multiple={false}
          activeKeys={activeKeys}
          accordionId={`role-specific-accordion-${roleSpecificAccordionId}`}
          onClick={onClickAccordion}
          data-attention-points
        >
          {attentionPoints.map((attention, attentionIndex) => {
            return (
              <AccordionItem
                key={`attention-${attention?.activeKey}_${attentionIndex}`}
                itemKey={attention?.activeKey}
                contentTitle={attention?.name}
                isNew={attention.is_new_attention_point}
                onRemove={onAttentionPointRemoveHandler}
                data-attention-name={attention.identifier}
                data-attention-identifier={attention.attention_point_identifier}
                data-requirement-key={attention.activeKey}
                data-is-editing
                isLarge
              >
                <FormGroup data-group={`role_${attention?.name || ''}_group`} data-role-specific>
                  <InputField
                    name={`attention_point-${attentionIndex + 1}-note-${attentionIndex + 1}`}
                    subLabel={`Please details that are relevant and must be taken note of for the current legislation`}
                    label=''
                    inputValue={attention.note || ''}
                    onInputChange={onInputChange}
                    rows={7}
                    // maxLength={1000}
                    isTextArea
                    data-attention-input
                    data-role-specific
                  />
                  <input
                    type='hidden'
                    name={`attention_point-${attentionIndex + 1}_data_identifier`}
                    value={`${attention.data_identifier}`}
                  />
                </FormGroup>

                <FormGroup data-group="select_relevant_parties">
                  <GroupHeader
                    title={attention.is_new_attention_point ? "select relevant job role list(s)" : "relevant job role list(s)"}
                    content={attention.is_new_attention_point
                      ? "Select the relevant Job Role(s) that must take note of the details provided above."
                      : "Relevant Job Role(s) that must take note of the details provided above."
                    }
                  />
                    <CustomToggleList
                      list={attention.roles.sort((a, b) => a.name.length - b.name.length) as any}
                      onToggle={onAttentionToggleChange}
                      name={`${attention.identifier}`}
                      data-role-specific
                      data-attention-identifier={attention.identifier}
                    />
                  </FormGroup>
              </AccordionItem>
            );
          })}
        </Accordion>

        <FormGroup data-group="add-more-action" data-requirements>
          <Button
            variation="secondary-trans"
            type='button'
            onClick={(e: any) => onAddMoreHandler(e , attentionPoints.length)}
            data-role-name='attention point'
            // data-role-index={attentionIndex}
            data-add-more
          >
            <IconComponent name="PlusFillIcon" />
            &nbsp;<span>Add another attention point</span>
          </Button>
        </FormGroup>
      </FormGroup>
    </div>
  );

});

export default RoleSpecific;
