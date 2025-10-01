import { Children, useEffect, useState } from 'react';
import { ProfileSearch, TeamMember } from "components";

import { UserProfile } from 'hooks/interfaces';
import { Client } from 'pages/ProjectEdit/Tabs/interfaces';
import styles from '../Projects.module.scss';
import { remapTeamMember } from 'helpers/projects/projects';
import { Key } from 'react-aria';

interface CreateTab {
  selectedIndex: number,
}

const AdminSetup = ({
  selectedIndex,
  onSelectionChange,
 }: CreateTab & {
  onSelectionChange: (role: Key, data: Client) => void;
 }) => {
  const [projectMembers, setProjectMembers] = useState<Client[]>([]);


  /**
   * Handles team member addition.
   */
  const onTeamMemberAddHandler = (member: any) => {
    if (!projectMembers.find((m: Client) => m.email === member.email)) {
      setProjectMembers([...projectMembers, member].map((m) => ({
        ...remapTeamMember(m),
        role: m.role || m.groups[0] || 'preparer',
      })));
    }
    onSelectionChange(member.groups[0].toLowerCase() || 'preparer', member);
  };


  /**
   * Handle team member removal.
   * @param user
   */
  const onTeamMemberRemoveHandler = (user: UserProfile) => {
    setProjectMembers(projectMembers.filter((team) => team.identifier !== user.identifier));
  };


  /**
   * Change the role accordingly
   */
  const onUpdateHandler = (role: Key, member: Client) => {
    if (!member.identifier || !role) {
      alert('The selected role or team member is not known to this tool');
      return;
    }

    if (member.role.toLowerCase() === 'project owner') {
      const index = projectMembers.findIndex((team) => team.identifier === member.identifier);
      if (index === -1) return;

      const newTeams = [...projectMembers];
      newTeams[index].role = member.role;

      setProjectMembers(newTeams);
      onSelectionChange(role || 'preparer', member);
    }

    if (['preparer', 'approver'].includes(member.role.toLowerCase())) {
      const index = projectMembers.findIndex((team) => team.identifier === member.identifier);
      if (index === -1) return;

      const newTeams = [...projectMembers];
      newTeams[index].role = member.role;

      setProjectMembers(newTeams);
      onSelectionChange(role|| 'preparer', member);
    }
  };


  const optionList = ['Project owner', 'Approver'];


  return (
    <section data-hidden={!(selectedIndex === 2)} data-create-content>
      <ProfileSearch
        id="team_members"
        label="Admin Users"
        subLabel="Invite pwc admin users to get access and modify the client environment and content."
        placeholder="Assign project admins through email"
        disabledEntries={[]}
        scrollOnFocus={true}
        onSelect={onTeamMemberAddHandler}
      />
      <span data-admin-title>Assigned admins</span>
      <div className={styles.root__team} data-empty={projectMembers.length === 0}>
        <ol
          hidden={false}
          aria-live="polite"
          aria-label="Admin Users"
        >
          {projectMembers.length ? Children.toArray(projectMembers.map((profile: Client, index: number) => {
            return (
              <li
                className={styles.root__person}
                data-index={index}
                tabIndex={0}
                data-is-create
              >
                <TeamMember
                  data={profile as any}
                  query={profile.email}
                  disabled={false}
                  onSelect={onUpdateHandler}
                  options={optionList}
                  onRemove={onTeamMemberRemoveHandler}
                  onSelectionChange={onSelectionChange}
                  type={profile.groups.includes('approver') ? 'create' : 'details'}
                />
                <input
                  type='hidden'
                  name={`project_${profile.role.trim().toLowerCase().replace(' ', '_')}_identifier-${index}`}
                  value={`${profile.identifier}`}
                />
              </li>
            )
          })) : <span>Please add team members using the search input above...</span>}
        </ol>

      </div>
    </section>
  );

};

export default AdminSetup;
