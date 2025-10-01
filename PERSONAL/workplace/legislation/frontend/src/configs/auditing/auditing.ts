import { UserProfile } from "hooks/interfaces";

interface ProjectChanges {
  new_value: string;
  old_value: string;
  section: string;
}

interface LegislationChanges {
  new_value: string;
  old_value: string;
  section: string;
}

interface LogsInterface<T> {
  action: string;
  changes: T[];
  identifier: string;
  timestamp: string;
  user: UserProfile
}

interface TableInterface {
  date: string;
  section: string;
  updatedBy: string;
  updatedField: string;
  previousValue: string;
  newValue: string;
  action: string;
}

const projectPairs = {
  "profile": "Admin setup",
  "description": "Client details",
  "name": "Client details",
  "starting_date": "Client details",
  "is_published": "Content configuration",
  "created": "New Project"
}

export const formatProjectLogsData = (data: LogsInterface<ProjectChanges>[]): TableInterface[] => {
  return data.map((item) => {
    if (typeof item.changes === "string") {
      try {
        item.changes = JSON.parse(item.changes);
      } catch (error) {
        console.error("Error parsing 'changes':", error);
      }
    }
    if (item.action === 'created') {
      return {
        ...item,
        changes: [ { section: 'created', new_value: 'Created', old_value: null }]
      }
    }
    return item;
  }).map((item) => ({
    date: item.timestamp,
    section: projectPairs[item.changes.at(0)?.section as keyof typeof projectPairs] || item.changes.at(0)?.section || 'Unknown',
    updatedBy: `${item.user.first_name} ${item.user.last_name}` || 'Unknown',
    updatedField: item.changes.at(0)?.section || '',
    previousValue: item.changes.at(0)?.old_value || '',
    newValue: item.changes.at(0)?.new_value || '',
    action: item.action || '',
  })).sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};


const legislationPairs = {
  "background": "Role Specific Details",
  "pwc_territory": "General Details",
  "name_local": "General Details",
  "name_generic": "General Details",
  "abbreviation": "General Details",
  "pwc_jurisdiction": "General Details",
  "additional_links": "General Details",
  "issuingjurisdiction": "General Details",
  "geographicalscope": "General Details",
  "non_compliance_risk": "General Details",
  "legislationtype": "General Details",
  "type": "General Details",
  "topic": "General Details",
  "noncomplianceconsequence": "General Details",
  "jobrole": "General Details",
  "productservice": "General Details",
  "effective_date": "General Details",
  "responsible_party": "General Details",
  "responsible_authority": "General Details",
  "summary": "General Details",
  "scope": "General Details",
  "non_compliance": "General Details",
  "legislation_link": "General Details",
  "preparation_state": "Role specific details",
  "regulatoryrequirement": "Requirement Type",
  "registrationrequirement": "Requirement Type",
  "reportingrequirement": "Requirement Type",
};

export const formatLegislationLogsData = (data: LogsInterface<LegislationChanges>[]): TableInterface[] => {
  const finalData: TableInterface[] = [];

  data.forEach((item,) => {
    if (item.changes.length) {
      item.changes.map((change) => {
        finalData.push({
          date: item.timestamp,
          section: legislationPairs[change.section as keyof typeof legislationPairs] || change.section || 'Unknown',
          updatedBy: `${item.user.first_name} ${item.user.last_name}`,
          updatedField: change.section.replaceAll('_', ' '),
          previousValue: change.old_value?.replaceAll('"'," ")?.replaceAll('_'," "),
          newValue: change.new_value?.replaceAll('"'," ")?.replaceAll('_'," "),
          action: item.action,
        });
      });
    } else {
      finalData.push({
        date: item.timestamp,
        section: 'Legislation',
        updatedBy: `${item.user.first_name} ${item.user.last_name}`,
        updatedField: 'Legislation',
        previousValue: 'N/A',
        newValue: 'N/A',
        action: item.action,
      });
    }
  });

  return finalData.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }); // sort by date
};
