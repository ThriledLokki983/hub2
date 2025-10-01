import { Fragment, useState, useEffect, forwardRef, useRef, useMemo } from 'react';

import {
  Aside,
  Modal,
  Loader,
  Button,
  Filters,
  TabList,
  TopContent,
  DragDropFile,
  IconComponent,
  EmptyLegislationList,
  LegislationListCard,
  ButtonSet,
} from 'components';
import { ALLOW_TEMPLATE_DOWNLOAD } from 'configs/constants';
import { LEGISLATION_DETAILS_EDIT_MODAL_ID, LEGISLATION_PAGE_TABLIST, MAX_FILTER_NUMBER } from 'configs/legislation/legislation';
import { useQueryApi } from 'hooks';
import { useAppStateContext } from 'contexts';
import { REMOVE_REQUIREMENT, UPLOAD_LEGISLATION_FILE } from 'configs/api-endpoints';
import FilterItem from 'pages/Navigator/FilterItem';
import EditLegislation from './EditContent/EditLegislation';
import { ComponentProps, AdminUnionProps } from '../interfaces';
import { DragDropFileHandle } from './EditContent/TabPages/interfaces';
import { Legislation } from 'hooks/interfaces';
import { PATH_LEGISLATION } from 'configs/paths';
import styles from '../Legislation.module.scss';


// Type guard function to check if props are of type AdminProps
const isAdminProps = (props: ComponentProps): props is AdminUnionProps => {
  return props.type === 'ADMIN';
};


const AdminPage = forwardRef<HTMLDivElement, ComponentProps>((props, ref) => {

  const CAN_DOWNLOAD_TEMPLATE = ALLOW_TEMPLATE_DOWNLOAD === 'true';
  const { showToast } = useAppStateContext();

  const {
    tabs,
    query,
    user,
    filters,
    onRemove,
    isLoading,
    onSideFilterChange,
    onClearFilters,
    onFilterOption,
    onSort,
    onSearchChange,
  } = props;

  const dragDropRef = useRef<DragDropFileHandle | null>(null);

  const [currentEditCard, setCurrentEditCard] = useState<Legislation>();
  const [selectedTab, setSelectedTab] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [isReadyToDelete, setIsReadyToDelete] = useState<boolean>(false);
  const [requirementData, setRequirementData] = useState<{ identifier: string, type: string }>({ identifier: '', type: ''});

  const { post: uploadLegislation } = useQueryApi(UPLOAD_LEGISLATION_FILE);
  const { delete: removeRequirement } = useQueryApi(REMOVE_REQUIREMENT);

  const { data, mutate: uploadFile, isSuccess, isError, error, reset, isPending } = uploadLegislation();
  const { mutate: deleteRequirement, isSuccess: isDeleteSuccess, isError: isDeleteError } = removeRequirement();

  /**
   * Get only the filters that are actually selected
   */
  const activeFilters = useMemo(
    () => filters
      ?.filter((_f) => _f.data.some((d) => d.is_approved ? true : false))
      ?.map((f) => ({
        ...f,
        data: f.data.filter((_d) => _d.is_approved)
      }))?.map(({ data, ...rest }) => data).flat()
        .filter((f) => !f.name.startsWith('All')),
    [filters]
  );
  const showFilters = useMemo(() => activeFilters.length > 0, [activeFilters]);


  /**
   * Auto select the tab which has entries.
   */
  useEffect(() => {
    const index = tabs.findIndex((entry) => entry.count > 0);
    setSelectedTab(index);
  }, [tabs]);



  /**
   * Handles removing an already added requirement type
   * @param e
   */
  const onRequirementDeleteHandler = () => {
    if (!requirementData.identifier || !requirementData.type) {
      alert("Sorry!, we could not delete this requirement: The id or the type is unknown")
    }

    const deleteUrl = `${REMOVE_REQUIREMENT.endpoint}`
      .replace("<requirement_id>", requirementData.identifier)
      .replace("<requirement_type>", requirementData.type.toLowerCase()
        .replace(" ", "-").replace(/s$/, ""))

    setIsDeleted(true);
    deleteRequirement({ endpoint: deleteUrl });
    setIsReadyToDelete(false);
  };


  if (isAdminProps(props)) {
    const {
      onEdit,
      isEditing,
      legislation,
      setIsEditing,
    } = props;

    return (
      <Fragment>
        {/* Top Content */}
        <TopContent isDetails>
          <Fragment>
            <h3>Legislation Navigator List</h3>
            <div data-add-btn>
              <p>
                Explore the uploaded legislations list, offering an overview of the latest sustainability legislations and compliance requirements.
              </p>
              {user.is_approver ? (
                <Button variation='primary' onClick={() => setIsUploading(true)}>
                  <IconComponent name="PlusFillIcon" />
                  <span>Add new Legislation</span>
                </Button>
              ) : null}
            </div>
          </Fragment>
        </TopContent>

        {/* Aside */}
        <Aside user={user}>
          <header data-aside-header data-legislation-page>
            <h4 className={styles.root__header__title}>Filter legislation list</h4>
            <span>Select filters to refine your results</span>
          </header>

          <Filters
            onSideFilterChange={onSideFilterChange}
            filters={filters}
            userRoles={user.profile.job_role_list}
            data-leg-list
            data-accordion
          />
        </Aside>

        {/* Main Content */}
        <section
          ref={ref}
          className={styles.root}
          data-is-editing={false}
          data-main-content
          data-is-first
        >
          <header className={styles.root__header}>
            <div className={styles.root__filtertop}>
              <h4>List of Legislations</h4>
              {activeFilters.length ? <Button
                variation="transparent"
                size="small"
                onClick={onClearFilters}
              >
                Clear all filters
              </Button> : null}
            </div>
            <ul className={styles.root__filters} data-hidden={!showFilters}>
              {activeFilters?.slice(0, MAX_FILTER_NUMBER).map((o, index: number) => (
                <FilterItem
                  key={`filter-${o.name}-${o.identifier}-${index}`}
                  hidden={false}
                  option={o}
                  onItemRemove={onRemove}
                />
              ))}
              {activeFilters.length > MAX_FILTER_NUMBER ? (
                <li data-total-filters>
                    <span>+&nbsp;{activeFilters.length - MAX_FILTER_NUMBER}&nbsp;</span>
                </li>
              ) : null}
            </ul>
            <TabList
              id={LEGISLATION_PAGE_TABLIST}
              user={user}
              query={query}
              entries={tabs}
              onDataSort={onSort}
              isEditing={isEditing}
              isLoading={isLoading}
              selectedTab={selectedTab}
              onSearch={onSearchChange}
              setSelectedTab={setSelectedTab}
              onFilterOption={onFilterOption}
              variant='admin-tabs'
              showSearch
            >
              {tabs.map((tab, index) => (
                <Fragment key={index}>
                  {isLoading ?  <Loader data-details /> : (
                    <ul data-tab-list>
                      {tab.entries.length ? tab.entries.map((legislation: any, _index: number) => (
                        <LegislationListCard
                          key={legislation.identifier}
                          legislation={legislation}
                          user={user}
                          query={query}
                          isEditing={isEditing}
                          isActive={currentEditCard === legislation.identifier && isEditing}
                          onEdit={onEdit}
                          onEditButtonClick={() => setCurrentEditCard(legislation)}
                          data-tab-label={tab.label.toLowerCase().replace(' ', '_')}
                        />
                      )) : (
                        <EmptyLegislationList showContent={tab.entries.length === 0} query={query} />
                      )}
                    </ul>
                  )}
                </Fragment>
              ))}
            </TabList>
          </header>
        </section>

        {/* Edit modal */}
        <Modal
          id={LEGISLATION_DETAILS_EDIT_MODAL_ID}
          isOpen={isEditing}
          onOpen={() => setIsEditing(true)}
          onClose={() => setIsEditing(false)}
          data-variation="drawer"
        >
          {currentEditCard?.identifier ? (
            <EditLegislation
              user={user}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              editingType="default"
              filters={filters}
              legislation={isEditing ? currentEditCard as Legislation : {} as Legislation}
              setIsReadyToDelete={setIsReadyToDelete}
              isDeleted={isDeleted}
              setIsDeleted={setIsDeleted}
              setRequirementIdentifier={setRequirementData}
              data-drawer
            />
          ) : null }
        </Modal>

        {/* Uploading modal */}
        {isUploading ? (
          <Modal
            id='legislation-upload-modal'
            isOpen={isUploading}
            onOpen={() => setIsUploading(true)}
            onClose={() => setIsUploading(false)}
            data-upload-content
          >
            <header data-upload-header>
              <h2>Add legislations</h2>
              <Button
                variation='transparent'
                onClick={() => setIsUploading(false)}
                size='small'
              >
                <IconComponent name="CloseOutlineIcon" />
              </Button>
            </header>
            <section data-upload-content>
              <div>
                <p>
                  <strong>Upload CSV Template:&nbsp;</strong>
                  Ensure your CSV file follows the template format. If the template is modified in any way that does not match the standard template, the upload will not succeed.
                </p>
                {CAN_DOWNLOAD_TEMPLATE ? <span>Don't have the CSV Template? Download it&nbsp;<a href="#!">here</a></span> : null}
              </div>
              <div data-drag-space>
                <DragDropFile
                  ref={dragDropRef}
                  onCancel={() => setIsUploading(false)}
                  reset={reset}
                  uploadFile={uploadFile}
                  isSuccess={isSuccess}
                  isError={isError}
                  error={error}
                  isPending={isPending}
                  data={data}
                  showToast={showToast}
                />
              </div>
            </section>
          </Modal>
        ) : null }

        <Modal
          id={`delete requirement-type-for-${legislation.name_generic}`}
          isOpen={isReadyToDelete}
          onOpen={() => setIsReadyToDelete(true)}
          onClose={() => setIsReadyToDelete(false)}
          data-upload-content
          data-review-process
        >
          <header data-project-create-header>
            <Button
              variation='transparent'
              onClick={() => setIsReadyToDelete(false)}
              size='small'
            >
              <IconComponent name="CloseOutlineIcon" />
            </Button>
            <div>
              <h2>Are you sure you want to remove this requirement ?</h2>
            </div>
          </header>
          <p data-center>
            By clicking
            <strong>&nbsp;"Yes, remove requirement"&nbsp;</strong>, you confirm the removal of this requirement, and all the details that have been
            filled in will be lost. This action will also remove it from the client view.
          </p>

          {/* Action Buttons */}
          <ButtonSet data-btn-set data-project-edit data-remove-requirement>
            <Button
              variation="cancel"
              onClick={() => setIsReadyToDelete(false)}
              disabled={false}
            >
              No, keep it
            </Button>
            <Button
              type='button'
              onClick={onRequirementDeleteHandler}
              value="button"
              disabled={false}
            >
              Yes, remove requirement
            </Button>
          </ButtonSet>
        </Modal>
      </Fragment>
    );
  }

});

export default AdminPage;
