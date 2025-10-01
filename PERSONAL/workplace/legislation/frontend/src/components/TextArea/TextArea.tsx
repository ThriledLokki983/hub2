import { TextAreaProps } from './TextArea.interface';
import { useControlled } from 'components/helpers/utils';

import React, { MutableRefObject, useState, forwardRef, useCallback } from 'react';

const MAX_TEXTAREA_LENGTH = 1000;

import styles from './TextArea.module.scss';
import mergeRefs from 'helpers/mergeRefs';

const TextArea = forwardRef<HTMLDivElement, TextAreaProps>(({
  name = 'description',
  defaultValue = '',
  value: valueProp,
  onChange,
  onKeyDown,
  onBlur,
  onFocus,
  rows = 5,
  required = false,
  maxLength = MAX_TEXTAREA_LENGTH,
  ...props
}, ref) => {
  const [textAreaText, setTextAreaText] = useState(defaultValue || '');
  const [keyboardFocus, setKeyboardFocus] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const [value, setValue] = useControlled(valueProp, defaultValue);
  const textAreaRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const inputRef: MutableRefObject<any> = React.useRef(null);

  const handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setTextAreaText(value);
    setValue(value);

    if (typeof onChange === 'function') {
      onChange?.(value, event);
    }
  };

  const handleInputBlur = useCallback(
    (event: React.FocusEvent<HTMLTextAreaElement>) => {
        onBlur?.(event);
        if (containerRef.current && (containerRef.current as HTMLElement).contains(event.target)) {
            return;
        }
        // setKeyboardFocus(false);
        setFocus(false);
    },
    [onBlur]
  );

  const handleInputFocus = useCallback(
    (event: React.FocusEvent<HTMLTextAreaElement>) => {
        onFocus?.(event);
    },
    [onFocus]
  );

  const showCharactersLeft = textAreaText.length >= maxLength
    || textAreaText[textAreaText.length - 1] === '.'
    || textAreaText[textAreaText.length - 1] === '\n';

  return (
    <div ref={ref}>
      <textarea
        className={styles.root}
        value={textAreaText}
        name={name}
        maxLength={maxLength}
        rows={rows}
        required={required}
        onChange={handleOnChange}
        ref={mergeRefs(textAreaRef, inputRef)}
        {...props}
      />
      <span className={styles.root__charactersleft} data-hidden={showCharactersLeft}>
        <strong>{maxLength - textAreaText.length}</strong> characters remaining
      </span>
    </div>
  );
});

export default TextArea;
