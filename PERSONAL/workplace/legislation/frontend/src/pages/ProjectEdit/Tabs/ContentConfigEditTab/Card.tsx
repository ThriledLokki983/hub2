import { highlight } from "helpers/utils";
import { getRelativeDateTime } from "helpers/dateTime";

import { Legislation, UserInterface } from "hooks/interfaces";
import { ConfigLegislation, ProjectLegislation } from "hooks/interfaces/project.interface";
import { Button, ButtonSet, IconComponent } from "components/index";
import { NavLink } from "react-router-dom";
import { PATH_LEGISLATION } from "configs/paths";

interface Props {
  query: string;
  user: UserInterface;
  isFiltering: boolean;
  configLeg: ConfigLegislation | Legislation;
  setIsEditing: (isEditing: boolean) => void;
  setCurrentEditCard: (legislation: ProjectLegislation) => void;
  type?: "details" | "edit";
  [key: string]: any;
}

const Card = ({
  user,
  query,
  configLeg,
  isFiltering,
  setIsEditing,
  setCurrentEditCard,
  type = "edit",
  ...props
}: Props) => {

  /**
   * Get the human readable relative date
   * @param legislation
   * @returns
   */
  const getRelativeDate = (date: string) => {
    if (!date) return '';

    const { value, label } = getRelativeDateTime(date || '', { includeTime: true });
    return `${value} ${label} ago`;
  };

  const legislationGenericName = !isFiltering ? (configLeg as ConfigLegislation)?.legislation?.name_generic : (configLeg as Legislation)?.name_generic;
  const legislationLocalName = !isFiltering ? (configLeg as ConfigLegislation).legislation?.name_local : (configLeg as Legislation)?.name_local;
  const legislationData = !isFiltering ? {
    ...(configLeg as ConfigLegislation).legislation,
    is_filtering: isFiltering,
    view_type: type,
    isPublishedForClient: (configLeg as ConfigLegislation).is_published,
  } : {...(configLeg as Legislation), is_filtering: isFiltering, view_type: type, isPublishedForClient: (configLeg as ConfigLegislation).is_published, };
  const isSelecting = !isFiltering ? (configLeg as ConfigLegislation).is_selecting : false;
  const isPublished = !isFiltering ? (configLeg as ConfigLegislation).is_published : false;

 /*********************************************************
 * Components to make the Card                          *
 ********************************************************/

  /**
   * Handles Returning the action button
   * @returns
   */
  const renderButton = () => {
    return (
      <ButtonSet>
        {!isSelecting ? (
          <Button
            variation='tertiary'
            size="small"
            aria-label="Edit Legislation"
            title={`See client role-specific content for: ${legislationGenericName}`}
            onClick={() => {
              setIsEditing(true);
              setCurrentEditCard(legislationData as any);
            }}
            data-edit-btn
          >
            {type === "details" ? "View details" : "Edit"}
            <IconComponent name="RightChevron" />
          </Button>
        ) : <>&nbsp;</>}
      </ButtonSet>
    );

  };


  /**
   * Handles the rendering of the review status
   * @returns
   */
  const renderReviewHistory = () => {
    return (
      <span data-history>
        <small>
          {isPublished ? `Approved: ${getRelativeDate(configLeg.created_at)}` : 'No review history yet'}
        </small>
      </span>
    )
  };


  /**
   * Handles rendering the review history for the legislation
   * @returns
   */
  const renderDetails = () => {
    return (
      <div>
        <h5
          dangerouslySetInnerHTML={{
            __html: highlight(legislationGenericName  === 'nan' ? legislationLocalName : legislationGenericName, query)
          }}
        ></h5>
        <span>
          <small
          dangerouslySetInnerHTML={{
            __html: `Checked ${getRelativeDate(configLeg.created_at)} &nbsp;`
          }}
          ></small>
        </span>
      </div>
    );

  };


  return (
    <li data-legislation-card {...props} data-is-filtering={isFiltering}>
      {type === "edit" ? (
        <article
          title={`See client role-specific content for: ${legislationLocalName}`}
          aria-label={`See client role-specific content for: ${legislationLocalName}`}
          onClick={() => {
            if (isSelecting) return;
            setIsEditing(true);
            setCurrentEditCard(legislationData as any);
          }}
          >
            {renderDetails()}
            {renderReviewHistory()}
            {renderButton()}
          </article>
      ) : (
        <NavLink
          to={`${PATH_LEGISLATION}/all/${legislationData.identifier || ''}`}
          title={`See client role-specific content for: ${legislationLocalName}`}
          aria-label={`See client role-specific content for: ${legislationLocalName}`}
          onClick={() => {
            if (isSelecting) return;
            setIsEditing(true);
            setCurrentEditCard(legislationData as any);
          }}
        >
          {renderDetails()}
          {renderReviewHistory()}
          {renderButton()}
        </NavLink>
      )}
    </li>
  );

};

export default Card;
