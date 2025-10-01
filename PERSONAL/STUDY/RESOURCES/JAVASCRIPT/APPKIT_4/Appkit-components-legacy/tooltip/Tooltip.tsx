import * as React from 'react';
// import ReactDOM from 'react-dom';
import ClassNames from "classnames";

import { align } from '../utils/positionElement';
import ReactDOMType from '../utils/reactRequire';
// var ReactDOM: any;
// try {
//     ReactDOM = require('react-dom/client');
// } catch (error) {
//     ReactDOM = require('react-dom');
// }

type elProps = {
    offsetWidth?: Number,
    getBoundingClientRect?: any,
    offsetHeight?: Number
}

interface ITooltipProps {
    className?: string,
    active?: boolean,
    style?: React.CSSProperties,
    children?: string | React.ReactNode,
    label?: string,
    icon?: string,
    target?: string | Array<string>,
    position?: string,
    showEvent?: string,
    hideEvent?: string,
    trigger?: string,
    mouseEnterDelay?: number,
    mouseLeaveDelay?: number,
    hasArrow?: boolean,
    autoHide?: boolean,
    hasSwitch?: boolean,
    getPopupContainer?: Function,
    delayProp?: any,
    distance?: number,
    content?: string | Function,
    clickToClose?: boolean,
    hideTooltipOnBlur?: boolean,
    autoAdjust?: boolean
}

export interface TooltipProps extends React.HTMLAttributes<HTMLDivElement>,
    ITooltipProps { }
//<HTMLDivElement,TooltipProps>
var allowHide: boolean;

// let scrollRef:any;
const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>((props, ref) => {
    const {
        style = {},
        className,
        children,
        target = '',
        position = 'right',
        showEvent = 'mouseenter',
        hideEvent = 'mouseleave',
        trigger = 'hover',
        hasSwitch = true,
        getPopupContainer,
        distance = 8,
        mouseEnterDelay = 0,
        mouseLeaveDelay = 0,
        content,
        autoAdjust = true,
        id = new Date().getTime().toString(),
        hideTooltipOnBlur = true
    } = props;
    let toolRef: any = React.useRef(null);
    let paddingRef: any = React.useRef(null);
    let scrollRef: any = React.useRef(null);
    let currentTarget: any = null;
    let visibleRef: boolean = false;
    let mouseEnterDelayTimeout: NodeJS.Timeout;
    let mouseLeaveDelayTimeout: NodeJS.Timeout;
    const [visible, setvisible] = React.useState(false);
    const [curposition, setposition] = React.useState(position);
    // var allowHide: Boolean;
    var newDIV: any;
    const loadTargetEvents = () => {

        if (getPopupContainer) {
            let popupContainer = getPopupContainer();
            if (popupContainer) {
                unTargetEvent(popupContainer);
                bindTargetEvent(popupContainer);
                return;
            }
        }

        const setEvent = (target: string) => {
            let element = Array.from(document.querySelectorAll(target));
            element.forEach((el) => {
                unTargetEvent(el);
                bindTargetEvent(el);
            });
        }

        if (target instanceof Array) {
            target.forEach(t => {
                setEvent(t);
            });
        }
        else {
            setEvent(target);
        }
    }



    const unTargetEvent = (target: any) => {
        let { showEvent, hideEvent } = getEvents();
        if (target) {
            const targetDom = target;
            targetDom.removeEventListener(showEvent, show);
            targetDom.removeEventListener(hideEvent, hide);
            targetDom.removeEventListener('focus', show);
            targetDom.removeEventListener('blur', hide);
            targetDom.removeEventListener('keyDown', (e: React.ReactNode,) => { handleKeyDown(e) });
        }
    }
    const getEvents = () => {
        let showEvent: string = trigger;
        let hideEvent: string = 'mouseleave';
        // if (showEvent === 'focus') {
        //     if (children) {
        //         showEvent = 'onFocus';
        //         hideEvent = 'onBlur';
        //     } else {
        //         hideEvent = 'blur';
        //     }
        // } else 
        if (showEvent === 'click') {
            if (children) {
                showEvent = 'onClick';
                if (hideTooltipOnBlur) {
                    hideEvent = 'onBlur';
                } else {
                    hideEvent = 'datakey';
                }
            } else {
                if (hideTooltipOnBlur) {
                    hideEvent = 'blur';
                } else {
                    hideEvent = '';
                }
            }
        } else if (showEvent === 'hover') {

            if (children) {
                showEvent = 'onMouseEnter';
                hideEvent = 'onMouseLeave';
            } else {
                showEvent = 'mouseenter';
                hideEvent = 'mouseleave';
            }
        }

        return { showEvent, hideEvent };
    }
    const bindTargetEvent = (target: any) => {

        let { showEvent, hideEvent } = getEvents();
        if (target) {
            const targetDom = target;
            if (trigger === 'hover') {
                targetDom.addEventListener('focus', show);
                if (hideTooltipOnBlur) {
                    targetDom.addEventListener('blur', hide);
                }

            }

            if (trigger === 'click') {
                targetDom.addEventListener('keydown', (e: { pageX: any; currentTarget: any; }) => { handleKeyDown(e) });
            }

            targetDom.addEventListener(showEvent, show);
            targetDom.addEventListener(hideEvent, hide);
        }

    }

    const handleKeyDown = (event: any) => {
        if (trigger === 'click' && (event.keyCode === 13 || event.keyCode === 32)) {
            event.preventDefault();
            if (children) {
                if (!visible) {
                    show(event);
                } else {
                    allowHide = true;
                    hide();
                }
            } else {
                if (!visibleRef) {
                    show(event);
                } else {
                    allowHide = true;
                    hide();
                }
            }

        }
    }



    const applyDelay = (delayProp: string, callback: () => void) => {
        clearTimeouts();
        if ((trigger === 'hover') && (!!mouseEnterDelay || !!mouseLeaveDelay)) {
            //hover enter tab focus delete delay
            // if (triggerEvent === 'focus' || triggerEvent === 'blur') {
            //     callback();
            //     return;
            // }
            if (delayProp === 'mouseEnterDelay') {
                mouseEnterDelayTimeout = setTimeout(() => callback(), mouseEnterDelay);
            } else {
                mouseLeaveDelayTimeout = setTimeout(() => callback(), mouseLeaveDelay);
            }
        } else {
            callback();
        }
    }
    const clearTimeouts = () => {
        clearTimeout(mouseEnterDelayTimeout);
        clearTimeout(mouseLeaveDelayTimeout);
    }

    const createTooltip = () => {
        newDIV = document.createElement('div');
        document.body.appendChild(newDIV);
        ReactDOMType(newDIV, renderElement());
        // if (ReactDOM.createRoot) {
        //     ReactDOM.createRoot(newDIV).render(renderElement());
        // } else {
        //     ReactDOM.render(renderElement(), newDIV);
        // }
        // ReactDOM.render(renderElement(), newDIV);

    }
    const removeTooltip = () => {
        if (!newDIV) return;
        setTimeout(() => {
            document.body && document.body.removeChild(newDIV);
            toolRef.current = null;
        }, 5)

    }
    const show = (e?: { pageX: any; currentTarget: any; }) => {
        if (toolRef.current) toolRef.current.style.display = 'block';
        clearTimeouts();
        currentTarget = e?.currentTarget;
        scrollRef.current = () => {
            hide();
            // removeTooltip();
            if (toolRef.current) toolRef.current.style.display = 'none';

        }
        window.addEventListener('scroll', scrollRef.current);
        window.addEventListener('resize', scrollRef.current);
        const updateTooltipState = () => {
            let upposition = position.substring(0, position.search(/(\-)/g)) || position;
            if (toolRef.current) toolRef.current.style.padding = 0;
            if (upposition === 'top') {
                toolRef.current && (toolRef.current.style.paddingBottom = distance + 'px');
            } else if (upposition === 'bottom') {
                toolRef.current && (toolRef.current.style.paddingTop = distance + 'px');
            } else if (upposition === 'left') {
                toolRef.current && (toolRef.current.style.paddingRight = distance + 'px');
            } else if (upposition === 'right') {
                toolRef.current && (toolRef.current.style.paddingLeft = distance + 'px');
            }
            let toolTipElement = toolRef.current;
            toolRef.current && (toolRef.current.style.left = '');
            toolRef.current && (toolRef.current.style.top = '');
            const tooltip = paddingRef.current.getBoundingClientRect();
            if (tooltip.height > 32 && paddingRef.current) {
                paddingRef.current.style.setProperty('padding', '0.5rem 0.625rem');
            }
            align(currentTarget, toolTipElement, position, autoAdjust, distance, true);
        }
        allowHide = true;
        // console.log('visible===', visibleRef)
        // if (trigger === 'click' && visibleRef) {
        //     hide();
        //     return;
        // }
        if (children) {
            if (trigger === 'click' && visible) {
                hide();
                return;
            }
        } else {
            if (trigger === 'click' && visibleRef === true) {
                hide();
                return;
            }
        }

        setTimeout(() => {
            applyDelay('mouseEnterDelay', () => {
                if (!toolRef.current) createTooltip();
                setTimeout(() => {
                    setvisible(true);
                    visibleRef = true;
                    updateTooltipState();

                    toolRef.current?.classList.add('show');
                    paddingRef.current?.classList.add('show');
                })



            })
        })

    }
    const hide = (e?: {} | null | undefined) => {
        // console.log('zouldmHidee', scrollRef.current, toolRef.current)
        clearTimeouts();
        window.removeEventListener('scroll', scrollRef.current);
        window.removeEventListener('resize', scrollRef.current);
        setTimeout(() => {
            if (!hideTooltipOnBlur && allowHide === false) {
                return;
            }
            applyDelay('mouseLeaveDelay', () => {
                setvisible(false);
                visibleRef = false;
                allowHide = true;
                toolRef.current?.classList.remove('show');
                paddingRef.current?.classList.remove('show');
            })
        })

    }



    const getViewport = () => {
        let win = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            w = win.innerWidth || e.clientWidth || g.clientWidth,
            h = win.innerHeight || e.clientHeight || g.clientHeight;

        return { width: w, height: h };
    }

    // const flipfitCollision = (element: { style?: any; offsetWidth?: any; getBoundingClientRect?: (() => { (): any; new(): any; width: any; }) | (() => { (): any; new(): any; height: any; }); offsetHeight?: any; }, target: { getBoundingClientRect: any; offsetWidth?: any; offsetHeight?: any; }, my = 'left top', at = 'left bottom') => {
    const isOutOfBounds = (element: any) => {
        let { top, left, width, height } = element.getBoundingClientRect();
        let viewport = getViewport();
        return (left + width > viewport.width) || (left < 0) || (top < 0) || (top + height > viewport.height);
    }

    const align2 = (target: any, element: any, position: string) => {
        if (!element || !target) return;
        switch (position) {
            case 'top-left':
            case 'top-right':
            case 'top':
                alignTop(target, element, position);
                if (isOutOfBounds(element)) {
                    alignBottom(target, element, position);
                    if (isOutOfBounds(element)) {
                        alignRight(target, element, position);

                        if (isOutOfBounds(element)) {
                            alignLeft(target, element, position);
                        }
                    }
                }
                break;

            case 'bottom-left':
            case 'bottom-right':
            case 'bottom':
                alignBottom(target, element, position);
                if (isOutOfBounds(element)) {
                    alignTop(target, element, position);
                    if (isOutOfBounds(element)) {
                        alignRight(target, element, position);

                        if (isOutOfBounds(element)) {
                            alignLeft(target, element, position);
                        }
                    }
                }
                break;

            case 'left-top':
            case 'left-bottom':
            case 'left':
                alignLeft(target, element, position);
                if (isOutOfBounds(element)) {
                    alignRight(target, element, position);

                    if (isOutOfBounds(element)) {
                        alignTop(target, element, position);

                        if (isOutOfBounds(element)) {
                            alignBottom(target, element, position);
                        }
                    }
                }
                break;

            case 'right-top':
            case 'right-bottom':
            case 'right':
                alignRight(target, element, position);
                if (isOutOfBounds(element)) {
                    alignLeft(target, element, position);

                    if (isOutOfBounds(element)) {
                        alignTop(target, element, position);

                        if (isOutOfBounds(element)) {
                            alignBottom(target, element, position);
                        }
                    }
                }
                break;
        }
    }


    const alignTop = (target: any, element: any, position: string) => {
        // let defaultClassName = 'ap-tooltip ap-tooltip-' + this.direction;
        // this.tooltip.className = this.styleClass ? defaultClassName + ' ' + this.styleClass : defaultClassName;

        const host = target?.getBoundingClientRect();
        const tooltip = element?.getBoundingClientRect();
        let left = host.left + (host.width - tooltip.width) / 2;
        switch (position) {
            case 'top-left':
                left = host.left;
                break;
            case 'top-right':
                left = host.right - tooltip.width;
                break;
            case 'bottom-left':
                left = host.left;
                break;
            case 'bottom-right':
                left = host.right - tooltip.width;
                break;
        }
        let top = host.top - tooltip.height;
        // if (paddingRef.current) {
        //     paddingRef.current.style.margin = 0;
        //     paddingRef.current.style.marginBottom = distance + 'px';
        // }
        if (element && distance > 0) {
            element.style.padding = 0;
            element.style.paddingBottom = distance + 'px';
        }
        element.style.left = left + 'px';
        element.style.top = top + 'px';

        if (isOutOfBounds(element)) {
            left = host.left;
            element.style.left = left + 'px';

            if (isOutOfBounds(element)) {
                left = host.right - tooltip.width;
                if (left < 0) left = 0;
                element.style.left = left + 'px';
            }
        }
    }

    const alignBottom = (target: any, element: any, position: string) => {
        // let defaultClassName = 'ap-tooltip ap-tooltip-' + ;
        // this.tooltip.className = this.styleClass ? defaultClassName + ' ' + this.styleClass : defaultClassName;
        const host = target.getBoundingClientRect();
        const tooltip = element.getBoundingClientRect();
        let left = host.left + (host.width - tooltip.width) / 2;
        switch (position) {
            case 'bottom-left':
                left = host.left;
                break;
            case 'bottom-right':
                left = host.right - tooltip.width;
                break;
            case 'top-left':
                left = host.left;
                break;
            case 'top-right':
                left = host.right - tooltip.width;
                break;
        }
        let top = host.bottom;
        // if (paddingRef.current) {
        //     paddingRef.current.style.margin = 0;
        //     paddingRef.current.style.marginTop = distance + 'px';
        // }
        if (element && distance > 0) {
            element.style.padding = 0;
            element.style.paddingTop = distance + 'px';
        }
        element.style.left = left + 'px';
        element.style.top = top + 'px';

        if (isOutOfBounds(element)) {
            left = host.left;
            element.style.left = left + 'px';

            if (isOutOfBounds(element)) {
                left = host.right - tooltip.width;
                if (left < 0) left = 0;
                element.style.left = left + 'px';
            }
        }
    }

    const alignRight = (target: any, element: any, position: string) => {
        // let defaultClassName = 'ap-tooltip ap-tooltip-' + this.direction;
        // this.tooltip.className = this.styleClass ? defaultClassName + ' ' + this.styleClass : defaultClassName;
        const host = target.getBoundingClientRect();
        const tooltip = element.getBoundingClientRect();
        let left = host.left + host.width;
        // if (paddingRef.current) {
        //     paddingRef.current.style.margin = 0;
        //     paddingRef.current.style.marginLeft = distance + 'px';
        // }
        if (element && distance > 0) {
            element.style.padding = 0;
            element.style.paddingLeft = distance + 'px';
        }
        let top = host.top + (host.height - tooltip.height) / 2;
        switch (position) {
            case 'right-top': top = host.top; break;
            case 'right-bottom': top = host.bottom - tooltip.height; break;
            case 'left-top':
                top = host.top;
                break;
            case 'left-bottom':
                top = host.bottom - tooltip.height;
                break;
        }
        element.style.left = left + 'px';
        element.style.top = top + 'px';

        if (isOutOfBounds(element)) {
            top = host.top;
            element.style.top = top + 'px';

            if (isOutOfBounds(element)) {
                top = host.bottom - tooltip.height;
                if (top < 0) top = 0;
                element.style.top = top + 'px';
            }
        }
    }

    const alignLeft = (target: any, element: any, position: string) => {
        // let defaultClassName = 'ap-tooltip ap-tooltip-' + this.direction;
        // this.tooltip.className = this.styleClass ? defaultClassName + ' ' + this.styleClass : defaultClassName;
        const host = target.getBoundingClientRect();
        const tooltip = element.getBoundingClientRect();
        let left = host.left - tooltip.width;
        // if (paddingRef.current) {
        //     paddingRef.current.style.margin = 0;
        //     paddingRef.current.style.marginRight = distance + 'px';
        // }
        if (element && distance > 0) {
            element.style.padding = 0;
            element.style.paddingRight = distance + 'px';
        }
        let top = host.top + (host.height - tooltip.height) / 2;
        switch (position) {
            case 'left-top':
                top = host.top;
                break;
            case 'left-bottom':
                top = host.bottom - tooltip.height;
                break;
            case 'right-top': top = host.top; break;
            case 'right-bottom': top = host.bottom - tooltip.height; break;
        }
        element.style.left = left + 'px';
        element.style.top = top + 'px';

        if (isOutOfBounds(element)) {
            top = host.top;
            element.style.top = top + 'px';

            if (isOutOfBounds(element)) {
                top = host.bottom - tooltip.height;
                if (top < 0) top = 0;
                element.style.top = top + 'px';
            }
        }
    }

    React.useEffect(() => {

        if (children) {
        } else {
            target && loadTargetEvents();
        }
        return () => {
            removeTooltip();
        }

    }, [])



    const onMouseEnter = () => {
        if (!hideTooltipOnBlur) {
            allowHide = false;
        }
    }

    const onMouseLeave = () => {
        if (trigger === 'hover') {
            allowHide = true;
            hide();
        }

    }


    const childContents = () => {
        if (children) {
            let { showEvent, hideEvent } = getEvents();
            return React.Children.map(children, (child: any, i) => {
                if (!React.isValidElement(child) || !child.type) {
                    return null;
                }
                if (trigger === 'hover') {
                    if (hideEvent === 'datakey') {
                        return React.cloneElement(child, {
                            // @ts-ignore
                            onFocus: show,
                            onBlur: hide,
                            [showEvent]: show,
                            key: i
                        });
                    } else {
                        if (hideTooltipOnBlur) {
                            return React.cloneElement(child, {
                                // @ts-ignore
                                onFocus: show,
                                onBlur: hide,
                                [showEvent]: show,
                                [hideEvent]: hide,
                                key: i
                            });
                        }
                        return React.cloneElement(child, {
                            // @ts-ignore
                            onFocus: show,
                            [showEvent]: show,
                            [hideEvent]: hide,
                            key: i
                        });
                    }


                }
                if (trigger === 'click') {
                    if (hideEvent === 'datakey') {
                        return React.cloneElement(child, {
                            //@ts-ignore
                            onKeyDown: handleKeyDown,
                            [showEvent]: show,
                            key: i
                        });
                    } else {
                        return React.cloneElement(child, {
                            //@ts-ignore
                            onKeyDown: handleKeyDown,
                            [showEvent]: show,
                            [hideEvent]: hide,
                            key: i
                        });
                    }


                }
                if (hideEvent === 'datakey') {
                    return React.cloneElement(child, {
                        [showEvent]: show,
                        key: i
                    });
                } else {
                    return React.cloneElement(child, {
                        [showEvent]: show,
                        [hideEvent]: hide,
                        key: i
                    });
                }

            });
        }
        return null
    }

    const contentRender = () => {
        if (typeof content === 'function') {
            return content();
        }

        return content;
    }

    const renderElement = () => {
        // curposition: 格式为 top-left top-right
        // ap-tooltip-left-top
        const tooltipClassName = ClassNames('ap-tooltip-react', {
            [`ap-tooltip-${curposition}`]: curposition,
            // 'show': visible,
        }, className);
        const reactContentClassName = ClassNames('ap-tooltip-reactContent', {
            // 'show': visible,
        });
        return (
            <div
                id={id}
                ref={toolRef}
                className={tooltipClassName}
                style={style}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                // onBlur={blur}
                role="tooltip"
            >
                <div className={reactContentClassName} ref={paddingRef} >
                    <span></span>
                    <div className="ap-tooltip-text">
                        {contentRender()}
                    </div>
                </div>

            </div>
        );
    }

    return (
        <>
            {childContents()}
            {/* {content && ReactDOM.createPortal(renderElement(), document.body)} */}
        </>

    );


})


export default Tooltip;