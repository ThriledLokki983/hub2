type UploadStatus =
    | 'uploading'
    | 'error'
    | 'deleted'
    | 'success'
    | 'ready';
export function getFileItem(file: { [x: string]: any; uid: any; type?: string; name?: string; size?: number; lastModifiedDate?: Date | undefined; status?: UploadStatus | undefined; percent?: number | undefined; originFile?: object | undefined; response?: any; error?: any; }, fileList: any[]) {
  if (file) {
    let key = file.uid !== undefined ? 'uid' : 'name';
    return fileList.filter(item => item[key] === file[key])[0];
  } else {
    return null;
  }
}

//file as fileModel
export function removeFile(file: { [x: string]: any; uid: any; type?: string; name?: string; size?: number; lastModifiedDate?: Date | undefined; status?: UploadStatus | undefined; percent?: number | undefined; originFile?: object | undefined; response?: any; error?: any; }, fileList: any[]) {
  const key = file.uid !== undefined ? 'uid' : 'name';
  const newFileList = fileList.filter(item => item[key] !== file[key]);
  if (newFileList.length === fileList.length) {
    return [];
  } else {
    return newFileList;
  }
}

let fileKey = 0;
export function generateUid() {
  fileKey = fileKey % 100;
  return `appkit-upload-${Date.now()}-${++fileKey}`;
}

export function dateFormat(timestamp: number): string {
  let dateString = '';
  if (timestamp) {
    let date = new Date(timestamp);
    let year = date.getFullYear();
    let day = date.getDate();

    const mm = date.getMonth();
    const arr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = arr[mm];
    dateString = month + ' ' + day + ',' + year;
  }
  return dateString;
}

export function getFileIcon(fileFullName: string): any {
  const flagIdx = fileFullName.lastIndexOf('.');
  const fileType = fileFullName.substring(flagIdx + 1);
  let iconType = 'file';
  if (fileType === 'pdf') {
      iconType = fileType;
  } else if (fileType === 'xlsx' || fileType === 'xls') {
      iconType = 'xls';
  } else if (fileType === 'docx' || fileType === 'doc') {
      iconType = 'doc';
  } else if (fileType === 'pptx' || fileType === 'ppt') {
      iconType = 'ppt';
  }

  const iconClass = 'ap-icon icon-file-fill a-MainUpload-file-type-icon Appkit4-icon icon-' + iconType + '-fill';
  return iconClass;
}

export function getSimpleName(fileFullName: string): string {
  const flagIdx = fileFullName.lastIndexOf('.');

  return fileFullName.substring(0, flagIdx);
}

export function getFormatFileSize(size: number) {
  const fileSizeMB = (size / 1024 / 1024).toFixed(1);
  const fileSizeKB = (size / 1024).toFixed(1);
  let fileSize;
  if (parseFloat(fileSizeMB) < 1) {
    fileSize = fileSizeKB + 'KB';
  } else {
    fileSize = fileSizeMB + 'MB';
  }

  return fileSize;
}

export function parseJson(obj: string){
  try {
    if (typeof obj === 'string') {
      obj = JSON.parse(obj);
    }
  } catch (e) {
    //then is not a json format
    //just calm down
  }finally{
    return obj;
  }
}

export function isEnter(e: { key: string; }) {
  return e.key === "Enter"
}


export function isSpace(e: { key: string; }) {
  return e.key === "Space"
}


export const getFilesAsync = async (dataTransfer: DataTransfer) => {

  const files = [];
  for (let i = 0; i < dataTransfer.items.length; i++) {
      const item = dataTransfer.items[i];
      if (item.kind === "file") {
          if (typeof item.webkitGetAsEntry === "function") {
              const entry:any = item.webkitGetAsEntry();
              if (entry.isDirectory) {
                const entryContent:any = await readEntryContentAsync(entry);
                files.push(...entryContent);
              } else {
                const file = item.getAsFile();
                if (file) {
                    files.push(file);
                }
              }
          }
      }
  }
  return files;
}

function readEntryContentAsync(entry: FileSystemEntry | null) {
  return new Promise((resolve, reject) => {
      let reading = 0;
      const contents: any = [];

      readEntry(entry);

      function readEntry(entry:any) {
          if (isFile(entry)) {
              reading++;
              entry.file((file: any) => {
                  reading--;
                  contents.push(file);

                  if (reading === 0) {
                      resolve(contents);
                  }
              });
          } else if (isDirectory(entry)) {
              readReaderContent(entry.createReader());
          }
      }

      function readReaderContent(reader: { readEntries: (arg0: (entries: any) => void) => void; }) {
          reading++;

          reader.readEntries(function (entries) {
              reading--;
              for (const entry of entries) {
                  readEntry(entry);
              }

              if (reading === 0) {
                  resolve(contents);
              }
          });
      }
  });
}

function isDirectory(entry: { isDirectory: any; }) {
  return entry.isDirectory;
}

function isFile(entry: { isFile: any; }) {
  return entry.isFile;
}


export const deepCopyFun = (data:any) => {
  if(typeof data !== 'object') return data;

  let obj:any = Array.isArray(data)?[]:{};

  for(let v in data){
    obj[v] = deepCopyFun(data[v]);
  }
  return obj;
}

