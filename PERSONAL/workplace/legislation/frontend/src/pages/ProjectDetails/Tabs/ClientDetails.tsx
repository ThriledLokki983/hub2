import { IconComponent } from "components/index";
import { EditComponentProps } from "./interface";

import styles from "../Index.module.scss";


const ClientDetails = ({ selectedIndex, project }: EditComponentProps) => {

  return (
    <section className={styles.root__client_details} data-hidden={!(selectedIndex === 1)} data-create-content>
      {/* Logo of the client */}
      <article data-logo>
        <span>Company logo</span>
        <div data-client-logo>
          <IconComponent name="ClientLogoIcon" />
        </div>
        <p className={styles.root__logo_text}>You can upload a JPG or PNG file. The max file size is 10mb.</p>
        <p className={styles.root__logo_text}>*Please make sure the client has approved the use of their logo.</p>
      </article>

      {/* Client details */}
      <section data-edit-group="client_details">
        <div data-row>
          <span data-title>project name</span>
          <span data-subtitle>{project?.name}</span>
        </div>

        <div data-row>
          <span data-title>project description</span>
          <span data-subtitle>{project?.description}</span>
        </div>

        <div data-row>
          <span data-title>user email domain</span>
          <span data-domain data-top-content>
            Set up the client email domain, so that all the users within this domain get access to this client
            environment <strong data-email-domain>eg. pwc.com</strong>
          </span>
          <span data-subtitle data-domain-content>{project?.domain}</span>
          <span data-domain>
            <strong>How will this domain be used?</strong> Based on the input provided regarding the clients domain, all the users that log in to the platform using that domain, will have access to this client environment. eg. if the domain is @pwc.com, all the pwc employees that log in using the PwC SSO will be redirected to the PwC legislation environment
          </span>
        </div>

        <div data-row>
          <span data-title>starting date of engagement</span>
          <span data-subtitle>{project?.starting_date || 'Currently unknown'}</span>
        </div>
      </section>
    </section>
  );

};

export default ClientDetails;
