import { useRef, useMemo, useEffect, useState, Children, forwardRef } from 'react';
import { stripTrailingNumbers } from 'helpers/utils';

import {
  FormGroup, Accordion, AccordionItem,
  IconComponent, Button, CustomCheckbox, InputField,
} from 'components';
import { EditHeader, GroupHeader } from '..';
import { RequirementInterface, RequirementsProps, Requirement, RequirementGroup } from '../interfaces';
import { REQUIREMENT_TAB_TITLE, REQUIREMENT_TAB_CONTENT, REQUIREMENTS, REQUIREMENT_KEYS } from 'configs/legislation/legislation';
import { Legislation } from 'hooks/interfaces';
import { Filter } from 'hooks/interfaces/legislation.interface';
import { createNewRequirement } from 'helpers/legislations/legislation';


const Requirements = forwardRef<HTMLDivElement, RequirementsProps & {
  onRequirementInputChange: (name: string, newValue: string) => void;
  setIsReadyToDelete?: (value: boolean) => void;
  isDeleted?: boolean;
  setIsDeleted?: (value: boolean) => void;
  setRequirementIdentifier?: ({ identifier, type }: { identifier: string, type: string }) => void;
}>(({
  filters = [] as Filter[],
  data = {} as Legislation,
  onNotApplicable,
  selectedIndex,
  setMissingFields,
  isEditing = false,
  onRequirementInputChange,
  setIsReadyToDelete,
  isDeleted = false,
  setIsDeleted,
  setRequirementIdentifier,
  ...props
}, ref) => {

  const roleSpecificAccordionId = useMemo(() => crypto.randomUUID(), []);
  const groupRef = useRef<HTMLDivElement | null>(null);

  const [identifier, setIdentifier] = useState<string>('');
  const [requirementList, setRequirementList] = useState<string[]>([]);
  const [requirementGroup, setRequirementGroup] = useState<RequirementGroup[]>([] as RequirementGroup[]);
  const [activeKeys, setActiveKeys] = useState<string[]>([requirementGroup[-1]?.data[-1]?.identifier || '']);
  const dataList = useMemo(() => {
    return REQUIREMENT_KEYS.filter((key) => {
      if (data[`${key}s` as keyof Legislation]) {
        return (data[`${key}s` as keyof Legislation] as RequirementInterface[])?.length;
      }
      return false;
    }) as string[] || [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  /**
   * Reset the requirement list and group when the selected index is not 2
   */
  useEffect(() => {
    if (!isEditing) {
      setRequirementList([]);
      setRequirementGroup([]);
    }
  }, [isEditing]);


  /**
   * Set the requirement list when the data list changes
   */
  useEffect(() => {
    setRequirementList(dataList);
  }, [dataList]);


  /**
   * Check in the data if registration_requirement, reporting_requirement, or regulatory_requirement
   * is present and is not empty, then add it to the requirement list and set the active keys and
   * update the requirement group
   */
  useEffect(() => {
    if (requirementList.length) {
      setActiveKeys([requirementGroup[-1]?.data[-1]?.identifier || requirementGroup[0]?.key || '']);
      return;
    }

    const dataRequirements = dataList.map((key) => ({
      key,
      data: (data[`${key}s` as keyof Legislation] as Requirement[])
        .map((r, i) => ({
          ...r, identifier: r.identifier ? r.identifier : i === 0 ? `${key}` : `${key}_${i + 1}`,
          is_new_requirement: !r.identifier,
        })),
      fields: REQUIREMENTS.find((req) => req.identifier.includes(key))?.fields,
      name: REQUIREMENTS.find((req) => req.identifier.includes(key))?.name,
      is_new_requirement: false,
    })).flat() as RequirementGroup[];

    if (dataList.length) {
      setActiveKeys(dataList);
      setRequirementGroup(dataRequirements);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  /**
   * Set the active keys when the requirement group changes to the last added requirement
   */
  useEffect(() => {
    if (requirementGroup.length && !requirementList.length) {
      setActiveKeys([requirementGroup[-1]?.data[-1]?.identifier || requirementGroup[0]?.key || '']);
    }
  }, [requirementGroup, requirementList]);



  /**
   * Handles accordion click event
   * @param activeKeys
   */
  const onClickAccordion = (activeKeys: string[]) => {
    setActiveKeys(activeKeys);
  };


  /**
   * Handles removing an already added requirement
   * @param e
   */
  const onRequirementRemoveHandler = (e: any) => {
    const requirementIdentifier = e.target.closest('li').dataset.requirementKey;
    const requirementName = e.target.closest('li').dataset.roleName;
    if (!requirementIdentifier) return;

    setIsReadyToDelete?.(true);
    setIdentifier(requirementIdentifier);
    setRequirementIdentifier?.({ identifier: requirementIdentifier, type: requirementName });
  };


  useEffect(() => {
    if (isDeleted && identifier) {
      const dataExist = requirementGroup
        .some((req: any) => req.data.find((req: any) => req.identifier && (req.identifier === identifier)));

      if (!dataExist) return;

      const updatedRequirements = requirementGroup.map((req) => ({
        ...req,
        data: req.data.filter((f) => f.identifier !== identifier)
      })).filter((d) => d.data.length > 0);
      setRequirementGroup(updatedRequirements);
      // setRequirementList(requirementList.filter((r) => r !== requirement.key));
      setMissingFields([]);
      setIsDeleted?.(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeleted]);


  /**
   * Add a requirement to the list of requirements
   * @param requirement
   */
  const addRequirement = (requirement: string) => {
    if (!requirementList.includes(requirement)) {
      setRequirementList([...requirementList, requirement]);
    }

    if (requirementList.includes(requirement)) {
      setRequirementList(requirementList.filter((r: string) => r !== requirement));
    }
  };

   /**
   * Add more handler
   * When clicked, it will add another requirement to the requirement group list and display the fields
   */
   const onAddMore = (e: any, role: any, index: number ) => {
    const newRequirement = createNewRequirement(role, index);

    if (!newRequirement) return;
    setRequirementGroup([...requirementGroup, newRequirement]);
    setActiveKeys([newRequirement.identifier]);

    if (ref && 'current' in ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };


  /**
   * Set the requirement group
   */
  useEffect(() => {
    const dataRequirements = requirementList.map((key) => ({
      key,
      data: (data[`${key}s` as keyof Legislation] as Requirement[])
        ?.map((r, i) => ({
          ...r, identifier: r.identifier ? r.identifier : i === 0 ? `${key}` : `${key}_${i + 1}`,
          // is_new_requirement: !r.identifier,
        })),
      fields: REQUIREMENTS.find((req) => req.identifier.includes(key))?.fields,
      name: REQUIREMENTS.find((req) => req.identifier.includes(key))?.name,
      is_new_requirement: false,
    })).flat() as RequirementGroup[];

    setRequirementGroup(dataRequirements);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requirementList]);


  return (
    <div data-content-wrapper {...props} ref={ref} data-hidden={!(selectedIndex === 2)}>
      <FormGroup>
        <EditHeader title={REQUIREMENT_TAB_TITLE} content={REQUIREMENT_TAB_CONTENT} />
      </FormGroup>

      <FormGroup data-group="type_of_requirements">
        <GroupHeader title="type of requirements" content="Select which type of requirements are included in the legislation."/>
        <CustomCheckbox
          isSelected={requirementList.includes('registration_requirement')}
          onChange={() => addRequirement('registration_requirement') }
          data-requirements-check
          >
          <div data-content>
            <span>
              <strong>Registration requirements:</strong> Refers to the process of officially enrolling or recording certain information with a relevant authority or organization. It typically involves providing specific details about an individual, entity, or activity to establish legal recognition or compliance
            </span>
          </div>
        </CustomCheckbox>
        <CustomCheckbox
          isSelected={requirementList.includes('reporting_requirement')}
          onChange={() => addRequirement('reporting_requirement')}
          data-requirements-check
        >
          <div data-content>
            <span>
              <strong>Reporting requirements:</strong> Rules, or obligations on either submitting information to an external party such as a a relevant authority or organization, as well as rules or obligations on publishing information in for instance an annual statement
            </span>
          </div>
        </CustomCheckbox>
        <CustomCheckbox
          isSelected={requirementList.includes('regulatory_requirement')}
          onChange={() => addRequirement('regulatory_requirement')}
          data-requirements-check
        >
          <div data-content>
            <span>
              <strong>Regulatory requirements:</strong> Regulatory requirements are rules, standards, or obligations established to govern activities or entities that must be complied with. (all requirements that are not registration or reporting requirements).
            </span>
          </div>
        </CustomCheckbox>
      </FormGroup>

      <FormGroup data-original-group >
        <GroupHeader data-no-requirement={!requirementGroup.length} required={requirementGroup.length > 0} title="selected requirement" data-requirement-group>
          <p data-group-subtitle>
            Click on <IconComponent name="PlusFillIcon"/>
            to expand on each requirement and add more details about it
          </p>
        </GroupHeader>

        {requirementList.length ? (
          <Accordion
            multiple={false}
            activeKeys={activeKeys}
            accordionId={`role-specific-accordion-${roleSpecificAccordionId}`}
            onClick={onClickAccordion}
          >
            {Children.toArray(requirementGroup.map((requirement: any, requirementIndex: number) => {
              if (!requirement.data?.length) {
                return (
                  <AccordionItem
                    key={requirementIndex}
                    itemKey={requirement.identifier}
                    data-role-name={requirement.name}
                    onRemove={onRequirementRemoveHandler}
                    data-requirement-key={requirement.identifier}
                    contentTitle={stripTrailingNumbers(requirement.name)}
                    data-requirement-data-key={requirement?.data[requirementIndex]?.identifier}
                    isNew={true}
                    data-requirements
                    data-is-new={true}
                    data-is-editing
                    isLarge
                  >
                  <div data-subtitle data-requirements>
                    Refers to the process of officially enrolling or recording certain information with a relevant authority or organization. It typically involves providing specific details about an individual, entity, or activity to establish legal recognition or compliance.
                  </div>

                  {requirement?.fields?.map((field: any, index: number) => {
                    let defaultValue = requirement[field.groupName] || '';

                    if (Array.isArray(defaultValue)) {
                      defaultValue = defaultValue.join('\n');
                    }

                    return (
                      <FormGroup data-group="description" data-requirements key={`${field.groupName}-$${index}`}>
                        <InputField
                          name={`${field.name}-${requirementIndex + 1}` || ''}
                          label={field.label ?? ''}
                          subLabel={field.subLabel ?? ''}
                          inputValue={defaultValue || ''}
                          onInputChange={onRequirementInputChange}
                          rows={field.rows}
                          showCheckbox={field.showCheckbox ?? false}
                          requirementIndex={requirementIndex}
                          required
                          isTextArea
                        />
                      </FormGroup>
                    );
                  })}
                  <input
                    type='hidden'
                    name={`${requirement.key}s_identifier-${requirementIndex + 1}`}
                    value={`${requirement?.data[requirementIndex]?.identifier || `${requirement.key}_${requirementIndex + 1}`}`}
                  />
                  <FormGroup data-group="description" data-requirements key={`${requirement.name}-${requirementIndex}${requirement.identifier}`}>
                    <Button
                      variation="secondary-trans"
                      onClick={(e: any) => onAddMore(e, requirement, requirementGroup.length)}
                      data-role-name={requirement.name}
                      data-role-index={requirementIndex}
                      data-add-more
                    >
                      <IconComponent name="PlusFillIcon" />
                      &nbsp;<span>Add another {stripTrailingNumbers(requirement.name)} </span>
                    </Button>
                  </FormGroup>
                  </AccordionItem>
                );
              }

              return Children.toArray(requirement.data.map((currentRequirement: any = {}, index: number) => (
                <AccordionItem
                  itemKey={currentRequirement.identifier}
                  contentTitle={stripTrailingNumbers(requirement.name)}
                  isNew={true}
                  onRemove={onRequirementRemoveHandler}
                  data-is-editing
                  data-requirements
                  data-is-new={true}
                  data-requirement-key={currentRequirement.identifier}
                  data-role-name={requirement.name}
                  isLarge
                >
                  <div data-subtitle data-requirements>
                    Refers to the process of officially enrolling or recording certain information with a relevant authority or organization. It typically involves providing specific details about an individual, entity, or activity to establish legal recognition or compliance.
                  </div>

                  {requirement?.fields?.map((field: any, index: number) => {
                    let defaultValue = currentRequirement[field.groupName] || '';
                    if (Array.isArray(defaultValue)) {
                      defaultValue = defaultValue.join('\n');
                    }

                    return (
                      <FormGroup data-group="description" data-requirements key={`${field.groupName}-$${index}`}>
                        <InputField
                          name={`${field.name}-${requirementIndex + 1}` || ''}
                          label={field.label ?? ''}
                          subLabel={field.subLabel ?? ''}
                          inputValue={defaultValue || ''}
                          onInputChange={onRequirementInputChange}
                          showCheckbox={field.showCheckbox ?? false}
                          requirementIndex={requirementIndex}
                          rows={field.rows}
                          required
                          isTextArea
                        />
                      </FormGroup>
                    );
                  })}
                  <input
                    type='hidden'
                    name={`${requirement.key}s_identifier-${requirementIndex + 1}`}
                    value={`${currentRequirement.identifier}`}
                  />
                  <FormGroup data-group="description" data-requirements key={`${requirement.name}-${requirementIndex}${requirement.identifier}`}>
                    <Button
                      variation="secondary-trans"
                      onClick={(e: any) => onAddMore(e, requirement, requirementGroup.length)}
                      data-role-name={requirement.name}
                      data-role-index={requirementIndex}
                      data-add-more
                    >
                      <IconComponent name="PlusFillIcon" />
                      &nbsp;<span>Add another {stripTrailingNumbers(requirement.name)} </span>
                    </Button>
                  </FormGroup>
                </AccordionItem>
              )));
            }))}
          </Accordion> ) : (
          <small data-is-empty>
            No requirements have been added yet. Please select a requirement type to add requirement specific details.
          </small>
        )}
      </FormGroup>
    </div>
  );

});

export default Requirements;
