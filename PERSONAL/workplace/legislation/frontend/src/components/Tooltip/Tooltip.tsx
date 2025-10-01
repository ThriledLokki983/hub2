import { OverlayArrow, Tooltip, TooltipTrigger, TooltipProps } from 'react-aria-components';
// import { TooltipProps } from './Tooltip.interface';

import { useRef } from "react";
import styles from "./Tooltip.module.scss";

interface MyTooltipProps extends Omit<TooltipProps, 'children'> {
  children: React.ReactNode;
  content: React.ReactNode;
  delay?: number;
  placement?: 'top' | 'bottom' | 'start' | 'end' | 'left' | 'right';
}

/**
 * I used a custom element for clarity in the DOM and to avoid any potential conflicts with the native tooltip element.
 * the role attribute is used to indicate the purpose of the element to assistive technologies.
 * the inert attribute is used to indicate that the element is not interactive.
 *
 */
const MyTooltip = ({
  // content,
  // tipPosition,
  // maxSized = false,
  content,
  children,
  placement = 'top',
  delay,
  ...props
}: MyTooltipProps) => {

  const toolTipReef = useRef<HTMLDivElement | null>(null);

  if (!content) {
    return <>{children}</>;
  }

  return (
    <TooltipTrigger delay={delay}>
      {children}
      <Tooltip {...props} className={styles.root} placement={placement}>
        <OverlayArrow className={styles.root__arrow}>
          <svg width={8} height={8} viewBox="0 0 8 8">
            <path d="M0 0 L4 4 L8 0" />
          </svg>
        </OverlayArrow>
        <div className={styles.tooltip__content} ref={toolTipReef}>
          {content}
        </div>
      </Tooltip>
    </TooltipTrigger>
  );
};

export default MyTooltip;
