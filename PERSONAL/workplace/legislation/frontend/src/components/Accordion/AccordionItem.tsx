import { useRef } from 'react';
import { KEY_VALUES } from 'configs/constants';
import { highlight } from 'helpers/utils';

import SlideDown from './SlideDown';
import { Button, IconComponent } from '..';

import { FILTER_ICONS, IconName } from 'configs/constants';
import { AccordionItemProps } from './AccordionItem.interface';

import accordionItemStyles from './AccordionItem.module.scss';
import styles from './Accordion.module.scss';


const AccordionItem: React.FC<AccordionItemProps> = ({
  itemKey,
  expanded = false,
  templateHeader,
  onClickEvent,
  title,
  accordionHeaderId,
  excludeElementToToggle,
  toggleFromBody = false,
  toggleFromHeaderIconOnly,
  inclElementToToggle,
  isLarge = false,
  isNew = false,
  onRemove,
  contentTitle,
  description,
  query,
  isEmpty,
  children,
  ...rest
}: AccordionItemProps) => {

  const contentRef = useRef(null);
  const getClosestElement = (target: HTMLElement, name: string): HTMLElement => {
    return target.closest(name) as HTMLElement;
  }

  const focusElementSelector = (name: string, element?: HTMLElement): void => {
    ((element as HTMLElement).querySelector(name) as HTMLElement)?.focus();
  }

  const onKeyDownEvent = (event: React.KeyboardEvent<HTMLLIElement>) => {
    const target = event.target as HTMLElement;
    if (target.nodeName === 'TEXTAREA') {
      return;
    }

    let nextEle, previousEle;
    let childEles;
    switch (event.key) {
        case KEY_VALUES.ENTER:
        case KEY_VALUES.SPACE:
            event.preventDefault();
            onClickEvent?.(event, itemKey);
            break;
        case KEY_VALUES.DOWN:
            event.preventDefault();
            nextEle = getClosestElement(target, `.${accordionItemStyles.root}`)?.nextElementSibling;
            if (!nextEle) {
                nextEle = getClosestElement(target, `.${styles.root}`)?.firstChild;
            }
            nextEle && focusElementSelector(`.${accordionItemStyles.root__toggle}`, nextEle as HTMLElement);
            break;
        case KEY_VALUES.UP:
            event.preventDefault();
            previousEle = getClosestElement(target, `.${accordionItemStyles.root}`)?.nextElementSibling;
            event.preventDefault();
            previousEle = getClosestElement(target, `.${accordionItemStyles.root}`)?.previousElementSibling;
            if (!previousEle) {
                const childEles = getClosestElement(target, `.${styles.root}`)?.children;
                previousEle = childEles && childEles[childEles.length - 1];
            }
            ((previousEle as HTMLElement).querySelector(`.${accordionItemStyles.root__toggle}`) as HTMLElement)?.focus();
            previousEle && focusElementSelector(`.${accordionItemStyles.root__toggle}`, previousEle as HTMLElement);
            break;
        case KEY_VALUES.HOME: {
            event.preventDefault();
            childEles = getClosestElement(target, `${styles.root}`)?.children;
            const firstAccordionEle = childEles && childEles[0];
            firstAccordionEle && focusElementSelector(`.${accordionItemStyles.root__toggle}`, firstAccordionEle as HTMLElement);
            break;
          }

        case KEY_VALUES.END: {
            event.preventDefault();
            childEles = getClosestElement(target, `.${styles.root}`)?.children;
            const lastAccordionEle = childEles && childEles[childEles.length - 1];
            lastAccordionEle && focusElementSelector(`.${accordionItemStyles.root__toggle}`, lastAccordionEle as HTMLElement);
            break;
          }
    }
  }

  const clickEvent = (event: React.MouseEvent<HTMLElement>) => {
    const target = (event?.target as HTMLElement);

    if (!target) return;

    // TODO: Will have to double check and make this work well as it it is a bit weird now
    const isNotAllowed = !((target as HTMLElement)?.parentElement?.dataset?.accordionItem === 'true')
      && !((target as HTMLElement)?.parentElement?.dataset.accordion === 'true')
      && !((target as HTMLElement)?.parentElement?.dataset.icon === 'true')
      && !((target as HTMLElement)?.parentElement?.dataset.roleView === 'true')
      && !((target as HTMLElement)?.parentElement?.dataset?.title === 'true');

    const notAllowedButton = target.nodeName === 'BUTTON' && (event.target as HTMLElement)?.dataset.actionBtn === undefined;


    if (isNotAllowed || notAllowedButton) {
      return;
    }

    if (excludeElementToToggle && target.closest(excludeElementToToggle)) {
      return;
    }
    if (!inclElementToToggle) {
      if (!toggleFromBody && target.closest(`.${accordionItemStyles.root__content}`)) {
        return;
      }
    } else {
      if (!toggleFromBody && target.closest(`.${accordionItemStyles.root__content}`) && !target.closest(inclElementToToggle)) {
        return
      }
    }

    onClickEvent?.(event, itemKey);
  }

  // Ensure that customChild.icon is a valid key of ICONS
  const iconName = title?.split(' ').at(0) as IconName;
  const icon = FILTER_ICONS[iconName];


  /**
   * Render the extra info when there is no title provided
   * @returns
   */
  const notTitleIntro = () => {
    return (
      <div className={accordionItemStyles.root__intro} data-title>
        <h5 dangerouslySetInnerHTML={{ __html: highlight(contentTitle, query) }} data-title></h5>
        <span dangerouslySetInnerHTML={{ __html: highlight(description, query) }} data-subtitle>
        </span>
      </div>
    );
  };


  /**
   * Render the title content
   */
  const renderTitle = (title: string) => {
    return title ? (
      <span data-title>{title}</span>
      ) : (
      <span data-title-extra>{templateHeader?.()}</span>
      )
  };

  const renderRemoveButton = () => {
    return (
      <Button
        variation="transparent"
        size="small"
        title={`Remove ${title || contentTitle}`}
        onClick={onRemove}
        data-delete-item
        data-is-hidden={!isNew && !expanded}
      >
        <IconComponent name="DeleteFillIcon" />&nbsp;
        Remove
      </Button>
    );

  };


  return (
    <li
      data-item={itemKey}
      onClick={clickEvent}
      className={accordionItemStyles.root}
      onKeyDown={onKeyDownEvent}
      title={`${title || contentTitle}`}
      data-title
      {...rest}
    >
      <div
        className={`${accordionItemStyles.root__toggle} ${toggleFromHeaderIconOnly ? `${accordionItemStyles.root__cursordefault}` : ''}`}
        tabIndex={toggleFromHeaderIconOnly ? undefined : 0}
        id={accordionHeaderId}
        role={"tab"}
        aria-expanded={toggleFromHeaderIconOnly ? undefined : expanded}
        aria-selected={toggleFromHeaderIconOnly ? undefined : expanded}
        aria-controls={toggleFromHeaderIconOnly ? undefined : itemKey}
        data-large-content={isLarge}
        data-accordion-item
      >
        {icon ? <IconComponent name={icon} data-icon /> : null}
        {title ? renderTitle(title) : notTitleIntro() }
        {/* {!title ? notTitleIntro() : null} */}
       <div
        // aria-hidden
        data-rotate={expanded}
        data-icon
        aria-label="toggle-icon"
        className={accordionItemStyles.root__iconcontainer}
        role={toggleFromHeaderIconOnly ? 'button' : undefined}
        tabIndex={toggleFromHeaderIconOnly ? 0 : undefined}
        aria-expanded={toggleFromHeaderIconOnly ? expanded : undefined}
        aria-selected={toggleFromHeaderIconOnly ? expanded : undefined}
        aria-controls={toggleFromHeaderIconOnly ? itemKey : undefined}
       >
        <span className={styles.root__classesicon} data-icon>
          {!isLarge && !isEmpty ? (
            <Button variation="transparent" data-action-btn data-not-large>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 7" fill="none">
                <path d="M0.846141 1.007C0.717953 1.13519 0.717953 1.34301 0.846141 1.4712L5.99995 6.625L11.1542 1.4712C11.2181 1.40688 11.25 1.32288 11.25 1.23888C11.25 1.15488 11.2181 1.07088 11.1542 1.007C11.026 0.878815 10.8182 0.878815 10.69 1.007L5.99995 5.69705L1.31033 1.007C1.18214 0.878815 0.97433 0.878815 0.846141 1.007"/>
              </svg>
            </Button>
          ) : expanded && !isEmpty ? (
            <>
              {renderRemoveButton()}
              <Button variation="transparent" data-action-btn>
                <IconComponent name="MinusFillIcon" />
              </Button>
            </>
          ) : !isEmpty ? (
            <>
              {renderRemoveButton()}
              <Button variation="transparent" data-action-btn>
                <IconComponent name="PlusFillIcon" data-delete-mode={isNew}/>
              </Button>
            </>
          ) : null
          }
        </span>
       </div>
      </div>
      {<SlideDown>
        {expanded ? (
          <div
            id={itemKey}
            role={"tabpanel"}
            tabIndex={toggleFromBody ? 0 : undefined}
            ref={contentRef}
          >
            {children}
          </div >
        ) : null}
      </SlideDown>}

  </li >
  )
}

export default AccordionItem
