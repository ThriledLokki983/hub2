import { useMemo } from 'react';

import { Contact } from 'hooks/interfaces/legislation.interface';
import EmptyContactsIcon from 'assets/icons/empty-contacts.svg?react';

import styles from '../LegislationDetails.module.scss';

interface ContactTabProps {
  contacts: Contact[]
}

const ExpertContactsTab = ({ contacts = [] }: ContactTabProps ) => {
  const isEmptyContactList = useMemo(() => contacts.length === 0, [contacts.length]);
  return (
    <article className={styles.root__details}>
      {isEmptyContactList ? (
        <div className={styles.root__roles}>
          <article data-empty-roles>
            <div data-icon-block>
              <EmptyContactsIcon />
            </div>
            <h3>There is currently no expert contact details this legislation.</h3>
          </article>
        </div> ) : (
        <ul className={styles.root__teammembers}>
          {contacts?.length ? contacts?.map((team: any, index: number) => (
            <li key={`team-${team.name}-${index}`}>
              <img src={team.image} alt={team.name} />
              <div>
                <h6>{team.name}</h6>
                <span>{team.location}</span>
              </div>
            </li>
          )) : (
            <li>No expert contacts found for this legislation.</li>
          )}
        </ul>
      )}
    </article>
  );

};

export default ExpertContactsTab
