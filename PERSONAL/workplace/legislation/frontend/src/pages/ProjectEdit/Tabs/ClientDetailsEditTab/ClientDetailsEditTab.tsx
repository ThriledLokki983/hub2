import { ChangeEvent, Fragment, useCallback, useState } from "react";
import { CalendarDate, parseDate } from "@internationalized/date";
import { FormGroup, IconComponent, DatePicker, InputField } from "components";
import { EditComponentProps } from "../interfaces";
import { UserInterface } from "hooks/interfaces";

import styles from './ClientDetailsEditTab.module.scss';

const TODAY = new Date();
const TODAY_ISO = TODAY.toISOString().split("T")[0];

const ClientEditDetailsTab = ({
  selectedIndex,
  project,
  user,
  onInputChange,
}: EditComponentProps & {
  user: UserInterface;
  onInputChange: (name: string, newValue: string) => void,
}) => {

  const [date, setDate] = useState<CalendarDate>(parseDate(project.starting_date || ''));

  return (
    <section className={styles.root__client_edit_details} data-hidden={!(selectedIndex === 1)} data-create-content>
      <article data-logo>
        <span>Company logo</span>
        <div data-client-logo>
          <IconComponent name="ClientLogoIcon" />
          {/* <UploadLogo /> */}
        </div>
        <p className={styles.root__logo_text}>You can upload a JPG or PNG file. The max file size is 10mb.</p>
        <p className={styles.root__logo_text}>*Please make sure the client has approved the use of their logo.</p>
      </article>
      <FormGroup data-form-inputs data-edit-group="client_details">
        <InputField
          name="name"
          label='project name '
          inputValue={project?.name || ""}
          onInputChange={onInputChange}
          placeholder='Type your project name here'
          required
          data-allow-edit={user.is_admin && user.is_approver}
        />
        <InputField
          name="description"
          label='project description'
          subLabel={`Set up the client email domain, so that all the users within this domain get access to this client <br/>environment <strong data-email-domain>eg. pwc.com</strong>`}
          inputValue={project?.description || ""}
          onInputChange={onInputChange}
          placeholder='Write a project description here'
          required
          rows={7}
          isTextArea
          data-allow-edit={user.is_admin && user.is_approver}
        />
         <InputField
          name="domain"
          label='user email domain '
          subLabel={`Set up the client email domain, so that all the users within this domain get access to this client <br/>environment <strong data-email-domain>eg. pwc.com</strong>`}
          inputValue={project.domain || ""}
          onInputChange={onInputChange}
          placeholder='pwc.com'
          extra="How will this domain be used? Based on the input provided regarding the clients domain, all the users that log in to the platform using that domain, will have access to this client environment. eg. if the domain is @pwc.com, all the pwc employees that log in using the PwC SSO will be redirected to the PwC legislation environment"
          required
          data-user-email-domain
          data-allow-edit={user.is_admin && user.is_approver}
        />
        <DatePicker
          name="starting_date"
          label="starting date of engagement"
          subLabel="Set the starting date of the project engagement."
          variation="alternate"
          value={date}
          required={false}
          onChange={(date) => {
            onInputChange('starting_date', date.toString());
            setDate(date);
          }}
          data-allow-edit={user.is_admin && user.is_approver}
        />
      </FormGroup>
    </section>
  );

};

export default ClientEditDetailsTab;

const UploadLogo = () => {
  const [file, setFile] = useState<File[]>([]);

  /**
   * Handles the files
   */
  const handleFiles = useCallback((file: File[]) => {
    for (let i = 0, numFiles = file?.length; i < numFiles; i++) {
      const _file = file[i];
      setFile(() => [_file]);
    }
  }, []);


  /**
   * Handles any drop change
   * @param event
   */
  const handleChange = function (event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();

    if (event.target.files && event.target.files[0]) {
      handleFiles(Array.from(event.target.files));
    }
  };

  return (
    <div className={styles.root__upload}>
      {file.length > 0 ? (
        <div>
          <img src={URL.createObjectURL(file[0])} alt="Client Logo" />
        </div>
      ) : (
       <Fragment>
         <label htmlFor="upload-logo">
            <IconComponent name="UploadIcon" />
            <p>Click here to upload company logo.</p>
          </label>
          <input
            id="upload-logo"
            type="file"
            name="logo"
            accept=".jpg, .jpeg, .png"
            onChange={handleChange}
          />
       </Fragment>
      )}
    </div>
  );

};
