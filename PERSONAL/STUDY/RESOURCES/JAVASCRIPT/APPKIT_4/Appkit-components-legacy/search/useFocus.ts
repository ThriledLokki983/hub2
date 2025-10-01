// import * as React from "react";
// import { useEffect } from 'react';
// import { KEY_VALUES } from '../utils';


// function useFocus() {

//     useEffect(() => {
//         const eventHandler = (event: KeyboardEvent) => {
//             const { key } = event;
 
//             if (KEY_VALUES.TAB === key) {
//                 setKeyboardFocus(true);
//             }
//         }

//         const eventClickHandler = (event: MouseEvent) => {
//             const ele = (containerRef.current! as HTMLElement).querySelector('.ap-search-input');
//             setKeyboardFocus(false);
//         }

//         window.addEventListener('keydown', eventHandler);
//         window.addEventListener('click', eventClickHandler);

//         return () => {
//             window.removeEventListener('keydown', eventHandler);
//             window.removeEventListener('click', eventClickHandler);
//         };
//     });

