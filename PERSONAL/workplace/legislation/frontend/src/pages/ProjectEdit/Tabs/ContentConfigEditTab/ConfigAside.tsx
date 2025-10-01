import { useMemo, useState } from "react";

import { Button, CustomToggleList, FormGroup } from "components";

import { GroupHeader, SidebarSelect, TopicList } from "pages/Legislation/Admin/EditContent/TabPages";
import { Filter } from "hooks/interfaces/legislation.interface";
import {
  GENERAL_FILTER_TABS, JOB_ROLE_KEY,
  JURISDICTION_KEY, PRODUCT_SERVICE_KEY,
  SCOPE_KEY, SELECT_ALL_FILTER_KEY, STATUS_KEY, TOPIC_KEY, TYPE_KEY,
} from "configs/legislation/legislation";
import { EMPTY_ATTRIBUTES } from "configs/project/project";
import { SelectedAttributes } from "hooks/interfaces/project.interface";
import { UserInterface } from "hooks/interfaces";

interface ConfigAsideProps {
  filters: Filter[];
  onCheckboxChange: (e: any, checked: boolean) => void
  setClearAll: (value: boolean) => void;
  allSelectedAttributes: SelectedAttributes;
  [key: string]: any;
}

const ConfigAside = ({
  filters = [],
  setClearAll,
  onCheckboxChange,
  onToggleChange,
  allSelectedAttributes = EMPTY_ATTRIBUTES,
  user,
  ...props
}: ConfigAsideProps & {
  user: UserInterface;
  onToggleChange: (groupname: string, name: string, newValue: boolean) => void;
}) => {

  const [productService, setProductService] = useState(filters.find((f) => f.label === PRODUCT_SERVICE_KEY)?.data || []);
  const [geographicalScope, setGeographicalScope] = useState(filters.find((f) => f.label === SCOPE_KEY)?.data || []);
  const [sustainabilityTopic, setSustainabilityTopic] = useState(filters.find((f) => f.label === TOPIC_KEY)?.data || []);
  const [legislationTypes, setLegislationTypes] = useState(filters.find((f) => f.label === TYPE_KEY)?.data || []);
  const [jurisdiction, setJurisdiction] = useState(filters.find((f) => f.label === JURISDICTION_KEY)?.data.filter((f) => f.is_approved)?.map((i) => i.name) || []);
  const [status, setStatus] = useState(filters.find((f) => f.label === STATUS_KEY)?.data || []);
  const [jobRoles, setJobRoles] = useState(filters.find((f) => f.label === JOB_ROLE_KEY)?.data || []);


  /**
   * Get the topic roles and legislation topics.
   */
  useMemo(() => {
    setStatus(removeSelectAllFilter(filters.find((f) => f.label === STATUS_KEY)?.data || []));
    setLegislationTypes(removeSelectAllFilter(filters.find((f) => f.label === TYPE_KEY)?.data || []));
    setSustainabilityTopic(removeSelectAllFilter(filters.find((f) => f.label === TOPIC_KEY)?.data || []));
    setJobRoles(removeSelectAllFilter(filters.find((f) => f.label === JOB_ROLE_KEY)?.data || []));
    setProductService(removeSelectAllFilter(filters.find((f) => f.label === PRODUCT_SERVICE_KEY)?.data || []));
    setGeographicalScope(removeSelectAllFilter(filters.find((f) => f.label === SCOPE_KEY)?.data || []));
    setJurisdiction(filters.find((f) => f.label === JURISDICTION_KEY)?.data.filter((f) => f.is_approved).map((i) => i.name) || []);
  }, [filters]);


  /**
   * Determine if user can edit in the side panel
   */
  const allowAttributesClearing = useMemo(() => {
    return Object.values(allSelectedAttributes).some((attribute) => attribute.data.length > 0)
    && user.is_approver
  }, [allSelectedAttributes, user.is_approver]);


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
      setJurisdiction((prev) => {
        if (isChecked) {
          return [...prev, dataName, ];
        }
        return prev.filter((i) => i.toLowerCase() !== dataName.toLowerCase());
      });
    }
  };


  return (
    <article data-selected-attributes {...props}>
      <header>
        <h6>Selected client attributes</h6>
        <Button
          variation="transparent"
          type="button"
          size="small"
          title="Clear all selected filters for this Client"
          onClick={() => setClearAll(true)}
          disabled={!allowAttributesClearing}
        >
          Clear all selected attributes
        </Button>
      </header>

      <FormGroup data-edit-group="sustainability_topic">
        <GroupHeader title="sustainability topic" content="Choose the sustainability topic(s) that the project focuses on:"/>
        <CustomToggleList
          name="topic"
          onToggle={onToggleChange}
          list={sustainabilityTopic as any}
          data-allow-edit={user.is_approver}
          isProjectToggle
        />
      </FormGroup>

      <FormGroup data-edit-group="issuing_jurisdiction">
        <GroupHeader title="issuing jurisdiction" content="Select the country or jurisdiction that issued the legislation"/>
        <SidebarSelect
          name="issuing_jurisdiction_country"
          sidebarItems={GENERAL_FILTER_TABS}
          selectedNav=''
          selectedJurisdictions={jurisdiction}
          options={filters.find((f) => f.label === JURISDICTION_KEY)?.data.filter((f) => !f.identifier.includes(SELECT_ALL_FILTER_KEY)).map((d) => d.name) || []}
          onCheckboxChange={onCheckboxChangeHandler}
          data-jurisdiction
          data-allow-edit={user.is_approver}
        />
      </FormGroup>

      <FormGroup data-group="job_role_list">
        <GroupHeader title="job role list" content="Select the relevant job role for this legislation."/>
        <CustomToggleList
          name="job_role_list"
          onToggle={onToggleChange}
          list={jobRoles as any}
          data-allow-edit={user.is_approver}
          isProjectToggle
        />
      </FormGroup>

      <FormGroup data-edit-group="legislation_type">
        <GroupHeader title="legislation type" content="Select the current type of the legislation."/>
        <CustomToggleList
          name="type"
          onToggle={onToggleChange}
          list={legislationTypes as any}
          data-allow-edit={user.is_approver}
          isProjectToggle
        />
      </FormGroup>

      <FormGroup data-edit-group="relevant_product_group_service">
        <GroupHeader title="relevant product (group) or services" content="If applicable, specify whether the legislation applies to specific products and/ or services."/>
        <CustomToggleList
          name="product_service"
          onToggle={onToggleChange}
          list={productService as any}
          data-allow-edit={user.is_approver}
          isProjectToggle
        />
      </FormGroup>

      <FormGroup data-edit-group="geographical_scope">
        <GroupHeader title="geographical scope" content="If applicable, specify whether the legislation applies to specific products and/ or services."/>
        <CustomToggleList
          name="geographical_scope"
          onToggle={onToggleChange}
          list={geographicalScope as any}
          data-allow-edit={user.is_approver}
          isProjectToggle
        />
      </FormGroup>
  </article>
  );

};

export default ConfigAside;


function removeSelectAllFilter(data: any[]) {
  return data?.filter((d) => !d.identifier?.includes(SELECT_ALL_FILTER_KEY));
}
