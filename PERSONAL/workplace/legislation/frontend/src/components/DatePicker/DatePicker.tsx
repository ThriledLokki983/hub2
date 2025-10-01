import { MyDatePickerProps } from './DatePicker.interface';

import {
  Calendar, CalendarCell, CalendarGrid,
  DateInput, DatePicker, DateSegment, DateValue,
  Dialog, Group, Heading, Label, Popover, Text, FieldError,
} from 'react-aria-components';
import { Button, CustomCheckbox, IconComponent } from 'components';
import ChevronIcon from 'assets/icons/left-chevron-outline.svg?react';
import { useState } from 'react';
import { parseDate } from '@internationalized/date';
import styles from './DatePicker.module.scss';

const TODAY = new Date();
const TODAY_ISO = TODAY.toISOString().split("T")[0];

const CustomDatePicker = <T extends DateValue>({
  name,
  label,
  subLabel,
  description,
  errorMessage,
  showCheckbox = false,
  variation = "transparent",
  onInputChange,
  ...props
}: MyDatePickerProps<T>) => {
  const [date, setDate] = useState<any>(props.value || props.defaultValue || parseDate(TODAY_ISO));
  const [selected, setSelection] = useState<boolean>(false);

  return (
    <DatePicker
      className={styles.root__date}
      data-variation={variation}
      value={date}
      onChange={(date) => {
        setDate(date);
        onInputChange?.(name, date.toString());
      }}
      isDisabled={selected}
      {...props}
    >
      <Label className={styles.root__data_label}>{label}</Label>
      {showCheckbox ? (
        <CustomCheckbox data-not-applicable data-checkbox isSelected={selected} onChange={() => {
            setSelection(!selected);
            onInputChange?.(name, !selected ? null : date.toString());
          }}
        >
          <span data-not-applicable data-date>Not available</span>
        </CustomCheckbox> ) : (
          null
        )}
      {subLabel ? <Text className={styles.root__data_text} slot="description">{subLabel}</Text> : null}
      <Group>
        <DateInput>
          {(segment) => <DateSegment segment={segment} />}
        </DateInput>
        <Button variation="secondary-trans">
          <IconComponent name="CalendarIcon" />
        </Button>
      </Group>

      {description ? <Text slot="description">{description}</Text> : null}
      {errorMessage ? <FieldError>{errorMessage}</FieldError> : null}

      <Popover>
        <Dialog className={styles.root__dialog}>
          <Calendar className={styles.root__calendar}>
            <header>
              <Button variation="secondary-trans" slot="previous">
                <ChevronIcon aria-hidden="true" />
              </Button>
              <Heading />
              <Button variation="secondary-trans" slot="next">
                <ChevronIcon aria-hidden="true" />
              </Button>
            </header>
            <CalendarGrid>
              {(date) => <CalendarCell date={date} />}
            </CalendarGrid>
          </Calendar>
        </Dialog>
      </Popover>
    </DatePicker>
  );
};

export default CustomDatePicker;
