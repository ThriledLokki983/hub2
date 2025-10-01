import{ useEffect, useRef, useState } from 'react';

import { SplitButtonProps } from './SplitButton.interface';
import Button from 'components/Button/Button';
import { IconComponent } from 'components/Icon/Icon';
import styles from './SplitButton.module.scss';


const SplitButton = ({
  primaryType = 'button',
  primaryText = 'Primary',
  variant = 'primary',
  primaryAction,
  children,
  disabled = false,
  ...props
}: SplitButtonProps) => {

  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const splitButtonsRef = useRef<HTMLDivElement | null>(null);
  const popupButtonsRef = useRef<HTMLSpanElement | null>(null);


  /**
   * Toggle menu.
   */
  const toggleMenu = (e: any) => {
    e.preventDefault();
    setIsMenuExpanded(!isMenuExpanded);
  };


   /**
   * Handle clicks outside the button or popup menu, and close the menu.
   */
  useEffect(() => {
    const clickHandler = (e: any) => {
      if (popupButtonsRef?.current?.contains(e.target) || splitButtonsRef?.current?.contains(e.target)) {
        return;
      }
      if (isMenuExpanded) {
        setIsMenuExpanded(false);
      }
    };
    document.addEventListener('click', clickHandler);
    return () => {
      document.removeEventListener('click', clickHandler);
    }
  }, [isMenuExpanded]);


  return (
    <div
      ref={splitButtonsRef}
      data-variant={variant}
      className={styles.root}
      data-disabled={`${disabled}`}
      data-split
    >
      <Button
        type={primaryType}
        onClick={primaryAction}
        {...props}
      >
        {primaryText}
      </Button>
      <span
        className={styles.root__popup}
        ref={popupButtonsRef}
        role="menu"
        onClick={toggleMenu}
        aria-haspopup="true"
        aria-expanded={isMenuExpanded}
        title="Open for more actions"
      >
        <IconComponent name="DownIcon" />
        <ul className={styles.root__list} aria-expanded={isMenuExpanded}>
          {children}
        </ul>
      </span>
    </div>
  );

};

export default SplitButton;
