// import React, { useEffect } from 'react';
// import ReactDOM from 'react-dom';
// import { Modal } from './Modal';

// type ModalInstallProps = {
//   onCancel?: Function,
//   children?: React.ReactNode
// };

// /**
//  * ModalInstaller will setup the modal under <body/>.
//  * We use new portal API, which is a new feature after react 16, to append the modal in body
//  * refer to: 1. https://reactjs.org/docs/portals.html
//  *           2. https://codepen.io/gaearon/pen/yzMaBd
//  */
// const ModalInstaller: React.FC = (props: ModalInstallProps) => {
//   const { onCancel, children, ...otherProps } = props;

//   const cnode: HTMLDivElement = document.createElement('div');

//   useEffect(() => {
//     document.body && document.body.appendChild(cnode);
//     return () => {
//       document.body && document.body.removeChild(cnode);
//     }
//   })
//   return ReactDOM.createPortal(
//     <Modal onCancel={onCancel} {...otherProps}>
//       {children}
//     </Modal>,
//     cnode
//   );
// }

// export default ModalInstaller;

export {};
