import { Children, Fragment, SyntheticEvent, useEffect, useMemo, useState } from "react";
import { formatAndExtractAllAttributes } from "helpers/projects/projects";
import { filterData } from "hooks/reducers/helpers";
import { remove, restore, store } from "helpers/utils";

import {
  AlertBar,
  Button, ButtonSet, EmptyLegislationList,
  IconComponent, Loader, Modal, TabList,
} from "components";
import { useQueryApi } from "hooks/index";
import { REQUEST_CLIENT_LEGISLATION_APPROVAL } from "configs/api-endpoints";

import { EMPTY_ATTRIBUTES } from "configs/project/project";

import { Legislation, UserInterface } from "hooks/interfaces";
import { Filter } from "hooks/interfaces/legislation.interface";
import { EditComponentProps, LegislationTabs, SelectedAttributes } from "../interfaces";
import { ConfigLegislation } from "hooks/interfaces/project.interface";
import { CREATED_STATE, JURISDICTION_KEY, APPROVED_STATE, REVIEW_STATE } from "configs/legislation/legislation";
import Aside from "./ConfigAside";
import Card from './Card';

import styles from './ContentConfig.module.scss';
const PROJECT_REVIEW_LEGISLATIONS = 'project_review_legislations';

interface LegislationConfig {
  label: string;
  entries: Legislation[];
  count: number
}

const ContentConfigurationEditTab = ({
  project,
  selectedIndex,
  clientLegislations,
  isPending,
  updateFilters,
  setCurrentEditCard,
  setIsEditing,
  isEditing,
  user,
  refetch: refetchClientLegislations,
  showToast,
  helperFn = {
    onSort: () => {},
    onSearch: () => {},
    onDropDown: () => {},
  },
  filters = [],
  filteredList = [],
  existingFilters = [],
  legislations = [],
  query = ''
}: EditComponentProps & {
  updateFilters: (checked: boolean, filterOption: Filter, name: string) => void;
  viewState?: "viewing" | "editing";
  existingFilters: string[];
  legislations: Legislation[];
  refetch: () => void;

  setCurrentEditCard: (legislation: Legislation) => void;
  setIsEditing: (isEditing: boolean) => void;
  isEditing: boolean;
  showToast: any;
  user: UserInterface;
  isPending: boolean;
  clientLegislations: ConfigLegislation[];
  helperFn: {
    onSort: (e: SyntheticEvent<Element, Event>) => void;
    onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDropDown: (filterValue: string) => void;
  };
  filteredList?: LegislationTabs[];
  query?: string;
}) => {

  const [selectedTab, setSelectedTab] = useState(0);
  const [clearAll,  setClearAll] = useState<boolean>(false);
  const [filterList, setFilterList] = useState<Filter[]>([]);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const [startReview, setStartReview] = useState<boolean>(false);
  const [attributesCleared, setAttributesCleared] = useState<boolean>(false);
  const [isChangingAttributes, setIsChangingAttributes] = useState<boolean>(false);
  const [filteredLegislations, setFilteredLegislations] = useState<LegislationConfig[]>([]);
  const [allSelectedAttributes, setAllSelectedAttributes] = useState<SelectedAttributes>(EMPTY_ATTRIBUTES);

  const isAttributesEmpty = useMemo(
    () => Object.values(allSelectedAttributes).every((attr) => !attr.data.length),
    [allSelectedAttributes]
  );


  // Make api calls
  const { post: requestLegislationApproval } = useQueryApi(REQUEST_CLIENT_LEGISLATION_APPROVAL);
  const { mutate: requestApproval, isSuccess } = requestLegislationApproval();


  /**
   * Extract all unique attributes from the associated legislations
   */
  useEffect(() => {
    if (!clientLegislations.length || selectedIndex !== 3) return;
    const data = formatAndExtractAllAttributes(clientLegislations?.map((l: any) => l.legislation));
    setAllSelectedAttributes(data);
  }, [clientLegislations, selectedIndex]);


  /**
   * Format the filter data and make sure to set the is_approved to true for the selected filters
   */
  useEffect(() => {
    if (filters?.length && !isAttributesEmpty) {
      setFilterList(formatFilters(filters, allSelectedAttributes));
    } else  {
      setFilterList(formatFilterData(filters, existingFilters));
    }
  }, [
    filters,
    existingFilters,
    isAttributesEmpty,
    allSelectedAttributes,
  ]);


  /**
   * Set the legislation data
   */
  useEffect(() => {
    if (legislations.length && isChangingAttributes) {
      setFilteredLegislations(formatFilteredLegislations(legislations, filterList));
    }
  }, [filterList, isChangingAttributes, legislations]);


  /**
   * Clear all selected attributes
   */
  const onClearAllAttributesHandler = () => {
    setFilterList(filters);
    setAttributesCleared(true);
    setAllSelectedAttributes(EMPTY_ATTRIBUTES);
    setClearAll(false);
  };


  /**
   * Update the form values when the toggle button is clicked
   */
  const onToggleChange = (category: string, filterName: string, isChecked: boolean) => {
    if (isAttributesEmpty && !isFiltering) {
      setIsFiltering(true);
    }

    const filter = filters.find((f) => f.label.toLowerCase() === category);
    if (!filter) return;

    if (!isAttributesEmpty) {
      setAllSelectedAttributes((prev) => {
        const finalData = !isChecked
          ? {
            ...prev,
            [category]: {
              label: category,
              data: [
                ...prev[category].data,
                filter.data.find((d) => d.name.toLowerCase() === filterName.toLowerCase())
              ]
            }
          }
          : {
            ...prev,
            [category]: {
              label: category,
              data: prev[category].data.filter((d) => d.name.toLowerCase() !== filterName.toLowerCase())
            }
          };
        return finalData;
      });
    }

    const name = filter.data.find((d) => d.name.toLowerCase() === filterName.toLowerCase())?.name;
    updateFilters(isChecked, filter, name || '');
  };


  /**
   * Handle Checkbox change event
   */
  const onCheckboxChange = (event: any, isChecked: boolean) => {
    if (!event) return;

    if (isAttributesEmpty && !isFiltering) {
      setIsFiltering(true);
    }

    const inputElement = event.target?.previousElementSibling?.querySelector('input') || event.target?.closest?.('div[data-is-pill]')?.querySelector('input');
    const filter = filters.find((f) => f.label === JURISDICTION_KEY);
    const value = inputElement?.value;


    const filterOption = filter?.data.find((d) => d.name.toLowerCase() === value.toLowerCase());

    if (!isAttributesEmpty) {
      if (filterOption) {
        setAllSelectedAttributes((prev) => {
          const finalData = isChecked
            ? {
              ...prev,
              [JURISDICTION_KEY]: {
                label: JURISDICTION_KEY,
                data: [
                  ...prev[JURISDICTION_KEY].data,
                  filterOption
                ]
              }
            }
            : {
              ...prev,
              [JURISDICTION_KEY]: {
                label: JURISDICTION_KEY,
                data: prev[JURISDICTION_KEY].data.filter((d) => d.identifier !== filterOption.identifier)
              }
            };

          return finalData;
        });
      }
    }

    if (filterOption) {
      updateFilters(isChecked, filter as Filter, value);
    }
  };

  /**
   * Send and lock legislations to the client project
   */
  const onStartReviewProcessHandler = () => {
    const legislations = restore(PROJECT_REVIEW_LEGISLATIONS, { permanent: false });

    if (!legislations.length) return;

    const payload = {
      client_identifier: project.identifier,
      legislation_identifier_list: legislations,
    };

    requestApproval(payload);
    remove(PROJECT_REVIEW_LEGISLATIONS, { permanent: false });
    window.location.reload();
  };


  /**
   * Show success message to the client on successful request approval
   */
  useEffect(() => {
    if (isSuccess) {
      showToast({
        type: 'message',
        title: 'Review process started',
        message: 'The review process has been initiated for the selected legislations.',
        active: true,
        persistent: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, project.identifier, isEditing]);


  /**
   * Stop filtering if nothing is selected
   */
  useEffect(() => {
    if (isAttributesEmpty && isFiltering && !existingFilters.length) {
      setIsFiltering(false);
    }
  }, [existingFilters.length, isAttributesEmpty, isFiltering]);


  /**
   * Filter the legislations based on the selected attributes
   * Store the filtered legislations in the session storage and use that to lock the legislations to this project
   */
  useEffect(() => {
    if (isFiltering && existingFilters.length || isChangingAttributes) {
      setFilteredLegislations(formatFilteredLegislations(legislations, filterList));
      const updatedLegislations = formatFilteredLegislations(legislations, filterList)
        .map((tab) => tab.entries)
        .map((entries) => entries.map((entry) => entry.identifier)).flat();

      store(PROJECT_REVIEW_LEGISLATIONS, updatedLegislations, { permanent: false });
    }
  }, [existingFilters.length, filterList, isChangingAttributes, isFiltering, legislations]);


  /**
   * Get teh total number of the legislations available to show
   */
  const totalLegislationCount = useMemo(
    () => (!isAttributesEmpty && !attributesCleared && !isChangingAttributes)
      ? filteredList?.reduce((acc, tab) => acc + tab.count, 0)
      : (isFiltering && existingFilters.length || isChangingAttributes)
        ? filteredLegislations.reduce((acc, tab) => acc + tab.count, 0)
        : 0,
    [
      attributesCleared,
      existingFilters?.length,
      filteredLegislations,
      filteredList,
      isAttributesEmpty,
      isFiltering,
      isChangingAttributes,
    ]
  );


  /**
   * Get the list of legislations to show based on the selected attributes
   */
  const list = useMemo(() => {
    if (!attributesCleared) {
      return (isFiltering || isChangingAttributes) ? filteredLegislations : filteredList
    }

    if (attributesCleared && isFiltering || isChangingAttributes) {
      return filteredLegislations;
    }

    return [
      { label: 'In Review', entries: [], count: 0 },
      { label: 'Approve', entries: [], count: 0 },
    ];
  }, [attributesCleared, filteredLegislations, filteredList, isChangingAttributes, isFiltering]);


  /**
   * Re configure the entries for the tab list based on the selected attributes
   */
  const entries = useMemo(() => {
    if (!attributesCleared) {
      return (isFiltering || isChangingAttributes) ? filteredLegislations : filteredList
    }

    if (attributesCleared && isFiltering) {
      return filteredLegislations;
    }

    return [
      { label: 'In Review', entries: [], count: 0 },
      { label: 'Approve', entries: [], count: 0 },
    ];

  }, [attributesCleared, filteredLegislations, filteredList, isChangingAttributes, isFiltering]);


  /**
   * Re configure the header title based on the selected attributes
   */
  const headerTitle = useMemo(() => {
    if (!attributesCleared && !isFiltering && !isChangingAttributes) {
      return 'Configured legislation list';
    }
    return 'Matching legislation to attributes';
  }, [attributesCleared, isChangingAttributes, isFiltering]);

  if (selectedIndex !== 3) return null;


  return (
    <Fragment>
      {isChangingAttributes && !isAttributesEmpty ? (
        <AlertBar variation="warning" data-config-notice>
          <p>
            <strong>Note!</strong>&nbsp; Until you
            <span role="button" onClick={() => setStartReview(true)}>
              &nbsp;<strong>start review process</strong></span>,
              all the modifications you make to the attributes will not be saved for
              &nbsp;<strong>&nbsp;{project.name}&nbsp;</strong> project or client.
          </p>
        </AlertBar>
      ) : null}
      <section className={styles.root} data-hidden={!(selectedIndex === 3)} data-create-content data-content-configuration>
        <Aside
          user={user}
          setClearAll={setClearAll}
          filters={filterList || []}
          data-allow-edit={user.is_approver}
          onCheckboxChange={onCheckboxChange}
          onToggleChange={onToggleChange}
          allSelectedAttributes={allSelectedAttributes || EMPTY_ATTRIBUTES}
        />

        <article data-legislation-content>
          <header>
            <div>
              <h6>
                {headerTitle} &nbsp;|&nbsp;
                <span>
                  {totalLegislationCount || 0} result{totalLegislationCount > 1 ? 's' : ''}
                </span>
              </h6>
              {(isFiltering || isChangingAttributes) ? (
                <Button
                  variation="secondary"
                  size="small"
                  type="button"
                  onClick={() => setStartReview(true)}
                  disabled={!((isFiltering || isChangingAttributes) && filteredLegislations.reduce((acc, tab) => acc + tab.count, 0) > 0 && existingFilters.length > 0)}
                >
                  Start review process
                  <IconComponent name="DownIcon" />
                </Button>
              ) : null}
            </div>
            {(isFiltering || isChangingAttributes) ? (
              <span data-is-filtering>
                There are [&nbsp;<strong>{filteredLegislations.reduce((acc, tab) => acc + tab.count, 0) || 0}&nbsp;</strong>]&nbsp;
                matching legislations based on the attributes you have selected. Have you selected all the
                relevant attributes for your client? <strong data-last-part>
                Start the review process to lock these legislations for
                the client.
                </strong>
              </span>
            ) : null}
          </header>

          <div data-legislation-list>
            <TabList
              showSearch
              user={user}
              query={query}
              isEditing={isEditing}
              variant="project-tabs"
              entries={entries}
              selectedTab={selectedTab}
              onDataSort={helperFn.onSort}
              onSearch={helperFn.onSearch}
              setSelectedTab={setSelectedTab}
              onFilterOption={helperFn.onDropDown}
            >
            {Children.toArray(list.map((tab, index) => (
              <Fragment key={index}>
                {isPending ?  <Loader data-details /> : (
                  <ul data-tab-list>
                    {Children.toArray(tab.entries.length ? tab.entries.map((data: any, _i: number) => (
                      <Card
                        user={user}
                        query={query}
                        configLeg={data}
                        setIsEditing={setIsEditing}
                        setCurrentEditCard={setCurrentEditCard}
                        isFiltering={isFiltering || isChangingAttributes}
                      />
                    )) : (
                      <EmptyLegislationList showContent={tab.entries.length === 0} query={query} />
                    ))}
                  </ul>
                )}
              </Fragment>
              )
            ))}
            </TabList>
          </div>
        </article>

        <Modal
          id={'clear-all-selected-attributes'}
          isOpen={clearAll}
          onOpen={() => setClearAll(true)}
          onClose={() => setClearAll(false)}
          data-upload-content
        >
          <header data-project-create-header>
            <Button
              variation='transparent'
              onClick={() => setClearAll(false)}
              size='small'
            >
              <IconComponent name="CloseOutlineIcon" />
            </Button>
            <div>
              <h2>Remove attributes</h2>
            </div>
          </header>
          <p style={{ textAlign: 'center' }}>
            By removing attributes for <strong>{project.name}</strong>,
            all the associated legislations to this attributes will disappear
            for the project regardless of their review status (created, in review or published).
            Are you sure you want to remove the attributes and exclude <strong>[&nbsp;{project.legislation_count}&nbsp;]</strong> legislations
            from the project?
          </p>

          <ButtonSet data-btn-set data-project-edit>
            <Button
              variation="cancel"
              onClick={() => setClearAll(false)}
              disabled={false}
            >
              No, keep attributes
            </Button>
            <Button
              type='button'
              onClick={onClearAllAttributesHandler}
              value="button"
              disabled={false}
            >
              Yes, remove attributes
            </Button>
          </ButtonSet>
        </Modal>

        <Modal
          id={'start-review-process'}
          isOpen={startReview}
          onOpen={() => setStartReview(true)}
          onClose={() => setStartReview(false)}
          data-upload-content
          data-review-process
        >
          <header data-project-create-header>
            <Button
              variation='transparent'
              onClick={() => setStartReview(false)}
              size='small'
            >
              <IconComponent name="CloseOutlineIcon" />
            </Button>
            <div>
              <h2>Currently, {totalLegislationCount || 0} legislations are selected. </h2>
            </div>
          </header>
          <p data-center>
            <strong>Have you completed adding all attributes?</strong> If so, you can continue to review and approval.
            Legislations must be approved for this specific project before being published to the client
          </p>

          {/* Action Buttons */}
          <ButtonSet data-btn-set data-project-edit>
            <Button
              variation="cancel"
              onClick={() => setStartReview(false)}
              disabled={false}
            >
              No, keep adding attributes
            </Button>
            <Button
              type='button'
              onClick={onStartReviewProcessHandler}
              value="button"
              disabled={false}
            >
              Yes, continue
            </Button>
          </ButtonSet>
        </Modal>
      </section>
    </Fragment>
  );

};

export default ContentConfigurationEditTab;



function formatFilters(filters: Filter[], allSelectedAttributes: SelectedAttributes, isChecked: boolean = false) {
  return !isChecked
    ? filters.map((filter) => {
      const activeFilter = allSelectedAttributes[filter.label];
      if (!activeFilter) return filter;

      return {
        ...filter,
        data: filter.data.map((d) => {
          const isActive = activeFilter.data.find((a) => a.identifier === d.identifier);
          return { ...d, is_approved: !!isActive, checked: !!isActive };
        })
      }
    })
    : filters.map((filter) => {
      return {
        ...filter,
        data: filter.data.map((d) => {
          return { ...d, is_approved: false, checked: false };
        })
      }
    });
}


function formatFilterData(filters: Filter[], existingFilters: string[]) {
  return filters.map((filter) => {
    return {
      ...filter,
      data: filter.data.map((d) => {
        // TODO: Check if the filter is already in the existing filters

        return {
          ...d,
          is_approved: existingFilters.includes(d.identifier),
          checked: existingFilters.includes(d.identifier),
        };
      }),
    }
  });
}


function formatFilteredLegislations(legislations: Legislation[] = [], filters: Filter[] = []) {
  const list = filterData(legislations, filters) as Legislation[];

  return [
    {
      label: 'Created',
      entries: list.filter((l) => l.preparation_state === CREATED_STATE),
      count: list.filter((l) => l.preparation_state === CREATED_STATE).length,
    },
    {
      label: 'In Review',
      entries: list.filter((l) => l.preparation_state === REVIEW_STATE),
      count: list.filter((l) => l.preparation_state === REVIEW_STATE).length,
    },
    {
      label: 'Approved',
      entries: list.filter((l) => l.preparation_state === APPROVED_STATE),
      count: list.filter((l) => l.preparation_state === APPROVED_STATE).length,
    },
    {
      label: 'Published to client',
      entries: [],
      count: 0,
    },
  ]
}
