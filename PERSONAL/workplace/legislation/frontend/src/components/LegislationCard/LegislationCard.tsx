import { Children, Fragment, useState } from 'react';
import { NavLink, useNavigate  } from 'react-router-dom';
import { highlight } from 'helpers/utils';
import { getRelativeDateTime, formatDateString } from 'helpers/dateTime';
import  { composeLegislationDetailsUrl } from 'helpers/legislations/legislation';

import { Button, IconComponent } from '..';
import { Legislation } from 'hooks/interfaces';
import { LegislationCardProps } from './LegislationCard.interface';
import { NavigatorLegislation } from 'hooks/interfaces/navigator.interface';
import { APPROVED_STATE } from 'configs/legislation/legislation';
import styles from './LegislationCard.module.scss'

interface ExtendedLegislation extends Legislation {
  legislation_type: string;
}
interface ActionLabels {
  created: string;
  published: string;
  in_review: string;
}
const ACTION_LABELS: ActionLabels = {
  created: 'Edit',
  published: 'See Details',
  in_review: 'Review',
}

const NOT_PUBLISHED_TYPES = ['created', 'in_review'];

const LegislationCard = ({
  legislation,
  isListCard = true,
  user,
  query = '',
  isEditing = false,
  isActive = false,
  onEditButtonClick,
  seCurrentLegislation,
  onEdit,
  ...props
}: LegislationCardProps) => {

  const navigate = useNavigate();
  const [showArrow, setShowArrow] = useState(false);
  const isValidNavLegislationId = Boolean((legislation as NavigatorLegislation).legislation?.identifier);

  const effectiveDate = getRelativeDateTime(
    (legislation as Legislation).preparation_state === APPROVED_STATE
      ? (legislation as Legislation).updated_at
      : (legislation as Legislation).created_at || '', { includeTime: true });
  const isPublishedTab = !NOT_PUBLISHED_TYPES.includes((legislation as ExtendedLegislation).legislation_type);

  /**
   * Get the action title based on each the active tab
   */
  const getActionTitle = (label: string) => {
    const actionLabel = label as keyof typeof ACTION_LABELS;
    return ACTION_LABELS[actionLabel];
  };


  return (
    <Fragment>
      {isListCard ?
      (
        <li
          className={styles.root}
          data-is-active={isActive}
          onMouseEnter={() => setShowArrow(true)}
          onMouseLeave={() => setShowArrow(false)}
          title={`${user.is_admin ? getActionTitle((legislation as ExtendedLegislation)?.legislation_type): 'View'}: ${(legislation as Legislation).name_generic}`}
          {...props}
        >
          <NavLink
            to={isPublishedTab ? composeLegislationDetailsUrl((legislation as Legislation).identifier) : '#'}
            className={styles.root__card}
            data-user-is-admin={user.is_admin}
            data-is-editing={isEditing}
            onClick={(e: any) => {
              onEdit && !isPublishedTab && onEdit(e, (legislation as Legislation).identifier);
              onEditButtonClick && !isPublishedTab && onEditButtonClick(e, (legislation as Legislation).identifier);
            }}
            {...props}
          >
              <div
                aria-label={user.is_admin ? getActionTitle((legislation as ExtendedLegislation)?.legislation_type) : (legislation as Legislation).name_generic}
                title={`${user.is_admin ? getActionTitle((legislation as ExtendedLegislation)?.legislation_type) : 'View'}: ${(legislation as Legislation).name_generic}`}
              >
                <h5 dangerouslySetInnerHTML={{
                  __html: highlight((legislation as Legislation).name_generic, query)
                }}></h5>
                <span>
                  <small
                  dangerouslySetInnerHTML={{
                    __html: `${highlight((legislation as Legislation).name_local, query)} &nbsp;`
                  }}
                  ></small>
                  <small>{showArrow ? <IconComponent name="ArrowRightSmall" /> : null}</small>
                </span>
              </div>
              {!isEditing ? (<span className={styles.root__meta}>{formatDateString((legislation as Legislation).effective_date, 'en-UK')}</span>) :null}
              {!isEditing && !user.is_admin ? (<span className={styles.root__meta}>{`${effectiveDate.value} ${effectiveDate.label} ago`}</span>) :null}
              {!isEditing ? (<span className={styles.root__meta}>
                {(legislation as Legislation).type?.length
                  ? (legislation as Legislation).type?.at(0)?.name : 'Not available'}
              </span> ) : null}
              {user.is_admin
                ? (
                <span className={styles.root__meta} data-edit-column data-is-editing={isEditing}>
                  {!isEditing ? `${effectiveDate.value} ${effectiveDate.label} ago` : null}
                  {(user.is_admin) && !isPublishedTab ? (
                    <Button
                      variation="tertiary"
                      size="small"
                      type='button'
                      aria-label="Edit Legislation"
                      disabled={!user.is_approver && !user.is_preparer}
                      title={`${getActionTitle((legislation as ExtendedLegislation)?.legislation_type)}: ${(legislation as Legislation).name_generic}`}
                      onClick={(e: any) => {
                        onEdit && onEdit(e, (legislation as Legislation).identifier);
                        onEditButtonClick && onEditButtonClick(e, (legislation as Legislation).identifier);
                      }}
                    >
                      <span>{getActionTitle((legislation as ExtendedLegislation)?.legislation_type)}&nbsp;&nbsp;</span>
                      <IconComponent name="RightChevron" />
                    </Button>
                  ) : (
                    <Button
                      variation="tertiary"
                      size="small"
                      type='button'
                      aria-label="Edit Legislation"
                      disabled={!user.is_approver && !user.is_preparer}
                      title={`${getActionTitle((legislation as ExtendedLegislation)?.legislation_type)}: ${(legislation as Legislation).name_generic}`}
                      onClick={() => {navigate(composeLegislationDetailsUrl((legislation as Legislation).identifier))}}
                    >
                      <span> {getActionTitle((legislation as ExtendedLegislation)?.legislation_type)}&nbsp;&nbsp;</span>
                      <IconComponent name="RightChevron" />
                    </Button>
                  )}
                </span>
              ) : null}
          </NavLink>
        </li>
      ) : (
        <article className={styles.root__cardcontent} data-navigation>
           <div className={styles.root__content}>
            <ul>
              {Children.toArray((legislation as NavigatorLegislation).attention_points?.map((attention, index) => (
                <li data-number={index+1}>
                  <div>
                    <span>{index+1}.</span>
                    <span className={styles.root__roletitle}>{attention.note}</span>
                  </div>
                  <ul>
                    <span>Relevant job roles</span>
                    {Children.toArray((attention as any).job_role_list?.map((role: { identifier: string; name: string; }) => (
                      <li key={`role-${role?.identifier}`}>
                        <span>{role?.name}</span>
                      </li>
                    )))}
                  </ul>
                </li>
              )))}
            </ul>

            {(legislation as NavigatorLegislation).legislation.background ? (
              <div className={styles.root__detailrow}>
                <span data-title>background</span>
                <span data-subtitle>{(legislation as NavigatorLegislation).legislation.background}</span>
              </div> )
            : null}
            {(legislation as NavigatorLegislation).legislation.non_compliance_risk ? (
              <div className={styles.root__detailrow}>
                <span data-title>risk of non compliance</span>
                <span data-subtitle>{(legislation as NavigatorLegislation).legislation.non_compliance_risk}</span>
              </div> )
            : null}
          </div>
          <NavLink
            to={composeLegislationDetailsUrl((legislation as NavigatorLegislation).legislation.identifier)}
            onClick={seCurrentLegislation}
            state={{ legislationId: (legislation as NavigatorLegislation).legislation.id }}
            aria-disabled={!isValidNavLegislationId}
            aria-label={`View more details`}
            title={`View details for: ${(legislation as NavigatorLegislation).legislation.name_local}`}
          >
            View more legislation details&nbsp;
            <IconComponent name="ArrowRightSmall" />
          </NavLink>
      </article>
      )}
    </Fragment>
  );

};

export default LegislationCard;
