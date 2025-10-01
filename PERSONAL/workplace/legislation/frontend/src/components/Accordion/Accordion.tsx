import { forwardRef, useRef, useCallback, Children, cloneElement } from 'react';
import mergeRefs from 'helpers/mergeRefs';
import { useControlled } from 'hooks/utils';
import { AccordionProps } from './Accordion.interface';

import styles from './Accordion.module.scss';


const Accordion = forwardRef<HTMLElement, AccordionProps>(({
  accordionId,
  multiple,
  activeKeys: activeKeysProp,
  defaultActivekeys,
  onClick,
  children,
  ...rest
}, ref) => {

  const [activeKeys, setActiveKeys, isControlled] = useControlled(activeKeysProp, defaultActivekeys || []);
  const accordionRef = useRef(null);
  const activeKeysRef = useRef(activeKeys);

  const handleItemClick = useCallback((e: React.MouseEvent<HTMLElement>, keyValue: string) => {
    const _collapsed = activeKeysRef.current.includes(keyValue)

    let newActivekkeys = activeKeys;
    if (multiple) {
        newActivekkeys = _collapsed ? (activeKeysRef.current as string[]).filter(data => data !== keyValue) : activeKeysRef.current.concat(keyValue);
    } else {
        newActivekkeys = _collapsed ? [] : [keyValue]
    }
    activeKeysRef.current = newActivekkeys;
    setActiveKeys(newActivekkeys);

    onClick ? onClick(newActivekkeys, e) : () => {};
}, [activeKeys, multiple, onClick, setActiveKeys]);


const content = useCallback(() => {
  if (!multiple && activeKeys.length > 1) {
      activeKeysRef.current = activeKeys.slice(0, 1);
      setActiveKeys([...activeKeysRef.current]);
  } else {
      activeKeysRef.current = activeKeys;
  }
  return Children.map(children, (child: any, index) => {
    if (child) {
      const keyValue = child?.props?.itemKey;
      const isExpanded = activeKeysRef.current?.includes(keyValue);

      return cloneElement(child, {
        expanded: isExpanded ? 'true' : undefined,
        onClickEvent: handleItemClick
      });
    }
  });

}, [multiple, activeKeys, children, setActiveKeys, handleItemClick]);

  return (
    <ul
      className={styles.root}
      id={accordionId}
      ref={mergeRefs(ref, accordionRef)}
      role="tablist"
      aria-multiselectable={multiple}
      {...rest}
    >
      {content()}
    </ul>
  );

});

export default Accordion;
