import { useEffect, useState } from "react";
import { remapTeamMember } from "helpers/projects/projects";

import GroupMembers, { ProjectOwners } from "pages/ProjectEdit/Tabs/GroupMembers/Groupmembers";
import { EditComponentProps } from "./interface";
import { Client } from "hooks/interfaces/project.interface";

import styles from "../Index.module.scss";


const AdminSetup = ({ selectedIndex, project }: EditComponentProps) => {
  const [clientMembers, setClientMembers] = useState<Client[] | []>(project?.team_member_list || []);
  const [projectOwners, setProjectOwners] = useState<Client[] | []>(project?.project_owner_list || []);
  const [groupedMembers, setGroupedMembers] = useState<any>([]);

  /**
   * Remap the team members to include their roles.
   */
  useEffect(() => {
    const members = [ ...(project.team_member_list || []), ...(project.client_member_list || [])];

    setClientMembers(members?.map((m) => ({
      ...remapTeamMember(m),
      role: m.groups[0] || 'preparer',
    })) || []);

    setProjectOwners(project.project_owner_list?.map((m) => ({
      ...remapTeamMember(m),
      role: 'project owner',
    })) || []);
  }, [project.project_owner_list, project.team_member_list, project.client_member_list]);


  /**
   * Group members based on their roles.
   */
  useEffect(() => {
    // lets make sure to always keep the project owner at the top
    const uniqueRoles = Array.from(new Set(['approver', 'preparer']));

    setGroupedMembers(uniqueRoles.map((role: string | undefined) => {
      return {
        role,
        subtitle: role?.toLowerCase() === 'approver' || role?.toLowerCase() === 'project owner'
          ? 'Master admins can do any content modifications within a client\'s environment and also publish the changes to the client\'s view.'
          : 'General admins can modify the content within a client\'s environment. ',
        members: clientMembers
          .filter((member: any) => member.role?.toLowerCase() === role?.toLowerCase())
          .filter((m) => !projectOwners.map((m) => m.identifier).includes(m.identifier)),
      }
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[clientMembers, projectOwners, groupedMembers.length]);


  const onUpdateHandler = () => {};
  const onClientMemberRemoved = () => {};


  return (
    <section className={styles.root__admin_setup} data-hidden={!(selectedIndex === 2)} data-create-content>
      <article data-div-group>
        <GroupMembers
          groups={groupedMembers}
          onUpdateHandler={onUpdateHandler}
          onClientMemberRemoved={onClientMemberRemoved}
          type="details"
        />
        <ProjectOwners
          projectOwners={projectOwners as any}
          onUpdateHandler={onUpdateHandler}
          onClientMemberRemoved={onClientMemberRemoved}
          type="details"
        />
      </article>
    </section>
  );

};

export default AdminSetup;
