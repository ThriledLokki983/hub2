import { Pill } from 'components';

interface TopicListProps {
  data: any;
  name: string;
  onChange?: (e: any) => void;
  isAttentionPoint?: boolean;
  [key: string]: any;
}

const TopicList = ({ data = [], isAttentionPoint = false, name = '', onChange = undefined, ...props }: TopicListProps) => {
  const optionList = isAttentionPoint ? data.roles : data;

  return (
    <ul {...props}>
      {optionList.map((role: any, index: number) => (
        <Pill
          key={`role-${role.label || role.name}-${index}`}
          data={role}
          pillName={name}
          onChange={onChange}
          {...props}
        />
      ))}
    </ul>
  );

};

export default TopicList;
