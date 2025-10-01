import { useEffect, useMemo, useState } from 'react';
import { Key, ListBoxItem } from 'react-aria-components';
import { Select } from 'components';
import { TeamMemberProps } from './TeamMember.interface';

import styles from './TeamMember.module.scss';


const TeamMember = ({
  data,
  query = '',
  disabled,
  onRemove,
  onSelect,
  options = [],
  type = 'create',
  onSelectionChange,
  ...props
}: TeamMemberProps & {
  onSelectionChange?: (role: Key, data: any) => void;
}) => {

  const [selected, setSelected] = useState<Key | null>(data.role?.charAt(0).toUpperCase() + data.role?.slice(1) || data.groups[0]);

  /**
   * Handles setting the selected role.
   */
  useEffect(() => {
    setSelected(data.role?.charAt(0).toUpperCase() + data.role?.slice(1) || 'preparer');
  }, [data]);

  return (
    <article className={styles.root} data-type={type} {...props}>
      <div className={styles.root__info}>
        <p>{data.email}</p>
      </div>
      <div className={styles.root__dropdown} data-type={type}>
        <Select
          title={`Change user role for ${data.email}`}
          items={options.map((o, index) => ({ name: o, id: index }))}
          selectedKey={selected}
          onSelectionChange={selected => {
            setSelected(selected);
            onSelectionChange?.(selected, data);
            onSelect(selected, data);
          }}
        >
          {(item) => <ListBoxItem id={item.name} key={`${item.id}-${item.id}`} data-select-item>{item.name}</ListBoxItem>}
        </Select>
      </div>
    </article>
  );

};

export default TeamMember;
