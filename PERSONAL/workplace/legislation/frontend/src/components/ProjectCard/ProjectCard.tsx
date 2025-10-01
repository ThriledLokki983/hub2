import { NavLink } from 'react-router-dom';
import { composeProjectUrl } from 'helpers/projects/projects';

import { IconComponent } from 'components/Icon/Icon';
import { ProjectCardProps } from './ProjectCard.interface';

import styles from './ProjectCard.module.scss';


const ProjectCard = ({ project }: ProjectCardProps) => {

  return (
    <li className={styles.root} data-project={project.identifier}>
      <NavLink
        to={project.identifier && `${composeProjectUrl(project.identifier, 'details', 1)}`}
        className={styles.root__card}
        title={`View details for: ${project.name}`}
      >
        <div>
          <IconComponent name="DefaultProjectIcon" />
          <span className={styles.root__tag}>
            <IconComponent name="DocumentMultipleFillIcon" />
            <small>{project?.legislation_count || 0}</small>
          </span>
        </div>
        <div>
          <h4>{project.name}</h4>
          <span>{project.description || 'No description available for this project'}</span>
          <span data-link>Go to Client Navigator View</span>
        </div>
      </NavLink>
    </li>
  );

};

export default ProjectCard;
