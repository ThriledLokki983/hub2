import { DatePicker, FormGroup, InputField } from "components";
import { ChangeEvent, useCallback, useState } from "react";
import DefaultCompanyLogo from 'assets/image.png';
import styles from './Clientdetails.module.scss'
import { CalendarDate, parseDate } from "@internationalized/date";

interface CreateTab {
  selectedIndex: number,
  direction: string
}

const TODAY = new Date();
const TODAY_ISO = TODAY.toISOString().split("T")[0];
const SHOW_UPLOAD_LOGO = false;


const ClientDetails = ({
  selectedIndex,
  direction,
  onInputChange,
 }: CreateTab & {
  onInputChange: (name: string, newValue: string) => void,
 }) => {
  const [selectedDate, settSelectedDate] = useState<CalendarDate | null>(null);

  return (
    <section data-hidden={!(selectedIndex === 1)} data-create-content>
      <FormGroup data-form-inputs data-create-group="client_details" data-direction={direction}>
        <InputField
          name="name"
          label='project name '
          inputValue={""}
          onInputChange={onInputChange}
          placeholder='Type your project name here'
          required
        />
        <InputField
          name="domain"
          label='user email domain '
          subLabel={`Set up the client email domain, so that all the users within this domain get access to this client <br/>environment <strong data-email-domain>eg. pwc.com</strong>`}
          inputValue={""}
          onInputChange={onInputChange}
          placeholder='pwc.com'
          required
          data-user-email-domain
        />
        <DatePicker
          name="starting_date"
          label="starting date of engagement"
          value={selectedDate && parseDate(selectedDate.toString())}
          required={false}
          subLabel=''
          onChange={(date) => {
            onInputChange('starting_date', date.toString());
            settSelectedDate(date);
          }}
        />
        <InputField
          name="description"
          label='project description'
          inputValue={""}
          onInputChange={onInputChange}
          placeholder='Write a project description here'
          required
          isTextArea
          rows={3}
          data-user-email-domain
        />
        {SHOW_UPLOAD_LOGO ? <UploadLogo /> : null }
      </FormGroup>
    </section>
  );

};


export default ClientDetails;

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
      <h5>Add company logo</h5>
      <div>
        <span data-show-default={!file.length}>
          {file.length > 0 ? (
            <img src={URL.createObjectURL(file[0])} alt="Company Logo" />
          ) : (
            <img src={DefaultCompanyLogo} alt="Default company logo" />
          )}
        </span>
        <div data-left-column>
          <div className={styles.root__upload_local} data-has-file={file.length > 0}>
            <input
              type="file"
              name="logo"
              id="upload-logo"
              accept=".jpg, .png, .jpeg"
              onChange={handleChange}
            />
            <label htmlFor="upload-logo" className={styles.root__label}>
              Upload your photo
            </label>
          </div>
          <p className={styles.root__upload_text}>You can upload a JPG or PNG file. The max size is 10mb.</p>
          <p className={styles.root__upload_text}>*Please make sure the client has approved the use of their logo.</p>
        </div>
      </div>
    </div>
  )
};
