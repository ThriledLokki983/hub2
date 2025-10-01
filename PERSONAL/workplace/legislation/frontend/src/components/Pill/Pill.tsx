import { useState, useEffect } from 'react';
import { PillProps } from './Pill.interface';

const Pill = ({ data, pillName, onChange = undefined, ...props }: PillProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(data.checked || false);

  const toggleRoleButton = (e: any) => {
    setIsChecked(e.target.checked);
    onChange && onChange(e);
  };

  useEffect(() => {
    setIsChecked(data.checked);
  }, [data.checked]);

  return (
    <div key={`role-${data.label || data.name || ''}`} data-icon {...props}>
      <label data-is-checked={data.checked} aria-label={data.label || data.name || ''} data-icon {...props}>
        <span>{data.label || data.name || ''}</span>
        <input
          type="checkbox"
          name={pillName ? `${pillName}_data_${data.name?.toLowerCase().replaceAll(' ', '_')}` : (data.name || 'default')}
          value={data.name}
          data-identifier={data.identifier}
          data-category={pillName}
          defaultChecked={isChecked}
          onChange={(e: any) => toggleRoleButton(e)}
        />
      </label>
    </div>
  );

};

export default Pill;
