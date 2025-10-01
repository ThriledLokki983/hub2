import { Label, ListBox, Text, Popover, Select, SelectValue } from 'react-aria-components';
import { Button, IconComponent } from 'components';
import { MySelectProps } from './Select.interface';
import styles from './Select.module.scss';

const CustomSelect = <T extends object>({
  items = [],
  label,
  title,
  children,
  description,
  ...props
}: MySelectProps<T>) => {

  return (
    <Select
      className={styles.root}
      aria-labelledby={title}
      {...props}
    >
      {label ? (<Label>{label}</Label>) : null}
      <Button variation='transparent' data-select>
        <SelectValue />
        <span aria-hidden="true">
          <IconComponent name="DownIcon" />
        </span>
      </Button>
      {description && <Text slot="description">{description}</Text>}
      <Popover className={styles.root__popover}>
        <ListBox className={styles.root__listbox} items={items}>
          {children}
        </ListBox>
      </Popover>
    </Select>
  );

};

export default CustomSelect;
