import React from 'react';
import ClassNames from 'classnames';
import { mergeRefs } from '../../../util/helpers';
import { useControlled } from '../../../hooks';

export interface AccordionProps
    extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> {
    accordionId?: string,
    onClick?: (activeKeys: string[], event: React.MouseEvent<HTMLElement>) => void;
    multiple?: boolean;
    style?: React.CSSProperties;
    kind?: string;
    className?: string;
    children: React.ReactNode,
    activeKeys?: string[];
    defaultActivekeys?: string[];
}

const Accordion = React.forwardRef<HTMLElement, AccordionProps>(
    ({
        accordionId,
        className,
        children,
        multiple,
        kind = 'default',
        style,
        onClick,
        activeKeys: activeKeysProp,
        defaultActivekeys,
        ...otherProps
    }, ref) => {

        const [activeKeys, setActiveKeys, isControlled] = useControlled(activeKeysProp, defaultActivekeys || []);
        const accordionRef = React.useRef(null);
        const activeKeysRef = React.useRef(activeKeys);
        const classes = ClassNames('ap-accordion-group-container', className, {
            'ap-accordion-transparent': kind === 'transparent'
        });
        const handleItemClick = React.useCallback((e: React.MouseEvent<HTMLElement>, keyValue: string) => {
            const _collapsed = activeKeysRef.current.includes(keyValue);
            let newActivekkeys = activeKeys;
            if (multiple) {
                newActivekkeys = _collapsed ? (activeKeysRef.current as string[]).filter(data => data !== keyValue) : activeKeysRef.current.concat(keyValue);
            } else {
                newActivekkeys = _collapsed ? [] : [keyValue]
            }
            activeKeysRef.current = newActivekkeys;
            setActiveKeys(newActivekkeys);

            onClick && onClick(newActivekkeys, e);
        }, [activeKeys, multiple, onClick])

        const content = React.useCallback(() => {
            if (!multiple && activeKeys.length > 1) {
                activeKeysRef.current = activeKeys.slice(0, 1);
                setActiveKeys([...activeKeysRef.current]);
            } else {
                activeKeysRef.current = activeKeys;
            }
            return React.Children.map(children, (child: any, index) => {
                let keyValue = child.props.itemKey;
                return React.cloneElement(child, {
                    expanded: activeKeysRef.current?.includes(keyValue),
                    onClickEvent: handleItemClick
                });
            });

        }, [children, activeKeys, multiple, handleItemClick]);

        return (
            <ul  style={style} className={classes} ref={mergeRefs(ref, accordionRef)} role={"tablist"} aria-multiselectable={multiple} {...otherProps}>
                {content()}
            </ul>
        );
    });

Accordion.displayName = 'Accordion';

export default Accordion;



