import { useEffect, useState } from "react";
import { Key } from "react-aria-components";
import { remapTeamMember } from "helpers/projects/projects";

import { Client, EditComponentProps } from "../interfaces";
import { ProfileSearch } from "components/index";

import GroupMembers, { ProjectOwners } from "../GroupMembers/Groupmembers";
import styles from './Admin.module.scss';
import { UserInterface } from "hooks/interfaces";


const AdminSetupEditTab = ({
  project,
  selectedIndex,
  onSelectionChange,
  user,
}: EditComponentProps & {
  onSelectionChange: (role: Key, data: Client, allMembers: Client[]) => void;
  user: UserInterface;
}) => {

  const [groupedMembers, setGroupedMembers] = useState<any>([]);
  const [projectMembers, setProjectMembers] = useState<Client[]>([]);
  const [projectOwners, setProjectOwners] = useState<Client[] | []>(project.project_owner_list || []);

  /**
   * Remap the team members to include their roles.
   */
  useEffect(() => {
    const allOwnerIdentifiers = project.project_owner_list?.map((m) => m.identifier) || [];
    const allOwners = project.project_owner_list
      ?.map((m) => ({ ...remapTeamMember(m), role: 'project owner'}));
    const allTeamMembers = [ ...(project.team_member_list || []), ...(project.client_member_list || [])]
      ?.map((m) => ({ ...remapTeamMember(m), role: m.groups[0] || 'preparer'}))
      .filter((m) => !allOwnerIdentifiers.includes(m.identifier));

      setProjectMembers([ ...(allTeamMembers || []), ...(allOwners || [])]);
      setProjectOwners([...(allOwners || [])]);
    }, [project]);


  /**
   * Handles new client member added.
   * @param member
   */
  const onProjectMemberAddHandler = (member: any) => {
    if (!projectMembers.find((m: Client) => m.email === member.email)) {
      const formattedTeam = [...projectMembers, member].map((m) => ({
        ...remapTeamMember(m),
        role: m.role || m.groups[0] || 'preparer',
      }));
      setProjectMembers(formattedTeam);
      onSelectionChange(member.groups[0]?.toLowerCase() || 'preparer', member, [...formattedTeam,...projectOwners]);
    }
  };

  /**
   * Handles team member removed.
   */
  const onProjectMemberRemoveHandler = (member: any) => {
    setProjectMembers(projectMembers.filter((m: Client) => m.email !== member.email));
  }


  /**
   * Handles changing the role of the project member accordingly
   */
  const onProjectMemberUpdateHandler = (role: Key, member: Client) => {
    if (!member.identifier || !role) {
      alert('The selected role or team member is not known to this tool');
      return;
    }

    if ((role as string).toLowerCase() === 'project owner') {
      const newTeam = [...projectMembers.filter((m) => m.identifier !== member.identifier), { ...member, role: role as string }];
      setProjectMembers(newTeam);
      setProjectOwners([...projectOwners, { ...member, role: role as string }]);
      onSelectionChange(role || 'preparer', member, newTeam);
    }

    if (['preparer', 'approver'].includes((role as string).toLowerCase())) {
      const alreadyExist = projectMembers.find((m) => m.identifier === member.identifier);
      if (!alreadyExist) return;

      const newTeam = [...projectMembers.filter((m) => m.identifier !== member.identifier), { ...member, role: role as string }];
      setProjectMembers(newTeam);
      setProjectOwners(projectOwners.filter((m) => m.identifier !== member.identifier));
      onSelectionChange(role || 'preparer', member, newTeam);
    }
  };


  /**
   * Group members based on their roles.
   */
  useEffect(() => {
    const uniqueRoles = Array.from(new Set(['approver', 'preparer']));

    setGroupedMembers(uniqueRoles.map((role: string | undefined) => {
      return {
        role,
        subtitle: role?.toLowerCase() === 'approver' || role?.toLowerCase() === 'project owner'
          ? 'Master admins can do any content modifications within a client\'s environment and also publish the changes to the client\'s view.'
          : 'General admins can modify the content within a client\'s environment. ',
        members: projectMembers
          .filter((member: Client) => member.role?.toLowerCase() === role?.toLowerCase())
      }
    }));
  },[projectMembers]);


  return (
    <section className={styles.root__admin_setup} data-hidden={!(selectedIndex === 2)} data-create-content>
      <header data-header>
        <ProfileSearch
          id="team_members"
          label="invite admins"
          subLabel=""
          placeholder="Assign project admins through email"
          disabledEntries={[]}
          scrollOnFocus={true}
          onSelect={onProjectMemberAddHandler}
          data-allow-search={user.is_admin && user.is_approver}
        />
      </header>
      <article data-div-group>
        <GroupMembers
          groups={groupedMembers}
          onUpdateHandler={onProjectMemberUpdateHandler}
          onClientMemberRemoved={onProjectMemberRemoveHandler}
          type={user.is_approver ? 'edit' : 'details'}
        />
        <ProjectOwners
          projectOwners={projectOwners}
          onUpdateHandler={onProjectMemberUpdateHandler}
          onClientMemberRemoved={onProjectMemberRemoveHandler}
          type={user.is_approver ? 'edit' : 'details'}
        />
      </article>
    </section>
  );

};

export default AdminSetupEditTab;
