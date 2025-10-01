// import * as React from "react";
// import classNames from 'classnames';

// import { createToast } from './ToastInstall'

// const getPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
//     if (customizePrefixCls) {
//         return customizePrefixCls;
//     }

//     return suffixCls ? `ap-${suffixCls}` : 'appkit4';
// };


// const statuses: any = {
//     error: {
//         cx: "icon-error-fill",
//         label: "x-circle"
//     },
//     warning: {
//         cx: "icon-warning-fill",
//         label: "exclamationIcon",
//     },
//     success: {
//         cx: "icon-success-fill",
//         label: "check-circle",
//     },
//     default: {
//         cx: "icon-calendar-outline",
//         label: "check-circle",
//     }
// };

// type OmittedTypes = "message";



// interface IToast {
//     /**
//      * The title of the toast.
//      */
//     title?: string;
//     /**
//      * If `true` adds a close button to the toast.
//      */
//     closeable?: boolean;
//     /**
//      * Callback function to close the toast.
//      */
//     onClose?: () => void;
//     /**
//      * Callback function to undo the toast.
//      */
//     onUndo?: () => void;
//     /**
//      * The description of the toast
//      */
//     description?: string;
//     /**
//      * The undo text of the toast
//      */
//     undoText?: string;
//     /**
//      * Duration before dismiss in milliseconds, or `null` to never dismiss.
//      */
//     duration?: number | null;
//     /**
//      * One of toasted-notes positions.
//      */
//     position?: string;
//     /**
//      * The message of the toast
//      */
//     message?: string;
//     /**
//      * The status of the toast
//      */
//     status?: "info" | "success" | "error" | "warning" | "default";
//     /**
//      * Custom icon
//      */
//     icon?: React.ElementType;
//     /**
//      * Custom close icon
//      */
//     closeIcon?: React.ElementType;

//     customizePrefixCls?: string;

//     className?: string;
//     hyperLink?: string;
//     type?: string;
//     showTimed?: boolean
// }


// interface RenderOption {
//     render?: (props: {
//         onClose: (id: string) => void;
//         id: string;
//     }) => React.ReactNode;
// }
// type useToastOptions = IToast & RenderOption;


// export interface NotificationProps
//     extends Omit<useToastOptions, OmittedTypes> { }

// export const Notification = React.forwardRef<HTMLDivElement, NotificationProps>(
//     (props, ref) => {
//         const {
//             title,
//             description,
//             className,
//             status = "",
//             onClose,
//             icon: customIcon,
//             closeIcon: customCloseIcon,
//             closeable = true,
//             customizePrefixCls,
//             hyperLink,
//             type = 'Alert',
//             duration = 4000,
//             showTimed = false
//         } = props;

//         const prefixCls = getPrefixCls('notification', customizePrefixCls);

//         const circleRef: any = React.useRef();
//         let circlePos: number;
//         let curtimer: NodeJS.Timer;
//         console.log('circleRef==55=', duration, circleRef)
//         React.useEffect(() => {
//             const dismiss: any = duration;
//             const l = Math.ceil(6 * 2 * 3.14);
//             const timelen = Math.floor(dismiss / l / 10);
//             circlePos = l * 2;
//             let circleLength = circlePos, start = new Date().getTime();
//             curtimer = setInterval(() => {
//                 let current = new Date().getTime();
//                 circlePos = circleLength - Math.ceil((current - start) / timelen) * 0.1;
//                 if (circlePos <= l) {
//                     circlePos = l;
//                     clearInterval(curtimer);
//                     return;
//                 }
//                 if (!circleRef.current) {
//                     return;
//                 }
//                 circleRef.current.style.strokeDashoffset = circlePos;
//             }, timelen);
//         }, [])
//         const { cx, label } = statuses[status] || {};
//         let closeCode;
//         if (showTimed) {
//             closeCode = <div className="a-countdown-wrapper">
//                 <svg height="24" width="24">
//                     <circle className="a-circle a-countdown animated" ref={circleRef} cx="12" cy="12" r="6"  ></circle>
//                 </svg>
//             </div>;
//         } else {
//             closeCode = <span className="Appkit4-icon icon-close-outline height ap-font-medium"></span>;
//         }
//         return <div ref={ref} className={classNames(prefixCls, className, {
//             'Global': type === 'Global',
//             [status]: true
//         })}>
//             {(type === 'Alert' && (cx || customIcon)) && (
//                 <span className={classNames(`${prefixCls}-icon`, status && `${prefixCls}-icon-${status}`)}>
//                     {customIcon ? (
//                         customIcon
//                     ) : (
//                         // <Icon label={label} as={customIcon || icon} className="w-5 h-5" />
//                         <span className={classNames('Appkit4-icon', cx)}></span>
//                     )}
//                 </span>
//             )}
//             {(type === 'Global') && (
//                 <span className={classNames(`${prefixCls}-icon`, 'Appkit4-icon icon-error-fill')}>
//                 </span>
//             )}

//             {
//                 type === 'Alert' ? <div className={`${prefixCls}-content`}>
//                     <span className={`${prefixCls}-content-title`}>{title}</span>
//                     <span className={`${prefixCls}-content-description`}>
//                         {description}
//                     </span>
//                     <a className="ap-notification-hyperlink ap-link height" tabIndex={0} role="link">{hyperLink}</a>
//                 </div> : <div className={`${prefixCls}-content`}>
//                     <span className={`${prefixCls}-content-description`}>
//                         {description}
//                     </span>
//                 </div>
//             }

//             {/* {onUndo && (
//             <Button
//                 // variant="link"
//                 color="primary"
//                 className={`${prefixCls}-action-undo`}
//                 onClick={() => {
//                     onUndo();
//                 }}
//             >
//                 {undoText}
//             </Button>
//         )} */}


//             {closeable && (
//                 <button
//                     onClick={onClose}
//                     className={`${prefixCls}-close-button`}
//                 >
//                     {customCloseIcon ? (
//                         customCloseIcon
//                     ) : (
//                         closeCode

//                     )}
//                 </button>
//             )}

//         </div>;
//     }
// );



// Notification.displayName = "Notification";

// export const useNotification = createToast(Notification);



