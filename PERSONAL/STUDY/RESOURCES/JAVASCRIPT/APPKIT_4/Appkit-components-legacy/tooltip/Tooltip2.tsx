// import * as React from 'react';
// import ReactDOM from 'react-dom';
// import ClassNames from "classnames";

// type elProps = {
//     offsetWidth?: Number,
//     getBoundingClientRect?: any,
//     offsetHeight?: Number
// }

// interface ITooltipProps {
//     className?: string,
//     active?: boolean,
//     style?: React.CSSProperties,
//     children?: React.ReactNode,
//     label?: string,
//     icon?: string,
//     target?: string | Array<string>,
//     position?: string,
//     showEvent?: string,
//     hideEvent?: string,
//     trigger?: string,
//     mouseEnterDelay?: number,
//     mouseLeaveDelay?: number,
//     hasArrow?: boolean,
//     autoHide?: boolean,
//     hasSwitch?: boolean,
//     getPopupContainer?: Function,
//     delayProp?: any,
//     distance?: number,
//     content?: string | Function,
//     clickToClose?: boolean
// }

// export interface TooltipProps extends React.HTMLAttributes<HTMLDivElement>,
//     ITooltipProps { }
// //<HTMLDivElement,TooltipProps>
// var allowHide: boolean;
// let visibleRef: boolean = false;
// // let scrollRef:any;
// const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>((props, ref) => {
//     const {
//         id,
//         style,
//         className,
//         children,
//         content,
//         target,
//         position = 'right',
//         showEvent = 'mouseenter',
//         hideEvent = 'mouseleave',
//         trigger = 'mouseenter',
//         hasArrow = false,
//         hasSwitch = true,
//         autoHide = true,
//         getPopupContainer,
//         distance = 8,
//         mouseEnterDelay = 0,
//         mouseLeaveDelay = 0,
//         clickToClose = true

//     } = props;
//     let toolRef: any = React.useRef(null);
//     let paddingRef: any = React.useRef(null);
//     // let visibleRef: any = React.useRef(false);
//     let scrollRef: any = React.useRef(null);
//     let currentTarget: any = null;
//     let mouseEnterDelayTimeout: NodeJS.Timeout;
//     let mouseLeaveDelayTimeout: NodeJS.Timeout;
//     const [visible, setvisible] = React.useState(false);
//     const [curposition, setposition] = React.useState(position);
//     // var allowHide: Boolean;
//     let childContent = null;

//     const isOutOfBounds = () => {
//         let { top, left, width, height } = toolRef.current.getBoundingClientRect();
//         let viewport = getViewport();
//         return (left + width > viewport.width) || (left < 0) || (top < 0) || (top + height > viewport.height);
//       }

//     //   const align = (target: any) => {
//     //     const pos: any = findCollisionPosition(curposition);
//     //     const my = pos.my;
//     //     const at = pos.at;
//     //     flipfitCollision(toolRef.current, target, my, at);
//     // }


//     const align = () => {

//         // if (!this.tooltip) {
//         //   return;
//         // }
//         // debugger
    
//         switch (position) {
//           case 'top-left':
//           case 'top-right':
//           case 'top':
//             alignTop();
//             if (isOutOfBounds()) {
//               alignBottom();
//               if (isOutOfBounds()) {
//                 alignRight();
    
//                 if (isOutOfBounds()) {
//                   alignLeft();
//                 }
//               }
//             }
//             break;
    
//           case 'bottom-left':
//           case 'bottom-right':
//           case 'bottom':
//            alignBottom();
//             if (isOutOfBounds()) {
//             alignTop();
//               if (isOutOfBounds()) {
//                 alignRight();
    
//                 if (isOutOfBounds()) {
//                   alignLeft();
//                 }
//               }
//             }
//             break;
    
//           case 'left-top':
//           case 'left-bottom':
//           case 'left':
//             alignLeft();
//             if (isOutOfBounds()) {
//               alignRight();
    
//               if (isOutOfBounds()) {
//                 alignTop();
    
//                 if (isOutOfBounds()) {
//                   alignBottom();
//                 }
//               }
//             }
//             break;
    
//           case 'right-top':
//           case 'right-bottom':
//           case 'right':
//             alignRight();
//             if (isOutOfBounds()) {
//               alignLeft();
    
//               if (isOutOfBounds()) {
//                 alignTop();
    
//                 if (isOutOfBounds()) {
//                   alignBottom();
//                 }
//               }
//             }
//             break;
//         }
    
//         // if (this.dark) {
//         //   this.tooltip.classList.add('dark');
//         // } else {
//         //   this.tooltip.classList.remove('dark');
//         // }
//       }
    
//       const alignTop = () => {
//         // let defaultClassName = 'ap-tooltip ap-tooltip-' + this.direction;
//         // this.tooltip.className = this.styleClass ? defaultClassName + ' ' + this.styleClass : defaultClassName;
        
//         const host = currentTarget.getBoundingClientRect();
//         const tooltip = toolRef.current.getBoundingClientRect();
//         let left = host.left + (host.width - tooltip.width) / 2;
//         switch (position) {
//           case 'top-left':
//               left = host.left;
//               break;
//           case 'top-right':
//               left = host.right - tooltip.width;
//               break;
//         }
//         let top = host.top - tooltip.height - distance;
//         toolRef.current.style.left = left + 'px';
//         toolRef.current.style.top = top + 'px';
    
//         if (isOutOfBounds()) {
//           left = host.left;
//           toolRef.current.style.left = left + 'px';
    
//           if (isOutOfBounds()) {
//             left = host.right - tooltip.width;
//             if (left < 0) left = 0;
//             toolRef.current.style.left = left + 'px';
//           }
//         }
//       }
    
//       const alignBottom = () => {
//         // let defaultClassName = 'ap-tooltip ap-tooltip-' + ;
//         // this.tooltip.className = this.styleClass ? defaultClassName + ' ' + this.styleClass : defaultClassName;
//         const host = currentTarget.getBoundingClientRect();
//         const tooltip = toolRef.current.getBoundingClientRect();
//         let left = host.left + (host.width - tooltip.width) / 2;
//         switch (position) {
//           case 'bottom-left':
//               left = host.left;
//               break;
//           case 'bottom-right':
//               left = host.right - tooltip.width;
//               break;
//         }
//         let top = host.bottom + position;
//         toolRef.current.style.left = left + 'px';
//         toolRef.current.style.top = top + 'px';
    
//         if (isOutOfBounds()) {
//           left = host.left;
//           toolRef.current.style.left = left + 'px';
    
//           if (isOutOfBounds()) {
//             left = host.right - tooltip.width;
//             if (left < 0) left = 0;
//             toolRef.current.style.left = left + 'px';
//           }
//         }
//       }
    
//       const alignRight = () => {
//         // let defaultClassName = 'ap-tooltip ap-tooltip-' + this.direction;
//         // this.tooltip.className = this.styleClass ? defaultClassName + ' ' + this.styleClass : defaultClassName;
//         const host = currentTarget.getBoundingClientRect();
//         const tooltip = toolRef.current.getBoundingClientRect();
//         let left = host.left + host.width + distance;
//         let top = host.top + (host.height - tooltip.height) / 2;
//         switch (position) {
//           case 'right-top': top = host.top; break;
//           case 'right-bottom': top = host.bottom - tooltip.height; break;
//         }
//         toolRef.current.style.left = left + 'px';
//         toolRef.current.style.top = top + 'px';
    
//         if (isOutOfBounds()) {
//           top = host.top;
//           toolRef.current.style.top = top + 'px';
    
//           if (isOutOfBounds()) {
//             top = host.bottom - tooltip.height;
//             if (top < 0) top = 0;
//             toolRef.current.style.top = top + 'px';
//           }
//         }
//       }
    
//       const alignLeft = () => {
//         // let defaultClassName = 'ap-tooltip ap-tooltip-' + this.direction;
//         // this.tooltip.className = this.styleClass ? defaultClassName + ' ' + this.styleClass : defaultClassName;
//         const host = currentTarget.getBoundingClientRect();
//         const tooltip = toolRef.current.getBoundingClientRect();
//         let left = host.left - tooltip.width - distance;
//         let top = host.top + (host.height - tooltip.height) / 2;
//         switch (position) {
//           case 'left-top':
//               top = host.top;
//               break;
//           case 'left-bottom':
//               top = host.bottom - tooltip.height;
//               break;
//         }
//         toolRef.currentstyle.left = left + 'px';
//         toolRef.current.style.top = top + 'px';
    
//         if (isOutOfBounds()) {
//           top = host.top;
//           toolRef.current.style.top = top + 'px';
    
//           if (isOutOfBounds()) {
//             top = host.bottom - tooltip.height;
//             if (top < 0) top = 0;
//             toolRef.current.style.top = top + 'px';
//           }
//         }
//       }
    
//     const getViewport = () => {
//         let win = window,
//           d = document,
//           e = d.documentElement,
//           g = d.getElementsByTagName('body')[0],
//           w = win.innerWidth || e.clientWidth || g.clientWidth,
//           h = win.innerHeight || e.clientHeight || g.clientHeight;
    
//         return { width: w, height: h };
//       }

      

//     const loadTargetEvents = () => {

//         if (getPopupContainer) {
//             let popupContainer = getPopupContainer();
//             if (popupContainer) {
//                 unTargetEvent(popupContainer);
//                 bindTargetEvent(popupContainer);
//                 return;
//             }
//         }

//         const setEvent = (target: string) => {
//             let element = Array.from(document.querySelectorAll(target));
//             element.forEach((el) => {
//                 unTargetEvent(el);
//                 bindTargetEvent(el);
//             });
//         }
//         // debugger

//         if (target instanceof Array) {
//             target.forEach(t => {
//                 setEvent(t);
//             });
//         }
//         else {
//             setEvent(target);
//         }
//     }



//     const unTargetEvent = (target: any) => {
//         let { showEvent, hideEvent } = getEvents();
//         if (target) {
//             const targetDom = target;
//             targetDom.removeEventListener(showEvent, show);
//             targetDom.removeEventListener(hideEvent, hide);
//         }
//     }
//     const getEvents = () => {
//         let showEvent: string = trigger;
//         let hideEvent: string = 'mouseleave';
//         if (showEvent === 'mouseenter') {
//             if (children) {
//                 showEvent = 'onMouseEnter';
//                 hideEvent = 'onMouseLeave';
//             } else {
//                 hideEvent = 'mouseleave';
//             }

//         } else if (showEvent === 'focus') {
//             if (children) {
//                 showEvent = 'onFocus';
//                 hideEvent = 'onBlur';
//             } else {
//                 hideEvent = 'blur';
//             }
//         } else if (showEvent === 'click') {

//             if (children) {
//                 showEvent = 'onClick';
//                 if (!clickToClose) {
//                     hideEvent = 'onBlur';
//                 } else {
//                     hideEvent = '';
//                 }
//             } else {
//                 if (!clickToClose) {
//                     hideEvent = 'blur';
//                 } else {
//                     hideEvent = '';
//                 }

//             }
//         } else if (showEvent === 'hover') {

//             if (children) {
//                 showEvent = 'onMouseEnter';
//                 hideEvent = 'onMouseLeave';
//             } else {
//                 showEvent = 'mouseenter';
//                 hideEvent = 'mouseleave';
//             }
//         }

//         return { showEvent, hideEvent };
//     }
//     const bindTargetEvent = (target: any) => {

//         let { showEvent, hideEvent } = getEvents();
//         if (target) {
//             const targetDom = target;
//             if (trigger === 'hover' || trigger === 'mouseenter') {
//                 targetDom.addEventListener('focus', (e: { pageX: any; currentTarget: any; }) => { show(e, 'focus') });
//                 targetDom.addEventListener('blur', (e: React.ReactNode,) => { hide(e, 'blur') });
//             }
//             targetDom.addEventListener(showEvent, (e: { pageX: any; currentTarget: any; },) => { show(e, showEvent) });
//             targetDom.addEventListener(hideEvent, (e: React.ReactNode,) => { hide(e, showEvent) });
//             return () => {
//                 targetDom.removeEventListener(showEvent, (e: { pageX: any; currentTarget: any; },) => { show(e, showEvent) });
//                 targetDom.removeEventListener(hideEvent, (e: React.ReactNode,) => { hide(e, showEvent) });
//                 targetDom.removeEventListener('focus', (e: { pageX: any; currentTarget: any; },) => { show(e, 'focus') });
//                 targetDom.removeEventListener('blur', (e: React.ReactNode,) => { hide(e, 'blur') });
//             };
//         }

//     }



//     const applyDelay = (delayProp: string, callback: () => void, triggerEvent: string | undefined) => {
//         clearTimeouts();
//         if ((trigger === 'mouseenter' || trigger === 'hover') && (!!mouseEnterDelay || !!mouseLeaveDelay)) {
//             //hover enter tab focus delete delay
//             if (triggerEvent === 'focus' || triggerEvent === 'blur') {
//                 callback();
//                 return;
//             }
//             if (delayProp === 'mouseEnterDelay') {
//                 mouseEnterDelayTimeout = setTimeout(() => callback(), mouseEnterDelay);
//             } else {
//                 mouseLeaveDelayTimeout = setTimeout(() => callback(), mouseLeaveDelay);
//             }
//         } else {
//             callback();
//         }
//     }
//     const clearTimeouts = () => {
//         clearTimeout(mouseEnterDelayTimeout);
//         clearTimeout(mouseLeaveDelayTimeout);
//     }

//     const show = (e?: { pageX: any; currentTarget: any; }, triggerEvent?: string | undefined) => {
//         currentTarget = e?.currentTarget;
//         scrollRef.current = () => { align() }
//         const updateTooltipState = () => {
//             toolRef.current && (toolRef.current.style.left = '');
//             toolRef.current && (toolRef.current.style.top = '');
//             align();
//             window.addEventListener('scroll', scrollRef.current);
//             window.addEventListener('resize', scrollRef.current);
//         }
//         if (children) {
//             if (trigger === 'click' && visible) {
//                 hide();
//                 return;
//             }
//         } else {
//             if (trigger === 'click' && visibleRef === true) {
//                 hide();
//                 return;
//             }
//         }
//         setTimeout(() => {
//             applyDelay('mouseEnterDelay', () => {
//                 setvisible(true);
//                 visibleRef = true;
//                 updateTooltipState();
//             }, triggerEvent)
//         })

//     }
//     const hide = (e?: {} | null | undefined, triggerEvent?: string | undefined) => {
//         clearTimeouts();
//         window.removeEventListener('scroll', scrollRef.current);
//         window.removeEventListener('resize', scrollRef.current);
//         scrollRef.current = null;
//         setTimeout(() => {
//             if (!autoHide && allowHide === false) {
//                 return;
//             }
//             applyDelay('mouseLeaveDelay', () => {
//                 setvisible(false);
//                 visibleRef = false;
//                 allowHide = true;
//             }, triggerEvent)
//         })

//     }




//     const findCollisionPosition = (position: string) => {
//         if (position) {
//             let upposition = position.substring(0, position.search(/(\-)/g)) || position;
//             const isAxisY = upposition === 'top' || upposition === 'bottom';
//             const myXPosition = upposition === 'left' ? 'right' : 'left';
//             const myYPosition = upposition === 'top' ? 'bottom' : 'top';

//             if (isAxisY) {
//                 return {
//                     axis: 'y',
//                     my: `center ${myYPosition}`,
//                     at: `center ${upposition}`,
//                 }
//             }

//             return {
//                 axis: 'x',
//                 my: `${myXPosition} center`,
//                 at: `${upposition} center`
//             }
//         }
//     }

//     // const getViewport = () => {
//     //     let win = window,
//     //         d = document,
//     //         e = d.documentElement,
//     //         g = d.getElementsByTagName('body')[0],
//     //         w = win.innerWidth || e.clientWidth || g.clientWidth,
//     //         h = win.innerHeight || e.clientHeight || g.clientHeight;

//     //     return { width: w, height: h };
//     // }

//     const getOuterWidth = (el: elProps) => {
//         if (el) {
//             let width = el.offsetWidth || el.getBoundingClientRect().width;

//             return width;
//         }
//         return 0;
//     }

//     const getOuterHeight = (el: elProps) => {
//         if (el) {
//             let height = el.offsetHeight || el.getBoundingClientRect().height;
//             return height;
//         }
//         return 0;
//     }
//     const getWindowScrollLeft = () => {
//         let doc = document.documentElement;
//         return (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
//     }

//     const getWindowScrollTop = () => {
//         let doc = document.documentElement;
//         return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
//     }

//     const flipfitCollision = (element: { style?: any; offsetWidth?: any; getBoundingClientRect?: (() => { (): any; new(): any; width: any; }) | (() => { (): any; new(): any; height: any; }); offsetHeight?: any; }, target: { getBoundingClientRect: any; offsetWidth?: any; offsetHeight?: any; }, my = 'left top', at = 'left bottom') => {
//         if (!element) return;
//         const targetOffset = target.getBoundingClientRect();
//         const viewport = getViewport();
//         const myArr = my.split(' ');
//         const atArr = at.split(' ');
//         const getPositionValue: any = (arr: string, isOffset: boolean) => (isOffset ? (+arr.substring(arr.search(/(\-)/g)) || 0) : (arr.substring(0, arr.search(/(\-)/g)) || arr));
//         const position = {
//             my: {
//                 x: getPositionValue(myArr[0]),
//                 y: getPositionValue(myArr[1] || myArr[0]),
//             },
//             at: {
//                 x: getPositionValue(atArr[0]),
//                 y: getPositionValue(atArr[1] || atArr[0]),
//             }
//         };
//         const myOffset = {
//             left: () => {
//                 return targetOffset.left + (position.my.x === 'left' ? 0 : -1 * (position.my.x === 'center' ? getOuterWidth(element) / 2 : getOuterWidth(element)));
//             },
//             top: () => {
//                 return targetOffset.top + (position.my.y === 'top' ? 0 : -1 * (position.my.y === 'center' ? getOuterHeight(element) / 2 : getOuterHeight(element)));
//             }
//         };
//         const alignWithAt: any = {
//             count: {
//                 x: 0,
//                 y: 0
//             },
//             left: function () {
//                 const left = myOffset.left();
//                 let doc = document.documentElement;
//                 const scrollLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
//                 element.style.left = (left + scrollLeft) + 'px';
//                 paddingRef.current && (paddingRef.current.style.margin = 0 + 'px');
//                 paddingRef.current && (paddingRef.current.style.marginRight = distance + 'px');
//                 if (!hasSwitch) return;
//                 if (this.count.x === 2) {
//                     element.style.left = scrollLeft + 'px';
//                     this.count.x = 0;
//                 }
//                 else if (left < 0) {
//                     this.count.x++;
//                     position.my.x = 'left';
//                     position.at.x = 'right';
//                     this.right();
//                 }
//             },
//             right: function () {
//                 const left = myOffset.left() + getOuterWidth(target);
//                 // const left = myOffset.left() + getOuterWidth(target) + 1 * distance;
//                 const scrollLeft = getWindowScrollLeft();
//                 element.style.left = (left + scrollLeft) + 'px';
//                 paddingRef.current && (paddingRef.current.style.margin = 0 + 'px');
//                 paddingRef.current && (paddingRef.current.style.marginLeft = distance + 'px');
//                 if (!hasSwitch) return;
//                 if (this.count.x === 2) {
//                     element.style.left = (viewport.width - getOuterWidth(element) + scrollLeft) + 'px';
//                     this.count.x = 0;
//                 }
//                 else if (left + getOuterWidth(element) > viewport.width) {
//                     this.count.x++;
//                     position.my.x = 'right';
//                     position.at.x = 'left';
//                     this.left();
//                 }
//             },
//             top: function () {
//                 const top = myOffset.top();
//                 const scrollTop = getWindowScrollTop();
//                 element.style.top = (top + scrollTop) + 'px';
//                 paddingRef.current && (paddingRef.current.style.margin = 0 + 'px');
//                 paddingRef.current && (paddingRef.current.style.marginBottom = distance + 'px');
//                 if (!hasSwitch) return;
//                 if (this.count.y === 2) {
//                     element.style.left = scrollTop + 'px';
//                     this.count.y = 0;
//                 }
//                 else if (top < 0) {
//                     this.count.y++;
//                     position.my.y = 'top';
//                     position.at.y = 'bottom';
//                     this.bottom();
//                 }
//             },
//             bottom: function () {
//                 const top = myOffset.top() + getOuterHeight(target);
//                 const scrollTop = getWindowScrollTop();
//                 element.style.top = (top + scrollTop) + 'px';
//                 paddingRef.current && (paddingRef.current.style.margin = 0 + 'px');
//                 paddingRef.current && (paddingRef.current.style.marginTop = distance + 'px');
//                 if (!hasSwitch) return;
//                 if (this.count.y === 2) {
//                     element.style.left = (viewport.height - getOuterHeight(element) + scrollTop) + 'px';
//                     this.count.y = 0;
//                 }
//                 else if (top + getOuterHeight(target) > viewport.height) {
//                     this.count.y++;
//                     position.my.y = 'bottom';
//                     position.at.y = 'top';
//                     this.top();
//                 }
//             },
//             center: function (axis: string) {
//                 if (axis === 'y') {
//                     let top = myOffset.top() + getOuterPosition(getOuterHeight(target), getOuterHeight(element));
//                     if (curposition.search(/(\-)/g) > 0) {
//                         const secondPosition = curposition.substring(curposition.search(/(\-)/g) + 1);
//                         if (secondPosition === 'top') {
//                             top = targetOffset.top;
//                         } else if (secondPosition === 'bottom') {
//                             top = targetOffset.bottom - 1 * getOuterHeight(element);
//                         } else {
//                             top = targetOffset.top;
//                         }
//                     } else {
//                         top = myOffset.top() + getOuterPosition(getOuterHeight(target), getOuterHeight(element));
//                     }
//                     element.style.top = (top + getWindowScrollTop()) + 'px';

//                     // if (top < 0) {
//                     //     this.bottom();
//                     // }
//                     // else if (top + getOuterHeight(target) > viewport.height) {
//                     //     this.top();
//                     // }
//                 }
//                 else {
//                     let left = myOffset.left() + getOuterPosition(getOuterWidth(target), getOuterWidth(element));
//                     if (curposition.search(/(\-)/g) > 0) {
//                         const secondPosition = curposition.substring(curposition.search(/(\-)/g) + 1);
//                         if (secondPosition === 'left') {
//                             left = targetOffset.left;
//                         } else if (secondPosition === 'right') {
//                             left = targetOffset.right - 1 * getOuterWidth(element);
//                         } else {
//                             left = targetOffset.left;
//                         }
//                     } else {
//                         left = myOffset.left() + getOuterPosition(getOuterWidth(target), getOuterWidth(element));
//                     }
//                     element.style.left = (left + getWindowScrollLeft()) + 'px';

//                     // if (left < 0) {
//                     //     this.left();
//                     // }
//                     // else if (left + getOuterWidth(element) > viewport.width) {
//                     //     this.right();
//                     // }
//                 }
//             }
//         };
//         alignWithAt[position.at.x]('x');
//         alignWithAt[position.at.y]('y');
//     }

//     const getOuterPosition = (outerVal: number, eleVal: number) => {
//         return outerVal / 2;
//     }


//     React.useEffect(() => {
//         let upposition = position.substring(0, position.search(/(\-)/g)) || position;
//         if (upposition === 'top') {
//             paddingRef.current && (paddingRef.current.style.marginBottom = distance + 'px');
//         } else if (upposition === 'bottom') {
//             paddingRef.current && (paddingRef.current.style.marginTop = distance + 'px');
//         } else if (upposition === 'left') {
//             paddingRef.current && (paddingRef.current.style.marginRight = distance + 'px');
//         } else if (upposition === 'right') {
//             paddingRef.current && (paddingRef.current.style.marginLeft = distance + 'px');
//         }
//         if (children) {
//             return
//         }
//         target && loadTargetEvents();


//     }, [])



//     const onMouseEnter = () => {
//         if (!autoHide) {
//             allowHide = false;
//         }
//     }

//     const onMouseLeave = () => {
//         allowHide = true;
//         if ((trigger === 'mouseenter' || trigger === 'hover')) {
//             if (!autoHide) {
//                 hide();
//             }
//         }

//     }

//     const blur = () => {
//         if ((trigger === 'click' || trigger === 'focus')) {
//             if (!autoHide) {
//                 setTimeout(() => {
//                     visibleRef = false;
//                     hide();
//                 })

//             }
//         }

//     }




//     const childContents = () => {
//         if (children) {
//             let { showEvent, hideEvent } = getEvents();
//             return React.Children.map(children, (child: any) => {
//                 if (!React.isValidElement(child) || !child.type) {
//                     return null;
//                 }
//                 if (trigger === 'hover' || trigger === 'mouseenter') {

//                     return React.cloneElement(child, {
//                         // @ts-ignore
//                         onFocus: (e: { pageX: any; currentTarget: any; }) => { show(e, 'focus') },
//                         onBlur: (e: React.ReactNode) => { hide(e, 'blur') },
//                         [showEvent]: show,
//                         [hideEvent]: hide
//                     });

//                 }
//                 return React.cloneElement(child, {
//                     [showEvent]: show,
//                     [hideEvent]: hide
//                 });
//             });
//         }
//         return null
//     }

//     const contentRender = () => {
//         if (typeof content === 'function') {
//             return content();
//         }

//         return content;
//     }


//     const renderElement = () => {
//         // curposition: 格式为 top-left top-right
//         // ap-tooltip-left-top
//         const tooltipClassName = ClassNames('ap-tooltip-react', {
//             [`ap-tooltip-${curposition}`]: curposition,
//             'show': visible,
//         }, className);
//         const reactContentClassName = ClassNames('ap-tooltip-reactContent', {
//             'show': visible,
//         });
//         return (
//             <div
//                 id={id}
//                 ref={toolRef}
//                 className={tooltipClassName}
//                 style={style}
//                 onMouseEnter={onMouseEnter}
//                 onMouseLeave={onMouseLeave}
//                 onBlur={blur}
//                 role="tooltip"
//                 aria-hidden={visible}
//                 tabIndex={visible ? 0 : -1}
//             >
//                 <div className={reactContentClassName} ref={paddingRef} >
//                     {hasArrow && <div className="tooltip-arrow"></div>}
//                     <div className="ap-tooltip-text">
//                         {contentRender()}
//                     </div>
//                 </div>

//             </div>
//         );
//     }
//     return (
//         <>
//             {childContents()}
//             {content && ReactDOM.createPortal(renderElement(), document.body)}
//         </>

//     );

//     return null


// })


// export default Tooltip;