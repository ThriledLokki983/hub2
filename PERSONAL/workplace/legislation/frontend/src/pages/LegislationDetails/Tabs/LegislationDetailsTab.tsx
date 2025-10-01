import { useState, useEffect, useLayoutEffect, Children } from 'react';
import  { extractRequirements } from 'helpers/utils';
import { Accordion, AccordionItem, Button } from 'components/index';
import { Legislation } from 'hooks/interfaces';
import { DETAILS_REQUIREMENT } from 'configs/legislation/legislation';
import styles from '../LegislationDetails.module.scss';

interface DetailsTabProps {
  showContent?: boolean;
  legislation: Legislation;
}

const REQUIREMENT_KEYS = ["registration_requirements", 'reporting_requirements', "regulatory_requirements",];

const LegislationDetailsTab = ({ legislation }: DetailsTabProps) => {
  const [activeKeys, setActiveKeys] = useState<string[]>([]);

  const [requirements, setRequirements] = useState<any[]>([]);

  /**
   * Set the legislation requirements as a flat array
   */
  useEffect(() => {
    if (!legislation) {
      setRequirements([]);
      return;
    }

    setRequirements(extractRequirements(legislation, REQUIREMENT_KEYS) || []);
  }, [legislation]);


  /**
   * Handles accordion click event
   * @param activeKeys
   */
  const onClickAccordion = (activeKeys: string[]) => {
    setActiveKeys(activeKeys);
  };


  /**
   * Open the first accordion when the details tab is active
   */
  useLayoutEffect(() => {
    if (requirements.length) {
      setActiveKeys([requirements?.at(0)?.data[0]?.identifier || '']);
    }
  }, [requirements, requirements.length]);

  if (!legislation) {
    return null;
  }

  return (
    <article className={styles.root__article} data-content>

      <div className={styles.root__detailrow}>
        <div className={styles.root__detailheader}>
          <span data-title>Name of Legislation</span>
          <span data-title>Abbreviation</span>
          <span data-title>Name in Local Language</span>

          <span data-subtitle data-alternate>{legislation.name_generic || 'N/A'}</span>
          <span data-subtitle data-alternate>{legislation.abbreviation || 'N/A'}</span>
          <span data-subtitle data-alternate>{legislation.name_local || 'N/A'}</span>
        </div>
      </div>

      <div className={styles.root__detailrow}>
        <div className={styles.root__detailheader}>
          <span data-title>In effect</span>
          <span data-title>Applicable from</span>
          <span data-title>Applicable to</span>

          <span data-subtitle data-alternate>{legislation.is_in_effect ? 'Yes' : 'No'}</span>
          <span data-subtitle data-alternate>{legislation.effective_date || 'N/A'}</span>
          <span data-subtitle data-alternate>{legislation.effective_until || 'N/A'}</span>
        </div>
      </div>

      <div className={styles.root__detailrow}>
        <span data-title>Legislation type</span>
        <ul data-alternate>
          {legislation.type?.map((_t, _i) => (
            <li key={`type-${_t.name}-${_i}`}>&bull; &nbsp; {_t.name}</li>
          ))}
        </ul>
      </div>

      <div className={styles.root__detailrow}>
        <span data-title>Geographical scope</span>
        <ul data-alternate>
          {legislation.geographical_scope?.map((_t, _i) => (
            <li key={`type-${_t.name}-${_i}`}>&bull; &nbsp; {_t.name}</li>
          ))}
        </ul>
      </div>

      <div className={styles.root__detailrow}>
        <span data-title>Sustainability topic</span>
        <ul data-alternate>
          {legislation.topic?.map((_t, _i) => (
            <li key={`topic-${_t.name}-${_i}`}>&bull; &nbsp; {_t.name}</li>
          ))}
        </ul>
      </div>

      <div className={styles.root__detailrow}>
        <span data-title>link</span>
        <ul data-alternate>
          <li data-link>
            <Button
              variation='transparent'
              href={legislation.link.startsWith('https://') ? legislation.link : `https://${legislation.link}`}
              url={legislation.link.startsWith('https://') ? legislation.link : `https://${legislation.link}`}
            >
              {legislation.link}
            </Button>
          </li>
        </ul>
      </div>

      <div className={styles.root__detailrow}>
        <span data-title>link to additional guidance</span>
        <ul data-alternate>
          {legislation.additional_links ? (
              <li data-link>
                <a href={`${legislation.additional_links.startsWith('https://') ? legislation.additional_links : legislation.additional_links.startsWith('https://')  || '#'}`} target="_blank" rel="noreferrer">{legislation.additional_links || ''}</a>
              </li>
            ) : (
              <li>{'N/A'}</li>
            )}
        </ul>
      </div>

      <div className={styles.root__detailrow}>
        <span data-title>issuing jurisdiction</span>
        <ul data-alternate>
          {legislation.issuing_jurisdiction?.map((_i, index) => (
            <li key={`issuing_jurisdiction-${_i.name}-${index}`}>&bull;&nbsp;{_i.name}</li>
          ))}
        </ul>
      </div>

      <div className={styles.root__detailrow}>
        <span data-title>Relevant product (group) or services</span>
        <ul data-alternate>
        {legislation.product_service?.map((_i, index) => (
            <li key={`product_service-${_i.name}-${index}`}>&bull;&nbsp;{_i.name}</li>
          ))}
        </ul>
      </div>

      <div className={styles.root__detailrow}>
        <span data-title>consequences of non-compliance</span>
        <ul data-alternate>
          {legislation.non_compliance_consequence?.map((_i, index) => (
            <li key={`non_compliance_consequence-${_i.name}-${index}`}>&bull;&nbsp;{_i.name}</li>
          ))}
        </ul>
      </div>

      <div className={styles.root__detailrow}>
        <span data-title>responsible authority</span>
        <span data-subtitle data-alternate>{legislation.responsible_authority || 'N/A'}</span>
      </div>

      <div className={styles.root__detailrow}>
        <span data-title>objective of the legislation (summary)</span>
        <p data-alternate>{legislation.objective || 'N/A'}</p>
      </div>

      <div className={styles.root__detailrow}>
        <span data-title>responsible party (summary)</span>
        <p data-alternate>{legislation.responsible_party || 'N/A'}</p>
      </div>

      <div className={styles.root__detailrow}>
        <span data-title>scope of the legislation (summary)</span>
        <p data-alternate>{legislation.scope || 'N/A'}</p>
      </div>

      <div className={styles.root__detailrow}>
        <span data-title>Requirement type</span>

        {requirements.length ? <Accordion
          multiple={false}
          onClick={onClickAccordion}
          activeKeys={activeKeys}
          data-role-view
          data-requirement-view
          accordionId={'navDetails?.identifier'}
        >
          {requirements?.map((requirement, index: number) => {
            return requirement.data.map((currentRequirement: any) => (
              <AccordionItem
                key={`requirement-${currentRequirement.identifier}-${index}`}
                contentTitle={requirement.label}
                description={requirement.description}
                itemKey={currentRequirement.identifier}
                isLarge
                data-role-view
              >
                <RequirementAccordion
                  requirement={currentRequirement}
                  type={requirement.title}
                />
              </AccordionItem>
            ))
          })}
        </Accordion> : null }
      </div>
    </article>
  )
}

export default LegislationDetailsTab


const RequirementAccordion = ({ requirement, type }: { requirement: any, type: string }) => {
  const requirementData = requirement || [];
  const elements = requirement?.data_elements || '';
  let formattedText = requirement?.trigger
    .replace(/(\d+\.\s)/g, '<br />$1')
    .replace(/;\s*(<br \/>|$)/g, '.<br />');

  // Remove the leading <br /> tag if it exists
  if (formattedText && formattedText?.startsWith('<br />')) {
    formattedText = formattedText.replace(/^<br \/>/, '');
  }

  if (!Object.keys(requirementData).length) {
    return (
      <article data-accordion data-empty-content>
        <span data-intro>
          Sorry but there is no data provided for this requirement yet.
        </span>
      </article>
    );

  }

  return (
    <article data-accordion>
      <span data-intro>
        Refers to the process of officially enrolling or recording certain information with a relevant authority or organization. It typically involves providing specific details about an individual, entity, or activity to establish legal recognition or compliance.
      </span>

      {DETAILS_REQUIREMENT[type as keyof typeof DETAILS_REQUIREMENT].map((item, index) => {

        if (requirementData[item.key] && requirementData[item.key].includes('\n') && ['trigger', 'key_actions', 'data_elements'].includes(item.key)) {
          const formattedText = requirementData[item.key].split('\n');

          return (
            <div key={`requirement-${item}-${index}`} className={styles.root__detailrow}>
              <span data-title>{item.title}</span>
              <ul>
                {Children.toArray(formattedText.map((text: string, index: number) => (
                  <>
                    {text ? (
                      <li key={`requirement-${item}-${index}`} data-description-list-item>
                        <span>&bull;&nbsp;</span>
                        <span>{text}</span>
                      </li>
                    ): null}
                  </>
                )))}
              </ul>
            </div>
          )
        }

        return (
          <div key={`requirement-${item}-${index}`} className={styles.root__detailrow}>
            <span data-title>{item.title}</span>
            <p>{requirementData[item.key] === 'nan' ? 'N/A' : requirementData[item.key] || `N/A`}</p>
          </div>
        )
      })}
    </article>
  );

};
