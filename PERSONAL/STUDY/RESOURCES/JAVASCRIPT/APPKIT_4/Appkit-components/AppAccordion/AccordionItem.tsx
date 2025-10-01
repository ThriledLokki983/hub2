import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';
import { KEY_VALUES } from '../../../configs/config';
import SlideDown from './SlideDown';


export interface AccordionItemProps {
    itemKey: string,
    expanded?: boolean,
    children?: React.ReactNode,
    templateHeader?: () => React.ReactNode,
    onClickEvent?: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLLIElement>, key?: string) => void,
    title?: string,
    style?: React.CSSProperties,
    className?: string,
    accordionHeaderId?: string,
    excludeElementToToggle?: string,
    toggleFromBody?: boolean
    toggleFromHeaderIconOnly?: boolean,
    inclElementToToggle?: string
};

const AccordionItem: React.FC<AccordionItemProps> = (props) => {
    const {
        expanded,
        onClickEvent,
        itemKey,
        children,
        style,
        className,
        title,
        templateHeader,
        accordionHeaderId,
        excludeElementToToggle = '',
        toggleFromBody = false,
        toggleFromHeaderIconOnly = false,
        inclElementToToggle = '',
        ...rest
    } = props;

    const contentRef = React.useRef(null);
    const classes: string = ClassNames('ap-accordion', className, {
        'expanded': expanded
    });

    const classesIcon: string = ClassNames('Appkit4-icon icon-down-chevron-outline', {
        'rotate': expanded
    });

    const classesContent: string = ClassNames('ap-accordion-content', {
        'hidden': !expanded,
        'ap-accordion-cursor-default': !toggleFromBody
    });

    const getClosestElement = (target: HTMLElement, name: string): HTMLElement => {
        return target.closest(name) as HTMLElement;
    }

    const focusElementSelector = (name: string, element?: HTMLElement): void => {
        ((element as HTMLElement).querySelector(name) as HTMLElement)?.focus();
    }

    const onKeyDownEvent = (event: React.KeyboardEvent<HTMLLIElement>) => {
        const target = event.target as HTMLElement;
        let nextEle, previousEle;
        let childEles;
        switch (event.key) {
            case KEY_VALUES.ENTER:
            case KEY_VALUES.SPACE:
                event.preventDefault();
                onClickEvent && onClickEvent(event, itemKey);
                break;
            case KEY_VALUES.DOWN:
                event.preventDefault();
                nextEle = getClosestElement(target, '.ap-accordion')?.nextElementSibling;
                if (!nextEle) {
                    nextEle = getClosestElement(target, '.ap-accordion-group-container')?.firstChild;
                }
                nextEle && focusElementSelector('.ap-accordion-toggle', nextEle as HTMLElement);
                break;
            case KEY_VALUES.UP:
                event.preventDefault();
                previousEle = getClosestElement(target, '.ap-accordion')?.nextElementSibling;
                event.preventDefault();
                previousEle = getClosestElement(target, '.ap-accordion')?.previousElementSibling;
                if (!previousEle) {
                    const childEles = getClosestElement(target, '.ap-accordion-group-container')?.children;
                    previousEle = childEles && childEles[childEles.length - 1];
                }
                ((previousEle as HTMLElement).querySelector('.ap-accordion-toggle') as HTMLElement)?.focus();
                previousEle && focusElementSelector('.ap-accordion-toggle', previousEle as HTMLElement);
                break;
            case KEY_VALUES.HOME:
                event.preventDefault();
                childEles = getClosestElement(target, '.ap-accordion-group-container')?.children;
                const firstAccordionEle = childEles && childEles[0];
                firstAccordionEle && focusElementSelector('.ap-accordion-toggle', firstAccordionEle as HTMLElement);
                break;
            case KEY_VALUES.END:
                event.preventDefault();
                childEles = getClosestElement(target, '.ap-accordion-group-container')?.children;
                const lastAccordionEle = childEles && childEles[childEles.length - 1];
                lastAccordionEle && focusElementSelector('.ap-accordion-toggle', lastAccordionEle as HTMLElement);
                break;
        }
    }

    const clickEvent = (event: React.MouseEvent<HTMLElement>) => {
        const target = (event?.target as HTMLElement);
        if (toggleFromHeaderIconOnly && event) {
            if (target.closest('.ap-accordion-toggle') && !target.closest('.Appkit4-icon')
                && !target.closest('.ap-accordion-toggle-icon-container')
                && (inclElementToToggle === ''
                    || (inclElementToToggle !== '' && !target.closest(inclElementToToggle)))) {
                return;
            }
        }
        if (excludeElementToToggle && target.closest(excludeElementToToggle))
            return;
        if (!inclElementToToggle) {
            if (!toggleFromBody && target.closest('.ap-accordion-content'))
                return;
        } else {
            if (!toggleFromBody && target.closest('.ap-accordion-content') && !target.closest(inclElementToToggle))
                return;
        }
        onClickEvent && onClickEvent(event, itemKey);
    }

    return (
        <li
            className={classes}
            style={style}
            onKeyDown={onKeyDownEvent}
            {...rest}
        >
            <div
                className={`ap-accordion-toggle ${toggleFromHeaderIconOnly ? 'ap-accordion-cursor-default' : ''}`}
                tabIndex={toggleFromHeaderIconOnly ? undefined : 0}
                id={accordionHeaderId}
                role={"tab"}
                aria-expanded={toggleFromHeaderIconOnly ? undefined : expanded}
                aria-selected={toggleFromHeaderIconOnly ? undefined : expanded}
                aria-controls={toggleFromHeaderIconOnly ? undefined : itemKey}
                onClick={clickEvent}
            >
                {
                    title ?
                        (
                            <div className="ap-accordion-title ap-font-medium">
                                {title}
                            </div>
                        ) : (
                            <div className="ap-accordion-title-extra ap-accordion-title ap-font-medium">
                                {templateHeader?.()}
                            </div>
                        )
                }
                <div className="ap-accordion-toggle-icon-container"
                    aria-label={"toggle-icon"}
                    role={toggleFromHeaderIconOnly ? 'button' : undefined}
                    tabIndex={toggleFromHeaderIconOnly ? 0 : undefined}
                    aria-expanded={toggleFromHeaderIconOnly ? expanded : undefined}
                    aria-selected={toggleFromHeaderIconOnly ? expanded : undefined}
                    aria-controls={toggleFromHeaderIconOnly ? itemKey : undefined}>
                    <span className={classesIcon} aria-hidden></span>
                </div>
            </div>
            {<SlideDown>
                {expanded ? <div
                    id={itemKey}
                    className={classesContent}
                    role={"tabpanel"}
                    tabIndex={toggleFromBody ? 0 : undefined}
                    ref={contentRef}
                >
                    {children}
                </div > : null}
            </SlideDown>}

        </li >
    );
}

AccordionItem.propTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
    itemKey: PropTypes.string.isRequired
};

AccordionItem.displayName = 'AccordionItem';

export default AccordionItem;
