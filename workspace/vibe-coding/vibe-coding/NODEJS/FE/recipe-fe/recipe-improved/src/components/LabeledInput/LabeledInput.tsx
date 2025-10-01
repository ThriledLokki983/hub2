import React, { ReactElement, ComponentPropsWithRef, ComponentType } from 'react';

import { StyledSelect } from '../';
import { LabeledInputProps } from './LabeledInput.interface';

import styles from './LabeledInput.module.scss';


const LabeledInput = ({
  label = '',
  id = '',
  icon = {},
  children,
  ...props
}: LabeledInputProps) => {

  const updateChildren = (child: ReactElement) => {

    const updateProps = (props: ComponentPropsWithRef<ComponentType<typeof child.props>>) => ({
      ...props,
      placeholder: ' ', // Need this for `:placeholder-shown` to work.
      id,
    });

    // StyledSelect exception.
    if (child.type === StyledSelect) {
      return {
        ...child,
        props: {
          ...child.props,
          children: Array.isArray(child.props.children)
            ? child.props.children.map((c: ReactElement) => {
              return c.type === 'select'
                ? {
                  ...c,
                  props: updateProps(c.props),
                }
                : c;
            })
            : {
              ...child.props.children,
              props: updateProps(child.props.children.props),
            },
        }
      };
    }

    // Regular transformation.
    return {
      ...child,
      props: updateProps(child.props),
    };

  };

  return (
    <div
      className={styles.root}
      data-has-icon={!!icon.object}
      {...props}
    >
      {React.Children.map(children, updateChildren)}
      <label htmlFor={id} aria-hidden={!label}>{label}</label>
      {icon && icon.object ? <icon.object /> : ''}
    </div>
  );

};

export default LabeledInput;
