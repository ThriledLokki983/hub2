import React from 'react';
import ClassNames from 'classnames';
import {
  getSimpleName,
  getFormatFileSize,
} from './utils';

import { FileModel } from './MainUpload';
import { KEY_VALUES } from '../../../configs/config';

interface dataProps {
  onRemove?: (file: FileModel) => void,
  retryUpload?: (file: FileModel) => void,
  showFullFileName?: boolean,
  fileListItemClassName?: string,
  files: any,
  multiple?: any,
  autoUpload?: boolean,
  config?: Object,
  errorMessage?: string
}

const UploadList: React.FC<dataProps> = (props: dataProps) => {

  const { config = {}, errorMessage = 'We have encountered unexpected problems.' }: any = props;

  const removeFile = (file: FileModel) => {
    const { onRemove } = props;
    if (onRemove) {
      file.status = 'deleted';
      onRemove(file);
    }
  };

  const retryUpload = (file: FileModel) => {
    const { retryUpload } = props;
    file.status = 'ready';
    retryUpload && retryUpload(file);
  }

  const cancelUploading = (file: FileModel) => {
    removeFile(file)
  }

  const getFileNameDiv = (file: any) => {
    return <span className="fileName" title={file.name}>{props.showFullFileName ? file.name : getSimpleName(file.name)}</span>
  }

  const handleDeleteKeyDown = (file: any, event: React.KeyboardEvent<HTMLButtonElement>) => {
    const { key } = event;
    if (key === KEY_VALUES.ENTER || key === KEY_VALUES.SPACE) {
      event.preventDefault();
      removeFile(file);
    }
  }


  const getProgressStyle = (item: FileModel) => {
    return { 'width': `${item.percent as number || 0}%` };
  }

  const renderErrorContext = (file: any, i: number) => {
    const loadClass = ClassNames("ap-fileupload-loaded", {
        'modal-loaded': config.type === 'modal'
      });
      const fillClass = ClassNames("Appkit4-icon icon-file-upload-outline upload-fail", {
        'color-dark': config.type === 'modal',
      });
      const fileNameClass = ClassNames("ap-fileupload-fileName upload-fail", {
        'color-dark': config.type === 'modal',
      });
      const fileSizeClass = ClassNames("ap-fileupload-fileSize", {
        'color-dark': config.type === 'modal',
      });

      return <div className="ap-fileupload-fileList" key={i}>
      <div className={loadClass} >
        {/* <span className={fillClass} aria-hidden="true"></span> */}
        <span aria-hidden="true">
          <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <title>Icon</title>
            <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g transform="translate(-632.000000, -612.000000)" id="Icon">
                <g transform="translate(632.000000, 612.000000)">
                  <rect id="Rectangle" transform="translate(12.000000, 12.000000) scale(-1, 1) translate(-12.000000, -12.000000) " x="0" y="0" width="24" height="24"></rect>
                  <path className="doc-text fail-color" d="M6,20 L14.3955244,20 L18.4480592,15.4927652 L18.4480592,4 L6,4 L6,20 Z M17.0528392,15.5913124 L14.5286494,18.672207 L14.5286494,15.5913124 L17.0528392,15.5913124 Z M17.5127258,4.93533334 L17.5127258,14.9014824 L13.5933161,14.9014824 L13.5933161,19.0646667 L6.93533334,19.0646667 L6.93533334,4.93533334 L17.5127258,4.93533334 Z" id="Shape" fill="#252525" fillRule="nonzero" transform="translate(12.224030, 12.000000) scale(-1, 1) rotate(-180.000000) translate(-12.224030, -12.000000) "></path>
                  <rect className="doc-text fail-color" id="Rectangle" fill="#252525" x="9" y="15" width="7" height="1"></rect>
                  <rect className="doc-text fail-color" id="Rectangle" fill="#252525" x="9" y="12" width="7" height="1"></rect>
                </g>
              </g>
            </g>
          </svg>
        </span>
        <span className="ap-fileupload-fileSpan">
          <span className={fileNameClass} >{getFileNameDiv(file)}</span>
        </span>
        {/* <button
          className="ap-fileupload-title-close"
          aria-label="delete"
          type="button">
          <span className="ap-icon icon-close-fill MainUpload-fail" onClick={() => removeFile(file)} onKeyDown={(e: any) => isEnter(e) && removeFile(file)} ></span>
        </button> */}
        <div className="ap-fileupload-progressbar upload-fail-progress" >
          <div className="ap-fileupload-progressbar-inside upload-fail-progress-inside" style={getProgressStyle(file)} ></div>
        </div>
      </div>
      <div className="ap-fileupload-error-message">
        {errorMessage} Please, <span role="button" onClick={() => retryUpload(file)}  >try again</span>.
      </div>
    </div>
  };

  const renderSuccessContext = (file: any, i: number) => {
    const cn = ClassNames("a-upload-success a-upload-file-list-item", props.fileListItemClassName);
    const loadClass = ClassNames("ap-fileupload-loaded", {
      'modal-loaded': config.type === 'modal'
    });
    const fillClass = ClassNames("Appkit4-icon icon-file-upload-outline", {
      'color-dark': config.type === 'modal',
      'upload-fail': config.type !== 'modal',
    });
    const fileNameClass = ClassNames("ap-fileupload-fileName", {
      'color-dark': config.type === 'modal',
    });
    const fileSizeClass = ClassNames("ap-fileupload-fileSize", {
      'color-dark': config.type === 'modal',
    });

      return <div className="ap-fileupload-fileList" key={i}>
      <div className={loadClass} >
        {/* <span className={fillClass} aria-hidden="true"></span> */}
        <span aria-hidden="true">
          <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <title>Icon</title>
            <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g transform="translate(-632.000000, -612.000000)" id="Icon">
                <g transform="translate(632.000000, 612.000000)">
                  <rect id="Rectangle" transform="translate(12.000000, 12.000000) scale(-1, 1) translate(-12.000000, -12.000000) " x="0" y="0" width="24" height="24"></rect>
                  <path className="doc-text" d="M6,20 L14.3955244,20 L18.4480592,15.4927652 L18.4480592,4 L6,4 L6,20 Z M17.0528392,15.5913124 L14.5286494,18.672207 L14.5286494,15.5913124 L17.0528392,15.5913124 Z M17.5127258,4.93533334 L17.5127258,14.9014824 L13.5933161,14.9014824 L13.5933161,19.0646667 L6.93533334,19.0646667 L6.93533334,4.93533334 L17.5127258,4.93533334 Z" id="Shape" fill="#252525" fillRule="nonzero" transform="translate(12.224030, 12.000000) scale(-1, 1) rotate(-180.000000) translate(-12.224030, -12.000000) "></path>
                  <rect className="doc-text" id="Rectangle" fill="#252525" x="9" y="15" width="7" height="1"></rect>
                  <rect className="doc-text" id="Rectangle" fill="#252525" x="9" y="12" width="7" height="1"></rect>
                </g>
              </g>
            </g>
          </svg>
        </span>
        <span className="ap-fileupload-fileSpan">
          <span className={fileNameClass} >{getFileNameDiv(file)}</span>
          <span className={fileSizeClass} >{config.size && `(${getFormatFileSize(file.size)})`}</span>
        </span>
        <span className="ap-fileupload-success">
          <span className="Appkit4-icon icon-circle-checkmark-outline"></span>
        </span>
        {/* <div className="ap-fileupload-progressbar" >
          <div className="ap-fileupload-progressbar-inside" ></div>
        </div> */}
      </div>
    </div>
  };

  const renderUploadingContext = (file: any, status: string, i: number) => {
      const loadClass = ClassNames("ap-fileupload-loaded", {
        'modal-loaded': config.type === 'modal'
      });
      const fillClass = ClassNames("Appkit4-icon icon-file-upload-outline", {
        'color-dark': config.type === 'modal',
        'upload-fail': config.type !== 'modal',
      });
      const fileNameClass = ClassNames("ap-fileupload-fileName", {
        'color-dark': config.type === 'modal',
      });
      const fileSizeClass = ClassNames("ap-fileupload-fileSize", {
        'color-dark': config.type === 'modal',
      });

      return <div className="ap-fileupload-fileList" key={i}>
      <div className={loadClass} >
        {/* <span className={fillClass} aria-hidden="true"></span> */}
        <span aria-hidden="true">
          <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <title>Icon</title>
            <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g transform="translate(-632.000000, -612.000000)" id="Icon">
                <g transform="translate(632.000000, 612.000000)">
                  <rect id="Rectangle" transform="translate(12.000000, 12.000000) scale(-1, 1) translate(-12.000000, -12.000000) " x="0" y="0" width="24" height="24"></rect>
                  <path className="doc-text" d="M6,20 L14.3955244,20 L18.4480592,15.4927652 L18.4480592,4 L6,4 L6,20 Z M17.0528392,15.5913124 L14.5286494,18.672207 L14.5286494,15.5913124 L17.0528392,15.5913124 Z M17.5127258,4.93533334 L17.5127258,14.9014824 L13.5933161,14.9014824 L13.5933161,19.0646667 L6.93533334,19.0646667 L6.93533334,4.93533334 L17.5127258,4.93533334 Z" id="Shape" fill="#252525" fillRule="nonzero" transform="translate(12.224030, 12.000000) scale(-1, 1) rotate(-180.000000) translate(-12.224030, -12.000000) "></path>
                  <rect className="doc-text" id="Rectangle" fill="#252525" x="9" y="15" width="7" height="1"></rect>
                  <rect className="doc-text" id="Rectangle" fill="#252525" x="9" y="12" width="7" height="1"></rect>
                </g>
              </g>
            </g>
          </svg>
        </span>
        <span className="ap-fileupload-fileSpan">
          <span className={fileNameClass} >{getFileNameDiv(file)}</span>
          <span className={fileSizeClass} >{config.size && `(${getFormatFileSize(file.size)})`}</span>
        </span>
        {status === 'ready' && !props.autoUpload && (
          <button
            type="button"
            className="Appkit4-icon ap-fileupload-title-close"
            aria-label={`delete ${file.name}`}
            onClick={() => removeFile(file)}
            onKeyDown={event => handleDeleteKeyDown(file, event)}
          >
            <span className="Appkit4-icon icon-close-outline"></span>
          </button>
        )}
        {status === 'uploading' && <span className="ap-fileupload-percentage">{file.percent || 0}%</span>}
        {
          status === 'uploading' && <div className="ap-fileupload-progressbar" >
            <div className="ap-fileupload-progressbar-inside" style={getProgressStyle(file)} ></div>
          </div>
        }

      </div>
    </div>
  };

  const { files = [] } = props;
  const classes = ClassNames("ap-fileupload-fileLists", {
    "multiple": props.multiple
  });

    const list = files.map((file: { status: any; }, i: number) => {
    const status = file.status;
    if (status === 'ready') {
      return renderUploadingContext(file, status, i);
    } else if (status === 'uploading') {
      return renderUploadingContext(file, status, i);
    } else if (status === 'error') {
      return renderErrorContext(file, i);
    } else if (status === 'success') {
      return renderSuccessContext(file, i);
    }
  });
  return <div className={classes}>{list}</div>;
}


export default UploadList;
