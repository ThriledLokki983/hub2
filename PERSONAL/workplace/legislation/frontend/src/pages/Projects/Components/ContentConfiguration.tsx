import { useMemo, useState } from "react";
import { getFilters, getIdentifiers, updateData } from "helpers/utils";

import { FormGroup } from "components";
import { GENERAL_FILTER_TABS } from "configs/legislation/legislation";
import { Filter, Legislation } from "hooks/interfaces/legislation.interface";
import { GroupHeader, SidebarSelect, TopicList } from "pages/Legislation/Admin/EditContent/TabPages";

interface CreateTab {
  selectedIndex: number,
  filters: Filter[],
  data?: Legislation | any,
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>, isChecked: boolean) => void,
}

const ContentConfiguration = ({ data = {}, selectedIndex, filters, onCheckboxChange }: CreateTab) => {

  const [productService, setProductService] = useState(filters.find((f) => f.label === 'product_service')?.data || []);
  const [geographicalScope, setGeographicalScope] = useState(filters.find((f) => f.label === 'geographical_scope')?.data || []);
  const [sustainabilityTopic, setSustainabilityTopic] = useState(filters.find((f) => f.label === 'topic')?.data || []);
  const [legislationTypes, setLegislationTypes] = useState(filters.find((f) => f.label === 'type')?.data || []);
  const [status, setStatus] = useState(filters.find((f) => f.label === 'status')?.data || []);
  const [jobRoles, setJobRoles] = useState(filters.find((f) => f.label === 'job_roles')?.data || []);
  const [issuingJurisdiction, setIssuingJurisdiction] = useState<string[]>((data as Legislation)?.issuing_jurisdiction?.map((i) => i.name) || []);


  /**
   * Get the topic roles and legislation topics.
   */
  useMemo(() => {
    setSustainabilityTopic(updateData(getFilters(filters, 'topic'), getIdentifiers([])));
    setLegislationTypes(updateData(getFilters(filters, 'type'), getIdentifiers([])));
    setGeographicalScope(updateData(getFilters(filters, 'geographical_scope'), getIdentifiers([])));
    setProductService(updateData(getFilters(filters, 'product_service'), getIdentifiers([])));
    setStatus(updateData(getFilters(filters, 'status'), getIdentifiers([])));
    setJobRoles(updateData(getFilters(filters, 'job_roles'), getIdentifiers([])));
    setIssuingJurisdiction((data as Legislation)?.issuing_jurisdiction?.map((_i) => _i.name) || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);


  return (
    <section data-hidden={!(selectedIndex === 3)} data-create-content>
      <FormGroup data-create-group="sustainability_topic">
        <GroupHeader title="sustainability topic" content="Choose the sustainability topic(s) that the project focuses on:"/>
        <TopicList data={sustainabilityTopic} name="topic" />
      </FormGroup>

      <FormGroup data-create-group="issuing_jurisdiction">
        <GroupHeader title="'issuing' jurisdiction" content="Select the country or jurisdiction that issued the legislation"/>
        <SidebarSelect
          name="issuing_jurisdiction_country"
          sidebarItems={GENERAL_FILTER_TABS}
          selectedNav=''
          selectedJurisdictions={issuingJurisdiction}
          onCheckboxChange={onCheckboxChange as any} // TODO: Check this bcos it is not going to work
          data-jurisdiction
        />
      </FormGroup>

      <FormGroup data-create-group="legislation_type">
        <GroupHeader title="legislation type" content="Select the current status of the legislation."/>
        <TopicList data={legislationTypes} name="type"/>
      </FormGroup>

      <FormGroup data-create-group="relevant_product_group_service">
        <GroupHeader title="relevant product (group) or services" content="If applicable, specify whether the legislation applies to specific products and/ or services."/>
        <TopicList data={productService} name="product_service"/>
      </FormGroup>

      <FormGroup data-create-group="relevant_product_group_service">
        <small><strong>NOTE: </strong> <em>we will be adding the possibility to add other options using a dropdown. this will come later.</em></small>
      </FormGroup>
    </section>
  );

};

export default ContentConfiguration;
