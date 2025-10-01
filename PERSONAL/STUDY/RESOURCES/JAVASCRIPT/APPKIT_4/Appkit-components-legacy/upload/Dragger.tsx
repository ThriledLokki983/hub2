//@flow
import React from 'react';
import { getFilesAsync } from './utils';

type DraggerProps = {
  children: React.ReactNode,
  onDragUpload: Function,
  directory?: Boolean
};


const Dragger: React.FC<DraggerProps> = (props: DraggerProps) => {

  const onFileDrop = async (e: React.DragEvent<HTMLDivElement>): Promise<void> => {
    e.preventDefault && e.preventDefault();
    let files = [];
    if (e.type === 'drop') {
      if (props.directory) {
        files = await getFilesAsync(e.dataTransfer);
      } else {
        files = Array.prototype.slice.call(e.dataTransfer.files);
      }
      props.onDragUpload(files);
    }

  };

  return (
    <div
      className="a-upload-drag-zone"
      onDrop={e => onFileDrop(e)}
      onDragOver={e => onFileDrop(e)}
      onDragLeave={e => onFileDrop(e)}
    >
      {props.children}
    </div>
  );
}


export default Dragger;
