<h2 class="appkit-anchor">MainUpload</h2>

MainUpload file by selecting or dragging.  
Our implementation is based on [flowjs/flow.js](https://github.com/flowjs/flow.js) `v2.13.1`, a JavaScript library providing multiple simultaneous, stable, fault-tolerant and resumable/restartable file uploads via the HTML5 File API.

<h5>Please use MainUpload via `appkit-react-upload` package.</h5>
<h2 class="appkit-anchor">Table of contents</h2>

<ol class="number-list">
  <li><a href="#Features">Features</a></li>
  <li><a href="#How-to-use">How to use</a></li>
  <li><a href="#Props">Props</a></li>
  <li><a href="#Callback_Events">Callback Method</a></li>
  <li><a href="#Events">Methods</a></li>
  <li><a href="#third-party">Use a Different MainUpload Library</a></li>
</ol>

<h2 class="appkit-anchor" data-hash="#Features">Features</h2>
<ol class="number-list">
  <li>For simple file uploads, the user can select the file/files either using file explorer or drag & drop.</li>
  <li>For manual file uploads which requires a trigger, just add an action button.</li>
</ol>
<h2 class="appkit-anchor" data-hash="#How-to-use">How to use</h2>

<b>First of all, please follow Setting JFrog Artifactory section in [getting start page](${URL_PREFIX}?selectedKind=Introduction&selectedStory=Getting%20started&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybooks%2Fstorybook-addon-knobs) to set up environment on your local machine successfully.</b> And then, run below command to install appkit-react-upload.

```
# Install
$ npm install appkit-react appkit-react-upload --registry https://artifacts.pwc.com/artifactory/api/npm/us-adv-digital-npm/
```

<b>Import upload module</b>

```js
// Import CSS
import "appkit-react/style/appkit-react.default.css";
// Import MainUpload component
import { MainUpload } from "appkit-react-upload";
```

Please refer to `README` tab to check sample code.

<h2 class="appkit-anchor" data-hash="#Props">Props</h2>

| Property              | Description                                                                                                                                                                                          | Type                         | Default   | Required |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | --------- | -------- |
| style                 | Customize style.                                                                                                                                                                                     | `object`                     | -         | `No`     |
| className             | Customize class.                                                                                                                                                                                     | `string`                     | -         | `No`     |
| fileListItemClassName | Customize class for file-list-item                                                                                                                                                                   | `string`                     | -         | `No`     |
| color                 | Color                                                                                                                                                                                                | `string: default\|white`     | `default` | `No`     |
| accept()              | a array filter function that decide which files will be allowed to upload                                                                                                                            | `([fileObj])`=>`([fileObj])` | -         | `No`     |
| acceptFileType        | The accept attribute value is a string that defines the file types the file input should accept. The file type of this property should be consistent with the `accept`. Please refer to [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#htmlattrdefaccept) for more infomation. | `string`                     | -         | `No`     |
| disabled              | Disable upload.                                                                                                                                                                                      | `boolean`                    | `false`   | `No`     |
| multiple              | Whether to support selected multiple file.                                                                                                       
| directory              | Support upload whole directory file.                                                                                                                                                        | `boolean`                    | `false`   | `No`     |
| showFileList          | Whether to show file list.                                                                                                                                                                           | `boolean`                    | `true`    | `No`     |
| drag                  | Whether to support dragging upload.                                                                                                                                                                  | `boolean`                    | `true`    | `No`     |
| autoUpload            | Whether to upload automatically or manually                                                                                                                                                          | `boolean`                    | `true`    | `No`     |
| showFullFileName      | Whether to show full file name with extension                                                                                                                                                        | `boolean`                    | `false`   | `No`     |
| action                | Uploading url.                                                                                                                                                                                       | `string`                     | -         | `Yes`    |
| data                  | Other data object to post.                                                                                                                                                                           | `object`                     | -         | `No`     |
| headers               | Request header.                                                                                                                                                                                      | `object`                     | -         | `No`     |
| withCredentials       | The same as `XMLHttpRequest.withCredentials`. whether or not cross-site Access-Control requests should be made using credentials such as cookies, authorization headers or TLS client certificates   | `boolean`                    | `false`   | `No`     |
| extraPropToFlowjs     | Extra prop passed to flowjs. Please refer to [flowjs/flow.js](https://github.com/flowjs/flow.js)                                                                                                     | `object`                     | -         | `No`     |

<h2 class="appkit-anchor" data-hash="#Callback_Events">Callback Method</h2>

| Method       | Description                                                                                                                  | Function                                                                                                | Required |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------- |
| beforeUpload | The function which will be executed before uploading. Uploading will be cancelled with false or a rejected Promise returned. | (file: <a href="#parameters">FileObj</a>) => `boolean or Promise`                                       | `No`     |
| onChange     | The callback function will be executed when uploading state(select file, remove file, success or fail) is changing.          | (file: <a href="#parameters">FileObj</a>, fileList: Array<<a href="#parameters">FileObj</a>>) => `void` | `No`     |
| onProgress   | The callback function will be executed when file is uploading.                                                               | (file: <a href="#parameters">FileObj</a>) => `void`                                                     | `No`     |
| onError      | The callback function will be executed when uploading is failed.                                                             | (file: <a href="#parameters">FileObj</a>) => `void`                                                     | `No`     |
| onSuccess    | The callback function will be executed when file is uploaded successfully.                                                   | (file: <a href="#parameters">FileObj</a>) => `void`                                                     | `No`     |
| onRemove     | The callback function will be executed when removing file button is clicked.                                                 | (file: <a href="#parameters">FileObj</a>, fileList: Array<<a href="#parameters">FileObj</a>>) => `void` | `No`     |

<h2 class="appkit-anchor" data-hash="#Events">Methods</h2>

| Method   | Description                                                          |
| -------- | -------------------------------------------------------------------- |
| submit() | When `autoUpload` is false, use it to manually trigger all uploading |
| cancel() | manually cancel all uploading files                                  |

<h3 class="appkit-anchor" data-hash="#parameters">Parameter type</h3>

##### FileObj:

```js
  {
    uid: string,
    type: string,
    name: string,
    size: number,
    lastModifiedDate: Date,
    status: 'ready' or 'uploading' or 'error' or 'deleted' or 'success',
    percent: number,
    originFile: File,
    response: any,
    error: any
  }

```

<h2 class="appkit-anchor" data-hash="#third-party">Use a Different MainUpload Library</h2>

If you want to use different upload library other than [flowjs/flow.js](https://github.com/flowjs/flow.js). You need to implement the following api in order to work.

| Property       | Description                                       | Type   | Required |
| -------------- | ------------------------------------------------- | ------ | -------- |
| externalUpload | a function to start third party library uploading | `func` | `Yes`    |
| externalCancel | a function to cancel uploading                    | `func` | `Yes`    |

User need to call the following API to update UI

| Method     | Description                       | Function                                                             | Required |
| ---------- | --------------------------------- | -------------------------------------------------------------------- | -------- |
| onProgress | notify MainUpload the upload progress | (percent: number, file: <a href="#parameters">FileObj</a>) => `void` | `Yes`    |
| onError    | notify MainUpload to show the error   | (error: Error, file: <a href="#parameters">FileObj</a>) => `void`    | `Yes`    |
| onSuccess  | notify MainUpload the upload is done  | (response: any, file: <a href="#parameters">FileObj</a>) => `void`   | `Yes`    |

Please check the sample code to see how to use.
