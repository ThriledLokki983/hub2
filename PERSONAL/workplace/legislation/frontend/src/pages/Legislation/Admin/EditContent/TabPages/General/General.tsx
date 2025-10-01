import { useMemo, useState, forwardRef } from 'react';

import { parseDate } from '@internationalized/date';
import { updateData, getIdentifiers, getFilters } from 'helpers/utils';

import { FormGroup, DatePicker, InputField, CustomToggleList, RadioGroup, CustomCheckbox } from 'components';
import { EditHeader, GroupHeader, SidebarSelect } from '..';
import {
  GENERAL_IS_IN_EFFECT, GENERAL_TAB_TITLE,
  GENERAL_TAB_CONTENT, GENERAL_FILTER_TABS,
  JOB_ROLE_KEY, TOPIC_KEY, TYPE_KEY, SCOPE_KEY, PRODUCT_SERVICE_KEY,
  JURISDICTION_KEY,
} from 'configs/legislation/legislation';
import { GeneralDetailsProps } from '../interfaces';
import styles from './General.module.scss';


const TODAY = new Date();
const TODAY_ISO = TODAY.toISOString().split("T")[0];


const General = forwardRef<HTMLDivElement, GeneralDetailsProps & {
  onInputChange: (name: string, newValue: string) => void,
  onToggleChange: (groupname: string, name: string, newValue: boolean) => void;
  onRadioChange: (name: string, selectedValue: string) => void;
}>(({
  data,
  filters = [],
  onRadioChange,
  selectedIndex,
  onNotApplicable,
  onInputChange,
  onToggleChange,
  ...props
}, ref) => {

  const [showExpirationDate, setShowExpirationDate] = useState(false);
  const [sustainabilityTopic, setSustainabilityTopic] = useState(filters.find((f) => f.label === TOPIC_KEY)?.data || []);
  const [legislationTypes, setLegislationTypes] = useState(filters.find((f) => f.label === TYPE_KEY)?.data || []);
  const [geographicalScope, setGeographicalScope] = useState(filters.find((f) => f.label === SCOPE_KEY)?.data || []);
  const [productService, setProductService] = useState(filters.find((f) => f.label === PRODUCT_SERVICE_KEY)?.data || []);
  const [jobRoleList, setJobRoleList] = useState(filters.find((f) => f.label === JOB_ROLE_KEY)?.data || []);
  const [issuingJurisdiction, setIssuingJurisdiction] = useState<string[]>(data?.issuing_jurisdiction?.map((i) => i.name) || []);
  const [nonCompliance, setNonCompliance] = useState(data.non_compliance_consequence);
  const [isInEffectGroup, setIsInEffectGroup] = useState(GENERAL_IS_IN_EFFECT);

  /**
   * Get the topic roles and legislation topics.
   */
  useMemo(() => {
    setSustainabilityTopic(updateData(getFilters(filters, TOPIC_KEY), getIdentifiers(data.topic)));
    setLegislationTypes(updateData(getFilters(filters, TYPE_KEY), getIdentifiers(data.type)));
    setGeographicalScope(updateData(getFilters(filters, SCOPE_KEY), getIdentifiers(data.geographical_scope)));
    setProductService(updateData(getFilters(filters, PRODUCT_SERVICE_KEY), getIdentifiers(data.product_service)));
    setJobRoleList(updateData(getFilters(filters, JOB_ROLE_KEY), getIdentifiers(data.job_role_list)));
    setIssuingJurisdiction(data?.issuing_jurisdiction?.map((_i) => _i.name) || []);
    setIsInEffectGroup(GENERAL_IS_IN_EFFECT.map((e) => ({
      ...e,
      checked: e.label === 'Yes' && data.is_in_effect || e.label === 'No' && !data.is_in_effect
    })));
    setNonCompliance(data.non_compliance_consequence?.map((n) => ({ ...n, checked: true, is_approved: true })))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);


  /**
   * Handles the checkbox change
   * @param groupName
   * @param dataName
   * @param isChecked
   */
  const onCheckboxChangeHandler = (groupName: string, dataName: string, isChecked: boolean) => {
    if (!groupName || !dataName) {
      alert('Invalid data');
    }

    onToggleChange(groupName, dataName, isChecked);

    if (groupName === JURISDICTION_KEY) {
      setIssuingJurisdiction((prev) => {
        if (isChecked) {
          return [...prev, dataName, ];
        }
        return prev.filter((i) => i.toLowerCase() !== dataName.toLowerCase());
      });
    }
  };


  if (!data.identifier) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={styles.root}
      data-hidden={!(selectedIndex === 1)}
      data-content-wrapper
      {...props}
    >
      <FormGroup>
        <span data-required data-general>Required Fields</span>
        <EditHeader title={GENERAL_TAB_TITLE} content={GENERAL_TAB_CONTENT} />
      </FormGroup>

      <FormGroup data-form-inputs data-group="general_details">
        <InputField name="pwc_territory" label='pwc territory' inputValue={data.pwc_territory} onInputChange={onInputChange} required placeholder='PwC Territory'/>
        <InputField name="name_local" label='name of legislation in original language' inputValue={data.name_local} onInputChange={onInputChange} required showCheckbox />
        <InputField name="abbreviation" label='abbreviation' inputValue={data.abbreviation} onInputChange={onInputChange} required />
        <InputField name="name_generic" label='Generic name of legislation' inputValue={data.name_generic} onInputChange={onInputChange} required />
      </FormGroup>

      <FormGroup data-group="sustainability_topic">
        <GroupHeader required title="sustainability topic" content="Select all the sustainability topic(s) that the legislation applies to."/>
        <CustomToggleList list={sustainabilityTopic as any} onToggle={onToggleChange} name="topic"/>
      </FormGroup>

      <FormGroup data-group="issuing_jurisdiction">
        <GroupHeader title="issuing jurisdiction" content="Select the country or jurisdiction that issued the legislation"/>
        <SidebarSelect
          name="issuing_jurisdiction_country"
          sidebarItems={GENERAL_FILTER_TABS}
          selectedNav=''
          selectedJurisdictions={issuingJurisdiction}
          onCheckboxChange={onCheckboxChangeHandler}
        />
      </FormGroup>

      <FormGroup data-group="job_role_list">
        <GroupHeader title="job role list" content="Select the relevant job role for this legislation."/>
        <CustomToggleList list={jobRoleList as any} onToggle={onToggleChange} name="job_role_list"/>
      </FormGroup>

      <FormGroup data-group="legislation_type">
        <GroupHeader title="legislation type" content="Select the current type of the legislation."/>
        <CustomToggleList list={legislationTypes as any} onToggle={onToggleChange} name="type"/>
      </FormGroup>

      <FormGroup data-group="geographical_scope">
        <GroupHeader title="geographical scope" content="Select the area where the legislation applies."/>
        <CustomToggleList list={geographicalScope as any} onToggle={onToggleChange} name="geographical_scope"/>
      </FormGroup>

      <FormGroup data-group="is_in_effect">
        <GroupHeader required title="in effect" content="Select YES if legislation is currently in effect and NO if otherwise."/>
        <RadioGroup roles={isInEffectGroup} label='is_in_effect' onRadioChange={onRadioChange}/>
      </FormGroup>

      {/* Date selection */}
      <FormGroup data-group="applicable_from">
        <DatePicker
          name="effective_date"
          label="applicable from"
          subLabel='Select the date as of when the legislation is or wil l be first applicable.'
          value={data.effective_date ? parseDate(data.effective_date) : null}
          onInputChange={onInputChange}
          showCheckbox
          required={false}
        />
        <CustomCheckbox
          name="effective_until_toggle"
          onChange={() => setShowExpirationDate((prev) => !prev)}
          data-show-expiration-date
        >
          Legislation has an expiration date
        </CustomCheckbox>
        {showExpirationDate ? (
          <DatePicker
            name="effective_until"
            label="applicable to"
            subLabel='Select the date as of when the legislation is no more applicable.'
            value={data.effective_date ? parseDate(data.effective_date) : null}
            required={false}
            onInputChange={onInputChange}
            showCheckbox
            data-effective-until
          />
        ) : null }
      </FormGroup>

      <FormGroup data-group="responsible_authority">
        <InputField
          name="responsible_authority"
          label='responsible authority'
          subLabel='Specify which authority is responsible for the enforcement of this legislation.'
          inputValue={data.objective || ''}
          onInputChange={onInputChange}
          required
          showCheckbox
          isTextArea
        />
      </FormGroup>

      {/*  List of checkboxes */}
      <FormGroup data-group="relevant_product_group_service">
        <GroupHeader title="relevant product (group) or services" content="If applicable, specify whether the legislation applies to specific products and/ or services." required/>
        <ul>
          {productService.sort((a, b) => a.name.length  - b.name.length).map((item: any, index) => (
            <li key={`product-${item.identifier}-${index}`}>
              <div data-single-checkbox data-is-disabled="false">
                <CustomCheckbox
                  isSelected={item.checked}
                  onChange={(isChecked: boolean) => {
                    onCheckboxChangeHandler(PRODUCT_SERVICE_KEY, item.name, isChecked);
                    setProductService((prev) => {
                      return prev.map((d) => {
                        if (d.name.toLowerCase() === item.name.toLowerCase()) {
                          return { ...d, checked: isChecked, is_approved: true };
                        }
                        return d;
                      });
                    });
                  }}
                >
                  <span>{item.name}</span>
                </CustomCheckbox>
              </div>
            </li>
          ))}
        </ul>
      </FormGroup>

      <FormGroup data-group="summary">
        <InputField
          name="objective"
          label='objective of the legislation (summary)'
          subLabel='Short summary of the objective/ goal of the legislation.'
          inputValue={data.objective || ''}
          onInputChange={onInputChange}
          required
          showCheckbox
          isTextArea
        />
      </FormGroup>

      <FormGroup data-group="scope">
        <InputField
          name="scope"
          label='scope of the legislation (summary)'
          subLabel='Short summary on the relevant definitions regarding the activities that trigger the applicability of the legislation.'
          inputValue={data.scope || ''}
          onInputChange={onInputChange}
          required
          showCheckbox
          isTextArea
        />
      </FormGroup>

      <FormGroup data-group="responsible_party">
        <InputField
          name="responsible_party"
          label='responsible party (summary)'
          subLabel='Short summary on who is defined within the legislation as the parties (i.e. economic operators) to whom the legislation applies.'
          inputValue={data.responsible_party || ''}
          onInputChange={onInputChange}
          required
          showCheckbox
          isTextArea
        />
      </FormGroup>

      <FormGroup data-group="non_compliance">
        <GroupHeader required title="consequence of non-compliance" content="Select the relevant consequences that may follow from non-compliance with this legislation."/>
        <CustomToggleList list={nonCompliance as any} onToggle={onToggleChange} name="non_compliance_consequence" />
      </FormGroup>

      <FormGroup>
        <InputField
          name="legislation_link"
          label='link to legislation'
          subLabel='Include a weblink to the legislation.'
          inputValue={data.link}
          onInputChange={onInputChange}
          required
          showCheckbox
        />
      </FormGroup>

      <FormGroup>
        <InputField
          name="additional_links"
          label='Link to additional guidance'
          subLabel='Include Additional link for this legislation'
          inputValue={data.additional_links || ''}
          onInputChange={onInputChange}
        />
      </FormGroup>

      <FormGroup>
        <InputField
          name="pwc_contact"
          label='relevant pwc contact'
          subLabel='Who within PwC is the person of contact for this legislation.'
          inputValue={data.pwc_contact[0]?.email || ''}
          onInputChange={onInputChange}
        />
      </FormGroup>
    </div>
  );

});

export default General;
