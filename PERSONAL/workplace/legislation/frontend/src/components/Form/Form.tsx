import { FormEvent, forwardRef, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Button, FieldError, Form, Input, Label, TextField } from 'react-aria-components';
import { MyFormProps } from './Form.interface';
import styles from './Form.module.scss';

const FORM_ID = 'sln-general-form-id';


const CustomForm = forwardRef<HTMLFormElement, MyFormProps>(({
  id,
  data,
  disabledFields = [],
  hiddenGroups = [],
  onSubmit,
  onChange,
  children,
  ...props
}, ref) => {
  const [isChecked, setIsChecked] = useState(true);

  /**
   * Handle form input changes.
   * @NOTE: this handler is currently disabled when there are `disabledFields`,
   * since they will be disregarded when using FormData. This setup works in `Meet/Edit`,
   * so leaving this as is, but should be refined in the future if more fields become
   * editable there.
   */
  const formInputHandler = (e: FormEvent) => {
    if (disabledFields.length || disabledFields.includes((e.target as HTMLInputElement).name)) {
      return;
    }

    if (typeof onChange === 'function') {
      onChange(e);
    }
  };

   /**
   * Handle form submits.
   */
  const formSubmitHandler = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };


  return (
    <Form
      className={styles.root}
       id={id || FORM_ID}
       ref={ref} {...props}
       onSubmit={formSubmitHandler}
      >
      {children}
    </Form>
  );

});

export default CustomForm;
