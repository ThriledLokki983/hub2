import React, { ReactElement, useEffect, useState } from 'react';
import { Icon } from 'components';
import { StyledSelectProps } from './StyledSelect.interface';
import styles from './StyledSelect.module.scss';

const StyledSelect = ({ children, ...props }: StyledSelectProps) => {
  const [selectedValue, setSelectedValue] = useState('');

  // Add aria-hidden to the icon since it's decorative
  const iconProps = {
    name: 'chevron-down',
    'aria-hidden': 'true',
    role: 'presentation',
  };

  // Enhance select props and track selected value
  const enhanceSelectProps = (child: ReactElement) => {
    if (child.type === 'select') {
      return React.cloneElement(child, {
        ...child.props,
        value: selectedValue || child.props.value || '',
        onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
          setSelectedValue(e.target.value);
          if (child.props.onChange) {
            child.props.onChange(e);
          }
        },
        'aria-invalid': props['aria-invalid'],
        'aria-required': props['aria-required'] || child.props.required,
        'aria-describedby': props['aria-describedby'],
      });
    }
    return child;
  };

  // Ensure we only process ReactElement children
  const selectChildren = React.Children.toArray(children).filter((child): child is ReactElement =>
    React.isValidElement(child),
  );

  // Set initial value if provided
  useEffect(() => {
    const selectChild = React.Children.toArray(children)
      .filter((child): child is ReactElement => React.isValidElement(child))
      .find(child => child.type === 'select');

    if (selectChild && 'value' in selectChild.props) {
      setSelectedValue(selectChild.props.value);
    }
  }, [children]);

  return (
    <div className={styles.root} data-styled-select="">
      {React.Children.map(selectChildren, enhanceSelectProps)}
      <Icon {...iconProps} />
    </div>
  );
};

export default StyledSelect;
