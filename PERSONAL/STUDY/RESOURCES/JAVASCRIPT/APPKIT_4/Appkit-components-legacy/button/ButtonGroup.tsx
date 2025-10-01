import React, { useMemo } from 'react';
import classNames from 'classnames';
import ButtonGroupContext from './ButtonGroupContext';

interface IButtonGroupProps {
  prefixCls?: string;
  vertical?: boolean;
  splitButton?: boolean;
  /* Set all wrapped button will be disabled */
  disabled?: boolean;
  compact?: boolean;
  /* React node */
  children?: React.ReactNode;
}

export interface ButtonGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
  IButtonGroupProps { }

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>((props, ref) => {

  const {
    className,
    compact,
    disabled,
    ...restProps
  } = props;
  const prefixCls = 'ap-btn-group';

  const classes = classNames(prefixCls, className);
  const context = useMemo(() => ({ compact, disabled }), [compact, disabled]);

  return (
    <ButtonGroupContext.Provider value={context}>
      <div
        ref={ref}
        role="group"
        className={classNames("ap-btn-group", className)}
        {...restProps}
      />
    </ButtonGroupContext.Provider>
  );

});

ButtonGroup.displayName = "ButtonGroup";

export default ButtonGroup;