import { useRef, useMemo, useState, useEffect } from 'react';
import { uuid } from '@grrr/utils';
import { DropDownMenuProps } from './DropDownMenu.interface';

import styles from './DropdownMenu.module.scss';

/**
 * Dropdown menu.
 * - Must be positioned in a parent container with `position: relative`.
 * - Takes a toggle button from outside, since styling might (greatly) differ.
 * - By default styles a direct child `ul` with buttons/links.
 */
const DropdownMenu = ({
  type = '',
  buttonRef = null,
  openDelay = 0,
  onToggle = () => null,
  children,
  ...props
}: DropDownMenuProps) => {

  const id = useMemo(() => uuid(), []);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  /**
   * Set `aria-expanded` state on toggle button.
   */
  useEffect(() => {
    buttonRef!.current.setAttribute('aria-expanded', `${isExpanded}`);
  }, [buttonRef, isExpanded])

  /**
   * Prime toggle button and attach click listener.
   */
  useEffect(() => {
    const current = buttonRef!.current;

    // Toggle handler.
    const toggleMenu = (e: any) => {
      const shouldExpand = !isExpanded;
      onToggle(shouldExpand);
      window.setTimeout(() => {
        setIsExpanded(shouldExpand);
      }, openDelay);
      e.preventDefault();
    };

    // Prime and attach click listener.
    current.setAttribute('aria-controls', id);
    current.addEventListener('click', toggleMenu);

    // Remove listeners.
    return () => {
      current.removeEventListener('click', toggleMenu);
    }
  }, [buttonRef, id, isExpanded, openDelay, onToggle]);

  /**
   * Set up close handlers.
   * Handles escape key, and clicks anywhere outside of the menu or toggle button.
   */
  useEffect(() => {
    const menuCurrent = menuRef.current;
    const buttonCurrent = buttonRef?.current;

    // Close the menu on any click.
    const clickHandler = (e: any) => {
      if (!isExpanded) {
        return;
      }
      setIsExpanded(false);
    };
    document.addEventListener('click', clickHandler);

    // Handle escape key on the button or inside menu, and close the menu.
    const escapeHandler =(e: any) => {
      if (!isExpanded) {
        return;
      }
      if (e.key !== 'Escape') {
        return;
      }
      if (buttonCurrent !== document.activeElement && !menuCurrent!.contains(document.activeElement)) {
        return;
      }
      setIsExpanded(false);
    };
    document.addEventListener('keyup', escapeHandler);

    // Remove listeners.
    return () => {
      document.removeEventListener('click', clickHandler);
      document.removeEventListener('keyup', escapeHandler);
    }

  }, [menuRef, buttonRef, isExpanded]);

  return (
    <div
      className={styles.root}
      ref={menuRef}
      id={id}
      data-type={type}
      aria-hidden={!isExpanded}
      dropdown-menu=""
    >
      {children}
    </div>
  );

};

export default DropdownMenu;
