import { Children, Fragment, useCallback, useState, forwardRef, useRef, useEffect } from 'react';
import { uuid } from '@grrr/utils';

import { IconComponent, Button, ButtonSet } from 'components';
import { DragDropFileProps, DragDropFileHandle } from './DragDropFile.interface';
import styles from './DragDropFile.module.scss';

const FILE_UPLOAD_FORM_ID = 'form-file-upload';


const DragDropFile = forwardRef<DragDropFileHandle, DragDropFileProps>(({
  onCancel,
  showToast,
  uploadFile,
  isSuccess,
  isError,
  reset,
  isPending,
  error,
  data,
  rest
}, ref) => {
  const formRef = useRef<HTMLFormElement>(null);

  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
  const [uploadError, setUploadError] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [existingData, setExistingData] = useState<string[]>([]);
  const [errorData, setErrorData] = useState<any[]>([]);
  const [file, setFile] = useState<any[]>([]);


  useEffect(() => {
    if (isError && !isSuccess) {
      const errorData = JSON.parse(error?.message || `{}`);
      setErrorData(errorData.errors || []);
    }
  }, [error, isError, isSuccess]);


  /**
   * Set the existing data
   */
  useEffect(() => {
    if (data && data.results) {
      setExistingData([...data.results[0].existing_legislation_list]);
    }
  }, [data]);

  /**
   * Handles the drag actions
   * @param e
   */
  const handleDrag = function (event: React.DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (event.type === "dragenter" || event.type === "dragover") {
      setDragActive(true);
      setUploadError(false);

    } else if (event.type === "dragleave") {
      setDragActive(false);
      setUploadError(false);
    }
  };


  /**
   * Check for the correct file type
   */
  const isFileValid = function (file: any) {
    return file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  };


  /**
   * Handles dropping the file in the right zone
   * @param event
   */
  const handleDrop = function (event: React.DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    // Check for the the correct file type (.xlsx) and set the dragActive to false and return
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const _file = event.dataTransfer.files[0];
      if (!isFileValid(_file)) {
        setUploadError(true);
        return;
      }
    }

    setDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      handleFiles(event.dataTransfer.files);
    }
  };


  /**
   * Handles any drop change
   * @param event
   */
  const handleChange = function (event: any) {
    event.preventDefault();

    setDragActive(false);
    setUploadError(false);

    if (event.target.files && event.target.files[0]) {
      handleFiles(event.target.files);
    }
  };


  /**
   * Handles the files
   */
  const handleFiles = useCallback((file: any) => {
    for (let i = 0, numFiles = file?.length; i < numFiles; i++) {
      const _file = file[i];
      setFile(() => [_file]);
    }
  }, []);


  /**
   * Handle clearing the selected files
   */
  const clearSelectedFiles = (event: any) => {
    event.preventDefault();

    setDragActive(false);
    setUploadError(false);
    setFile(() => []);
    handleFiles([]);
  };


  /**
   * Handle Form input changes.
   */
  const onFormInputChange = (event: any) => {
    if (!formRef.current) return;

    const dataUpdated: { [key: string]: any } = {};
    const formData = new FormData(formRef.current);
    formData.forEach((value, key) => {
      dataUpdated[key] = value;
    });

    dataUpdated['name'] = new Date().getTime().toString();
    setFormValues(dataUpdated);
  };


  /**
   * Handle form submission.
   */
  const formSubmitHandler = (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file[0]);
    formData.append('name', `${new Date().getTime().toString()}-${uuid()}`);

    uploadFile(formData);
  };


  /**
   * Handle the file upload on error
   */
  useEffect(() => {
    if (file.length === 0 && isError) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file.length, isError]);


  /**
   * On Success
   */
  useEffect(() => {
    if (isSuccess) {
      showToast({
        title: 'Success',
        message: 'Legislation uploaded successfully',
        type: 'message',
        active: true,
        persistent: false
      })
      reset();

      if (!data.results[0].existing_legislation_list.length) {
        setFile(() => []);
        onCancel();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess])


  /**
   * Handles converting the size of the file to human readable size
   * @param file
   * @returns
   */
  const convertFileSize = (file: File) => {
    if (file.size < 1024 * 1024) {
      const fileSizeInKB = (file.size / 1024).toFixed(2);
      return`${fileSizeInKB} KB`;
    } else {
      const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      return`${fileSizeInMB} MB`;
    }
  };


  return (
    <section>
      <form
        id={FILE_UPLOAD_FORM_ID}
        className={styles.root}
        onSubmit={formSubmitHandler}
        onChange={onFormInputChange}
        ref={formRef}
        {...rest}
      >
        <input
          type="file"
          name='file'
          id="input-file-upload"
          className={styles.root__input}
          accept=".xlsx, application/msexcel"
          onChange={handleChange}
        />

        {/* Drag and Drop / File Select Area */}
        <label
          id="label-file-upload"
          htmlFor="input-file-upload"
          className={styles.root__label}
          data-has-file={file.length > 0}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          data-drag-active={dragActive}
        >
          <div className={styles.root__upload_local} data-has-file={file.length > 0}>
            <input
              type="file"
              name="file"
              id="upload-local"
              className={styles.root__input}
              accept=".xlsx, application/msexcel"
              onChange={handleChange}
            />
            <span>Drag and drop or&nbsp;</span>
            <label htmlFor="upload-local" className={styles.root__label}>
              choose file
            </label>
          </div>
        </label>

        {/* We will always have one file but just in case we have many -- then we are already good here */}
        <ul className={styles.root__files_to_upload} data-has-file={file.length > 0} data-is-error={isError} data-is-info={existingData.length > 0}>
            {Children.toArray(file.map((file, _index) => (
              <li>
                {isError ? <IconComponent name="WarningFillIcon" data-info-icon /> : null}
                <span>
                  {file.name.length > 20
                    ? `${file.name.slice(0, 50)}...`
                    : file.name
                  }
                </span>
                <Button variation='transparent' onClick={clearSelectedFiles}>
                  <IconComponent name="DeleteFillIcon" />
                </Button>
              </li>
            )))}
        </ul>

        {/* Drag Area */}
        <div
          id="drag-file-element"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={styles.root__file_element}
          data-drag-active={dragActive}
          data-drag-error={uploadError}
        ></div>
      </form>

      {/* Error list */}
      <article data-drag data-is-hidden={file.length === 0 || !isError} className={styles.root__errors} data-duplicate={existingData.length > 0}>
        {error?.message === 'Forbidden' ? (
          <small>You are not allowed to upload a legislation.</small>
        ) : (
          <Fragment>
            <p>
              It looks like the format of your uploaded file does not match the required template. Please ensure your CSV file follows the correct format and try again.
            </p>
            <ul>
              <p><strong>Here are some common issues to check:</strong></p>
              {Children.toArray(errorData.map((error: { detail: string, error: string }, index) => (
                <li key={`${error.detail}-${index+1}`}>
                  <span><strong><em>{error.detail}&nbsp;</em></strong></span>
                  <span>{error.error}</span>
                </li>
              )))}
            </ul>

          </Fragment>
        )}
      </article>

      {/* Duplicate info */}
      <article data-drag data-is-hidden={existingData.length === 0} className={styles.root__duplicate_info}>
        {existingData.length ? (
          <Fragment>
            <p><strong>Duplicate legislations we detected:</strong></p>
            <p>Some of the names in the uploaded file already exist. Below are the names found;</p>
            <ul>
              {Children.toArray(existingData.map((data, index) => (
                <li key={`${data}-${index+1}`}>
                  <span>{data}</span>
                </li>
              )))}
            </ul>
          </Fragment>
        ) : null}
      </article>

      <span data-size>Maximum size: 10MB {file.length ? <small>&nbsp;&nbsp;(<strong>{convertFileSize(file[0])}</strong>)</small> : null}</span>
      {/* Action Buttons */}
      <ButtonSet data-btn-set>
        <Button variation="transparent" onClick={onCancel} disabled={false}>
          Cancel
        </Button>
        <Button
          type="submit"
          aria-controls={FILE_UPLOAD_FORM_ID}
          form={FILE_UPLOAD_FORM_ID}
          value="Submit"
          disabled={!file.length || isPending}
        >
          Upload legislation
        </Button>
      </ButtonSet>
    </section>
  );

});

export default DragDropFile;
