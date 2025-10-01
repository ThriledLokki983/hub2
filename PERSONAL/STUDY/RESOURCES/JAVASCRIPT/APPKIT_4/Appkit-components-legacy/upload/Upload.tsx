import React, { useState, useRef } from "react";
import ClassNames from "classnames";
import UploadList from "./UploadList";
import AjaxUpload from "./AjaxUpload";
import { Button } from '../button';
import { getFileItem, removeFile, parseJson } from "./utils";
import { KEY_VALUES } from '../utils';

export type UploadStatus =
  | 'uploading'
  | 'error'
  | 'deleted'
  | 'success'
  | 'ready';


export type FileModel = {
  uid: string,
  type: string,
  name: string,
  size: number,
  lastModifiedDate?: Date,
  status?: UploadStatus,
  percent?: number,
  originFile?: object,
  response?: any,
  error?: any
};


export type UploadProps = {
  style?: Object,
  className?: string,
  children?: React.ReactNode,
  action?: string,
  headers?: Object,
  data?: Object,
  multiple?: boolean,
  withCredentials?: boolean,
  showFileList?: boolean,
  disabled?: boolean,
  autoUpload?: boolean,
  drag?: boolean,
  accept?: Function,
  onClose?: Function,
  beforeUpload?: Function,
  onRemove?: Function,
  onProgress?: Function,
  onSuccess?: Function,
  onError?: Function,
  onChange?: Function,
  color?: string,
  acceptFileType?: string,
  directory?: boolean,
  mode?: string,
  showFullFileName?: boolean,
  fileListItemClassName?: string,
  externalUpload?: (fileAPI: fileAPITypes, file: FileModel) => any,
  externalCancel?: (e: any) => void,
  extraPropToFlowjs?: Object,
  theme?: any,
  config?: any,
  uploadInstruction?: string,
  errorMessage?: string,
  uploadTitle?: string,
  uploadButtonName?: string,
  onUpload?: (fileList: any) => void,
  maxFileSize?: number
};

interface fileAPITypes {
  headers?: any,
  query?: any,
  target: string,
  withCredentials?: boolean,
  singleFile?: boolean,
  generateUniqueIdentifier?: (file: FileModel) => string
};

const defaultProps = {
  headers: {},
  color: "default",
  showFileList: true,
  autoUpload: false,
  drag: true,
  showFullFileName: true,
  onRemove(targetItem: any, newFileList: any) { },
  onProgress(targetItem: any) { },

  onError(targetItem: any) { },
  onChange(file: any, fileList: any) { }
};

const Upload: React.FC<UploadProps> = (parmprops) => {

  let props = Object.assign({}, defaultProps, parmprops);
  let {
    showFileList,
    className,
    fileListItemClassName,
    style,
    autoUpload,
    multiple,
    disabled,
    action,
    headers,
    data,
    withCredentials,
    drag,
    accept,
    beforeUpload,
    onRemove,
    onChange,
    showFullFileName,
    externalUpload,
    externalCancel,
    extraPropToFlowjs,
    acceptFileType,
    directory,
    uploadTitle = '',
    uploadButtonName = 'Upload',
    onClose,
    maxFileSize,
    onUpload,
    config = {
      type: "inline",
      trigger: false,
      size: true
    },
    uploadInstruction = "",
    ...otherProps
  } = props;
  const uploadInner: any = useRef();

  let [fileList, setfileList] = useState<Array<object>>([]);

  /**
  * @param {FileModel} file - extended file object
  */
  const onStart = (file: FileModel): void => {

    if (!props.multiple) {
      fileList.splice(0);
    }
    fileList.push(file);
    props.onChange(file, fileList);
    setfileList([...fileList]);
  };

  /**
   * @param {Object} e - progress information
   * @param {FileModel} file - extended file object
   */
  const onProgress = (percent: number, file: FileModel): void => {
    let targetItem = getFileItem(file, fileList);
    if (targetItem) {
      targetItem.status = "uploading";
      targetItem.percent = percent;
      props.onProgress && props.onProgress(targetItem);
      setfileList([...fileList]);
    }
  };



  /**
   * @param {Error} error - error object
   * @param {FileModel} file - extended file object
   */
  const onError = (error: Error, file: FileModel): void => {
    // let fileList = this.state.fileList;
    let targetItem = getFileItem(file, fileList);
    if (targetItem) {
      targetItem.error = error;
      targetItem.status = "error";
      setfileList([...fileList]);
      props.onError(targetItem);
      props.onChange(targetItem, fileList);
    }
  };

  const onUnaccept = (file: { error: any; status: any; uid: string; type: string; name: string; size: number; lastModifiedDate?: Date | undefined; percent?: number | undefined; originFile?: object | undefined; response?: any; }) => {
    // let { fileList } = this.state;

    file.error = "_unaccept_";
    file.status = "error";

    if (!props.multiple) {
      fileList = [];
    }

    fileList.push(file);
    // this.setState({ fileList: fileList });
    setfileList([...fileList]);
  };

  /**
   * @param {Object} response - server response
   * @param {FileModel} file - extended file object
   */
  const onSuccess = (response: any, file: FileModel): void => {
    response = parseJson(response);
    let targetItem = getFileItem(file, fileList);
    if (targetItem) {
      targetItem.status = "success";
      targetItem.response = response;
      setfileList([...fileList]);
      props.onSuccess && props.onSuccess(targetItem);
      props.onChange(targetItem, fileList);
    }
  };


  /**
   * Remove file call back funtion
   * @param {FileModel} file - extended file object
   */
  const handleRemoveFile = (file: FileModel): void => {
    //get current file of filelist
    let targetItem = getFileItem(file, fileList);
    //cancel request
    uploadInner.current.cancel(file.uid);

    if (targetItem) {
      targetItem.status = "deleted";
      let newFileList: Array<FileModel> = removeFile(file, fileList);
      setfileList([...newFileList]);
      props.onRemove(targetItem, newFileList);
      props.onChange(targetItem, newFileList);
    }
  };

  const handleAllRemoveFile = () => {
    // let fileList = this.state.fileList;
    setfileList([]);
    let newFileList = fileList
      .map((file: any) => {
        file.status = "deleted";
        return file;
      });
    props.onRemove(newFileList, []);
    props.onChange(newFileList, []);
  };

  const handleDeleteAll = (event: React.KeyboardEvent) => {
    const { key } = event;
    if ((key === KEY_VALUES.ENTER || key === KEY_VALUES.SPACE) && !props.disabled) {
      handleAllRemoveFile();
    }
  }

  /**
   * API: Upload file on trigger
   */
  const submit = (): void => {
    if (fileList && fileList.length) {
      if (action) {
        fileList
          .filter((file: any) => file.status === "ready")
          .forEach(file => {
            uploadInner.current.upload(file);
          });
      }
      onUpload && onUpload(fileList);
    }

  };

  /**
   *  API: cancel current upload
   *
   */
  const cancel = () => {
    fileList
      .filter((file: any) => file.status === "uploading")
      .forEach((file: any) => {
        uploadInner.current.cancel(file.uid);
      });
  }

  /**
   * Retry upload
   * @param {FileModel} file - extended file object
   * again upload
   */
  const retryUpload = (file: FileModel): void => {
    if (file) {
      setfileList([...fileList]);
      uploadInner.current.upload(file);
    }
  };

  const renderUploadList = (): React.ReactNode => {
    return (
      <UploadList
        showFullFileName={props.showFullFileName}
        fileListItemClassName={props.fileListItemClassName}
        files={fileList}
        onRemove={handleRemoveFile}
        autoUpload={props.autoUpload}
        multiple={props.multiple}
        retryUpload={retryUpload}
        config={config}
        errorMessage={props.errorMessage}
      />
    );
  };

  const generateUploaderFragment = (): React.ReactNode => {
    const uploaderProps = {
      autoUpload: props.autoUpload,
      action: props.action,
      multiple: props.multiple,
      beforeUpload: props.beforeUpload,
      withCredentials: props.withCredentials,
      headers: props.headers,
      disabled: props.disabled,
      data: props.data,
      accept: props.accept,
      drag: props.drag,
      onStart: onStart,
      onProgress: onProgress,
      onSuccess: onSuccess,
      onError: onError,
      onUnaccept: onUnaccept,
      onRemove: handleRemoveFile,
      externalUpload: props.externalUpload,
      externalCancel: props.externalCancel,
      extraPropToFlowjs: props.extraPropToFlowjs,
      ref: uploadInner,
      acceptFileType: props.acceptFileType,
      directory: props.directory,
      mode: props.mode,
      maxFileSize,
      config
    };

    const trigger = props.children;

    return (
      <AjaxUpload key="AjaxUpload" {...uploaderProps}>
        {trigger}
      </AjaxUpload>
    );
  };
  const containerClass = ClassNames("ap-fileupload", props.className, {
    "ap-fileupload-modal": config.type === 'modal',
  });

  const titleClass = ClassNames("ap-fileupload-title", props.className, {
    "title-modal": config.type === 'modal',
    "title-inline": config.type !== 'modal',
  });

  const instructionClass = ClassNames("ap-fileupload-instruction", {
    "instruction-modal": config.type === 'modal' && !config.trigger,
    "instruction-modal-button": config.type === 'modal' && config.trigger,
    "instruction-inline": config.type !== 'modal'
  });
  let uploadList, uploader;

  uploader = generateUploaderFragment();
  // Generate upload list section
  if (props.showFileList && fileList.length) {
    uploadList = renderUploadList();
  }
  return <div style={props.style} className={containerClass} {...otherProps}>
    <div className="ap-fileupload-wrapper">
      <div className={titleClass}>
        <span >{uploadTitle}</span>
        {
        config.type === 'modal' && (
          <button onClick={onClose && onClose(fileList)} className="ap-fileupload-title-close" aria-label="close" type="button">
            <span className="Appkit4-icon icon-close-outline"></span>
          </button>
        )
        }
      </div>
      <div className={instructionClass}>
        {uploadInstruction}
      </div>
      {uploader}
      {uploadList}
      <div className="ap-fileupload-footer">
        <div className="ap-fileupload-footer-delete-attachment">
          {
            fileList && fileList.length > 0 && (
              <span
                role="button"
                onClick={handleAllRemoveFile}
                onKeyDown={handleDeleteAll}
                tabIndex={0}
              >
                Delete all attachments
              </span>
            )
          }
        </div>
        {config.trigger && (
          <div className="ap-fileupload-footer-btn">
            <Button onClick={submit} disabled={!fileList.length}>{uploadButtonName}</Button>
          </div>)
        }
      </div>
    </div>
  </div>
}


export default Upload;
