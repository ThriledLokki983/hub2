import { IconComponent  } from 'components';


const EmptyProjects = () => {
  return (
    <article data-is-empty>
      <IconComponent name="EmptyProjects" />
      <h3>There are currently no created client projected. Click on “New Project” and start configuring a client's environment. </h3>
    </article>
  );

};

export default EmptyProjects;
