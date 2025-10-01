import React, { useState, forwardRef, useImperativeHandle, useRef } from "react";
import ClassNames from "classnames";
import Flow from "@flowjs/flow.js";
import type { FileModel } from "./Upload";
import Dragger from "./Dragger";
import { generateUid } from "./utils";
import { KEY_VALUES } from "../utils";


type AjaxUploadProps = {
  /**
   * The content of AjaxUpload
   */
  children?: React.ReactNode,
  style?: Object,
  className?: string,
  accept?: Function,
  action: string,
  autoUpload?: boolean,
  beforeUpload?: Function,
  data?: Object,
  headers?: Object,
  multiple?: boolean,
  onStart: Function,
  onProgress: Function,
  onSuccess: Function,
  onError: Function,
  onRemove?: Function,
  withCredentials?: boolean,
  drag?: boolean,
  disabled?: boolean,
  acceptFileType?: string,
  onUnaccept: (e: any) => void,
  externalCancel?: (e: any) => void,
  externalUpload?: (fileAPI: fileAPITypes, file: FileModel) => any,
  extraPropToFlowjs?: any,
  directory?: Boolean,
  uploadInstruction?: string,
  config?: any,
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

const AjaxUpload: React.FC<AjaxUploadProps> = forwardRef((props: AjaxUploadProps, ref: any) => {

  const requestQueue: any = {};
  let input: any;
  
  const [stMode, setMode] = useState('files');
  const kodiv: any = useRef();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    if (e.target instanceof HTMLInputElement) {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        uploadFiles(files);
        if (fileInputRef.current) {
          (fileInputRef.current as HTMLInputElement).value = null;
        }
      }
    }
  };

  const uploadFiles = (files: FileList): void => {
    const { multiple, accept, onUnaccept, maxFileSize } = props;
    let postFiles = Array.prototype.slice.call(files);
    if (maxFileSize && maxFileSize > 0) {
      postFiles = postFiles.filter(e => {
        if (e.size && (e.size <= maxFileSize)) return e;
      });
    }

    if (postFiles.length === 0) {
      return;
    }

    if (!multiple) {
      postFiles = postFiles.slice(0, 1);
    }
    let _postFiles = postFiles;

    if (accept) {
      _postFiles = accept && accept(_postFiles);
    }

    if (_postFiles.length < postFiles.length) {
      const unacceptables = postFiles.filter(e => {
        return _postFiles.indexOf(e) === -1;
      });
      unacceptables.forEach(e => {
        onUnaccept && onUnaccept(e);
      });
    }
    if (_postFiles.length === 0) {
      return;
    }

    _postFiles.forEach(file => {
      let fileModel: FileModel = {
        uid: generateUid(),
        status: "ready",
        percent: 0,
        name: file.name,
        size: file.size,
        type: file.type,
        lastModifiedDate: file.lastModifiedDate,
        originFile: file
      };

      props.onStart(fileModel);
      if (props.autoUpload) {
        upload(fileModel);
      }
    });
  };

  const cancel = (uid: string) => {
    requestQueue[uid] && requestQueue[uid].cancel();

    if (props.externalCancel) {
      props.externalCancel(uid);
    }
  }

  const upload = (file: FileModel): void => {
    const { beforeUpload } = props;
    if (beforeUpload) {
      const beforeResult = beforeUpload(file);
      if (beforeResult && beforeResult.then) {
        beforeResult.then((processedFile: FileModel) => {
          if (
            Object.prototype.toString.call(processedFile) === "[object File]"
          ) {
            startUploading(processedFile);
          } else {
            startUploading(file);
          }
        });
      } else if (
        beforeResult === false &&
        typeof props.onRemove === "function"
      ) {
        props.onRemove(file);
      } else {
        startUploading(file);
      }
    } else {
      return startUploading(file);
    }
  }

  const startUploading = (file: any) => {
    const {
      headers,
      withCredentials,
      data,
      action,
      onProgress,
      onSuccess,
      onError,
      externalUpload,
      extraPropToFlowjs
    } = props;

    const fileAPI = {
      headers: headers,
      query: data,
      target: action || "/",
      withCredentials,
      singleFile: true,
      generateUniqueIdentifier: (file: FileModel) => {
        const d = new Date().toISOString();
        return d + "-" + file.name;
      },
      ...extraPropToFlowjs
    };
    if (externalUpload) {
      externalUpload(fileAPI, file);
      return;
    }
    const flow = new Flow(fileAPI);
    const uid = file.uid;
    flow.on("filesSubmitted", () => {
      flow.upload();
    });

    flow.on("fileSuccess", function (file, message) {
      onSuccess(message, file.file);
      delete requestQueue[uid];
    });

    flow.on("fileError", (file: any, message: string) => {
      file.file.uid = uid;
      onError(message, file.file);
    });

    flow.on("fileProgress", (file: any) => {
      const p = parseInt(flow.progress() * 100);
      file.file.uid = uid;
      onProgress(p, file.file);
    });

    file.originFile && flow.addFile(file.originFile);

    requestQueue[uid] = flow;
  }

  const handleClick = (e: any): void => {
    if (!props.disabled) {
      fileInputRef.current.click();
      // const mode = e.target.dataset.mode;
      // if (!mode) return;
      // if (mode && stMode !== mode) {
      //   setMode(mode);
      //   input.click();
      // } else {
      //   input.click();
      // }
    }
  }

  const onKeyDown = (e: any) => {
    const { key } = e;

    if ((key === KEY_VALUES.ENTER || key === KEY_VALUES.SPACE) && !props.disabled) {
      input.click();
    }
  }

  const rendContext = () => {
    const { multiple, drag, config = { trigger: false, type: 'modal' }, disabled, acceptFileType, directory } = props;
    const wrapperClass = ClassNames("ap-fileupload-content-wrapper content-bottom", props.className, {
      // 'content-bottom': config.trigger || _postFiles.length,
      'content-inline': config.type !== 'modal',
    });
    const dirProps = directory ? { directory: 'directory', webkitdirectory: 'webkitdirectory' }
      : {};
    //dragable
    let pureContext =
      (<div
        ref={kodiv}
        className={wrapperClass}
      >
        {props.children ? props.children :
          <div className="ap-fileupload-content">
            <button className="ap-fileupload-drop-btn" type="button" onKeyDown={onKeyDown} onClick={handleClick}>
              <span className="ap-fileupload-drop-span">
                {`Drag and drop or `}
                <span className="ap-fileupload-drop-browse-span" data-mode="files">
                  {multiple ? 'choose files' : 'choose file'}
                </span>
              </span>
              <input
                type="file"
                accept={acceptFileType}
                className="upload-input"
                ref={fileInputRef}
                onChange={e => handleChange(e)}
                multiple={multiple}
                onClick={handleClick}
                tabIndex={-1}
                aria-hidden
                {...dirProps}
              />
            </button>
          </div>
        }
      </div>);

    if (drag) {
      pureContext = (
        <Dragger directory={directory} onDragUpload={uploadFiles}>{pureContext}</Dragger>
      );
    }
    return pureContext;
  }

  useImperativeHandle(ref, () => ({
    cancel,
    upload,
  }));

  return rendContext();
})

export default AjaxUpload;
