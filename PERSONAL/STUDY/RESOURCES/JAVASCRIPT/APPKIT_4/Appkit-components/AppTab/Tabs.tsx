import React, { useRef, forwardRef } from 'react';
import ClassNames from "classnames";
import { useControlled } from '../../../hooks';


interface ItabsProps {
    type?: string,
    activeIndex?: number,
    defaultActiveIndex?: number,
    className?: string,
    onTabChange?: (i: number) => void,
    style?: React.CSSProperties,
    tabsetId?: string,
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement>,
    ItabsProps { }

const Tabs = forwardRef<HTMLDivElement, TabsProps>((props, ref) => {
    const {
        activeIndex,
        defaultActiveIndex = 0,
        type = 'underline',
        children,
        style = {},
        className,
        onTabChange,
        tabsetId = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now()
    } = props;
    const tabRef = useRef<HTMLDivElement>(null);
    const [curActiveIndex, setCurActiveIndex] = useControlled(activeIndex, defaultActiveIndex);
    const onKeyDown = (event: any) => {
        const KEY_LEFT_DOWN = 37;
        const KEY_RIGHT_DOWN = 39;
        const tabList: any = tabRef.current?.querySelectorAll('.ap-tabset-toggle');
        let index = curActiveIndex;
        if (!children) return;
        if (event.keyCode === KEY_LEFT_DOWN) {
            event.preventDefault();
            // index--;
            // if (index < 0) {
            //     index = (children as React.ReactNode[]).length - 1;
            // };
            index = findNextAvailableTabIndex('left', index);
            setCurActiveIndex(index);
            onTabChange?.(index);
            tabList[index].focus();
        } else if (event.keyCode === KEY_RIGHT_DOWN) {
            event.preventDefault();
            // index++;
            // if (index > (children as React.ReactNode[]).length - 1) {
            //     index = 0;
            // };
            index = findNextAvailableTabIndex('right', index);
            setCurActiveIndex(index);
            onTabChange?.(index);
            tabList[index].focus();
        }
    }

    const findNextAvailableTabIndex = (moveDirection: 'left' | 'right', currentIndex: number) => {
        const tabsArr: any = [];
        React.Children.forEach(children, (child: any, index: number) => {
            if (!child) {
                return;
            }
            tabsArr.push(child.props);
        });
        const savedIndex = currentIndex;
        while (true) {
            if (moveDirection === 'left') {
                currentIndex--;
            } else {
                currentIndex++;
            }
            if (currentIndex === savedIndex) break;
            if (moveDirection === 'left' && currentIndex < 0) {
                currentIndex = tabsArr.length - 1;
            }
            if (moveDirection === 'right' && currentIndex === tabsArr.length) {
                currentIndex = 0;
            }
            if (!tabsArr[currentIndex].disabled) {
                break;
            }
        }
        return currentIndex;
    }
    const renderHeader: any = () => {
        const results: any[] = [];
        React.Children.forEach(children, (child: any, index: number) => {
            if (!child) {
                return;
            }
            const { label, icon, disabled } = child.props;
            const classToggleNames = ClassNames("ap-tabset-toggle", {
                "has-label": label,
                "has-icon": icon,
                "disabled": disabled,
                "active": curActiveIndex === index
            });
            const classIconNames = ClassNames("Appkit4-icon", icon);

            results.push(
                <div
                    key={index}
                    id={`tab${label ? '-' + label : ''}-${tabsetId}`}
                    className={classToggleNames}
                    onKeyDown={(e) => { onKeyDown(e) }}
                    onClick={() => {
                        if (disabled) {
                            return;
                        }
                        setCurActiveIndex(index);
                        onTabChange?.(index);
                    }}
                    role="tab"
                    aria-controls={`panel${label ? '-' + label : ''}`}
                    aria-selected={curActiveIndex === index ? true : false}
                    tabIndex={(curActiveIndex === index && !disabled) ? 0 : -1}
                    aria-disabled={disabled}
                    aria-describedby={`tab-tooltip${label ? '-' + label : ''}-${tabsetId}`}
                    aria-label={!label && icon && typeof icon === 'string' ? icon : ''}
                >
                    {type === 'underline' && <span className="ap-tabset-toggle-underline"></span>}
                    <span className="ap-tabset-toggle-inactive">
                        {(type === 'filled' && icon) && (typeof icon === 'string' ? <span className={classIconNames} aria-hidden ></span> : icon)}
                        {label}
                    </span>
                    <span className="ap-tabset-toggle-active">
                        {(type === 'filled' && icon) && (typeof icon === 'string' ? <span className={classIconNames} aria-hidden ></span> : icon)}
                        {label}
                    </span>
                </div>
            );
        });

        return results;
    };

    const renderContent: any = () => {
        let results: any[] = [];

        React.Children.forEach(children, (child: any, index) => {
            if (!child) {
                return;
            }
            const { label } = child.props;
            const active: boolean = curActiveIndex === index;
            results.push(
                React.cloneElement(child, {
                    active,
                    label,
                    key: index,
                    ...child.props
                })
            );
        });
        return results;
    };

    const classContainerNames: string = ClassNames("ap-tabset-container", className);
    const classWrapperNames: string = ClassNames("ap-tabset-toggle-wrapper", type);

    return <div ref={ref} className={classContainerNames} style={style} id={`tabset-${tabsetId}`}>
        <div ref={tabRef} className={classWrapperNames} role="tablist" aria-label="tablist" >
            {type === 'underline' && <span className="ap-tabset-underline"></span>}
            {renderHeader()}
        </div>
        <div className="ap-tabset-content">
            {renderContent()}
        </div>
    </div>
})


export default Tabs
