import { Children, Fragment } from "react";
import { Key } from "react-aria-components";
import { TeamMember } from "components/index";
import { Client } from "../interfaces";

import styles from '../AdminSetupEditTab/Admin.module.scss';

interface Props {
  groups: any;
  onUpdateHandler: (role: Key, member: Client) => void;
  onClientMemberRemoved: (member: Client) => void;
  type?: "details" | "edit";
}

const GroupMembers = ({ groups, onUpdateHandler, onClientMemberRemoved, type = 'edit' }: Props) => {

  const formatAdminRoles = (role: string) => {
    return  Array
      .from(new Set([role, 'approver', 'project owner']))
      .map((r) => r.charAt(0).toUpperCase() + r.slice(1));
  };

  return (
    <Fragment>
      {Children.toArray(groups.map((group: any) => (
        <div className={styles.root__team} data-empty={group.members?.length === 0}>
          <h6>{group.role || 'preparer'} Admins <small>{group.members?.length || 0}</small></h6>
          <span data-subtitle>{group.subtitle}</span>
          {group.role.includes('preparer') ? (<br/>) : null}
          <span>&nbsp;</span>
          <ol
            hidden={false}
            aria-live="polite"
            aria-label="Admin Users"
          >
            <h6>
              {group.role.charAt(0).toUpperCase() + group.role.slice(1)}{group.members?.length > 1 ? 's' : ''}
              &nbsp;<small>{group.members?.length || 0}</small>
            </h6>
            {Children.toArray(group.members?.map((member: Client & { role: string }, index: number) => (
              <li
                className={styles.root__person}
                data-role={(type === 'edit' && group.role === 'preparer') ? group.role : type || group.role}
                data-index={index}
                tabIndex={0}
              >
                <TeamMember
                  data={member as unknown as Client}
                  query={member.email}
                  disabled={false}
                  onSelect={onUpdateHandler}
                  options={group.role === 'approver' ? formatAdminRoles(member.role || '') : ['Preparer']}
                  onRemove={() => onClientMemberRemoved(member)}
                />
                <input
                  type='hidden'
                  name={`project_${group.role}_identifier-${index + 1}`}
                  value={member.identifier}
                />
              </li>
            )))}
            <li className={styles.root__person} tabIndex={0} data-hidden={group.members.length > 0}>
              No {group.role}s have been invited to this project yet. Invite admin users and give them the {group.role} role, to give access to admins to modify legislations details.
            </li>
          </ol>
        </div>
      )))}
    </Fragment>
  );

};

export default GroupMembers;


interface OwnerProps {
  projectOwners: Client[] | [];
  onUpdateHandler: (role: Key, member: Client) => void;
  onClientMemberRemoved: (member: Client) => void;
  type?: 'details' | 'edit';
}

export const ProjectOwners = ({ projectOwners = [], onUpdateHandler, onClientMemberRemoved, type = 'edit' }: OwnerProps) => {
  return (
      <ol hidden={false} aria-live="polite" aria-label="Approvers Users" data-team>
        <h6>
          Project owner{projectOwners?.length > 1 ? 's' : ''}
          &nbsp;<small>{projectOwners?.length || 0}</small>
        </h6>
        {Children.toArray(projectOwners?.map((member: Client & { role: string }, index: number) => (
          <li
            className={styles.root__person}
            data-role={type || member.role}
            data-index={index}
            tabIndex={0}
          >
            <TeamMember
              data={member as unknown as Client}
              query={member.email}
              disabled={false}
              onSelect={onUpdateHandler}
              options={['Project owner', 'Approver']}
              onRemove={() => onClientMemberRemoved(member)}
            />
            <input
              type='hidden'
              name={`project_owner_identifier-${index + 1}`}
              value={member.identifier}
            />
          </li>
        )))}
        <li className={styles.root__person} tabIndex={0} data-hidden={projectOwners.length > 0}>
          No project owners have been invited to this project yet. Invite admin users and give them the project owner role, to give access to admins to modify legislations details.
        </li>
      </ol>
  )
};

