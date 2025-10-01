import React from 'react';
import { KEY_VALUES } from '../utils';
import mergeRefs from '../utils/mergeRefs';
import ClassNames from 'classnames';
import { useControlled } from '../utils';

export interface NavigationItem {
    name: string,
    prefixIcon?: string,
    suffixIcon?: string
}

export interface NavigationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'role'> {
    solid?: boolean,
    selectedIndex?: number,
    onClickCollapseEvent?: (collapse: boolean, event: React.MouseEvent<HTMLElement>) => void,
    onClickItem?: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>, index: number) => void,
    onClickLogo?: (event: React.MouseEvent<HTMLElement>) => void,
    hasLogo?: boolean,
    role?: string,
    width?: number,
    navList?: any[],
    ariaLabel?: string,
    titleTemplate?: () => React.ReactNode,
    userTemplate?: () => React.ReactNode,
    style?: React.CSSProperties,
    className?: string,
    collapsed?: boolean,
    hasHeader?: boolean,
    defaultCollapsed?: boolean;
}

const Navigation = React.forwardRef<HTMLElement, NavigationProps>(
    (
        {
            solid = false,
            selectedIndex = 0,
            onClickCollapseEvent,
            onClickItem,
            onClickLogo,
            hasLogo = true,
            role = 'link',
            width = 280,
            navList,
            ariaLabel = 'Side navigation',
            titleTemplate,
            userTemplate,
            className,
            style,
            collapsed: collapsedProp,
            hasHeader = true,
            defaultCollapsed
        },
        ref
    ) => {
        const [collapsed, setCollapsed, isControlled] = useControlled(collapsedProp, defaultCollapsed || false);

        const navRef = React.useRef(null);

        const tempWidthRef = React.useRef<number>(width);

        const classes = ClassNames("ap-navigation-wrapper", {
            "collapse-nav": collapsed,
            "solid-nav": solid
        }, className);

        // style = {
        //     ...style, width
        // };

        const onClick = (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>, index: number) => {
            onClickItem?.(event, index);
        }
        const onClickCollapse = (event: React.MouseEvent<HTMLElement>) => {
            let newValue = !collapsed;
            setCollapsed(newValue);
            onClickCollapseEvent?.(newValue, event);
        }
        const keyupEvent = (event: React.KeyboardEvent<HTMLElement>, index: number) => {
            if (event.key !== KEY_VALUES.ENTER) {
                return;
            }
            onClickItem?.(event, index);
        };

        React.useEffect(() => {
            const nav = navRef.current! as HTMLElement;
            width = collapsed ? 72 : tempWidthRef.current;
            // nav.style.removeProperty("width");
            nav.style.width = width + 'px';
        }, [collapsed])

        return (
            <nav className={classes} style={style} aria-label={ariaLabel} ref={mergeRefs(ref, navRef)}>
                {hasHeader && <div className="ap-navigation-heading">
                    <div className="ap-navigation-title-wrapper">
                        {hasLogo && <div className="ap-navigation-logo" onClick={onClickLogo}></div>}
                        <div className="ap-navigation-title">
                            {
                                titleTemplate && <div className="ap-header-title">
                                    {titleTemplate()}
                                </div>
                            }
                        </div>
                    </div>
                    <div className="ap-navigation-avatar-content">
                        {userTemplate?.()}
                    </div>
                </div>}
                <div className="ap-navigation-content">
                    {
                        navList && navList.map((navItem: NavigationItem, index) => {
                            return (
                                <div
                                    key={index}
                                    className={ClassNames('ap-navigation-item', { 'selected': selectedIndex === index })}
                                    tabIndex={0}
                                    role={role}
                                    onClick={(event) => onClick(event, index)}
                                    onKeyUp={(event) => keyupEvent(event, index)}
                                >
                                    <div className="prefix-content">
                                        {navItem.prefixIcon && <span className={`prefixIcon Appkit4-icon icon-${navItem.prefixIcon}-outline`} aria-label={navItem.name} aria-hidden={!collapsed}></span>}
                                    </div>
                                    {!collapsed && <span className="itemContent">{navItem.name}</span>}
                                    {navItem.suffixIcon && !collapsed && <span className={`suffixIcon Appkit4-icon icon-${navItem.suffixIcon}-outline`} aria-hidden={true}></span>}
                                </div>
                            )
                        })
                    }
                </div>
                <div className="ap-navigation-footer">
                    <div className="ap-navigation-item collapsed-item" onClick={onClickCollapse}>
                        <div className="prefix-content">
                            {!collapsed ?
                                <span className="prefixIcon Appkit4-icon icon-enter-left-outline"></span>
                                : <span className="prefixIcon Appkit4-icon icon-enter-right-outline"></span>}
                        </div>
                        <span className="itemContent">Collapse</span>
                    </div>
                </div>
            </nav>
        )
    });

Navigation.displayName = 'Navigation';

export default Navigation