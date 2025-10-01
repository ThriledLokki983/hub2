import { Children, Fragment, useState } from 'react';
import { TableProps } from './Table.interface';
import { Button, ButtonSet } from 'components';
import {
  Cell, Column, Row, Table, ColumnResizer, SortDescriptor,
  TableBody, TableHeader, ResizableTableContainer
} from 'react-aria-components';
import styles from './Table.module.scss';
import { IconComponent } from 'components/Icon/Icon';
import { formatDateString } from 'helpers/dateTime';


const TABLE_HEADER_KEYS: { label: string; id: string; sort: boolean }[] = [
  { label: 'Date', id: 'date', sort: true },
  { label: 'Affected section', id: "section",  sort: false },
  { label: 'Updated by', id: "updatedBy",  sort: false },
  { label: 'Updated field', id: "updatedField",  sort: false },
  { label: 'Previous value', id: "previousValue",  sort: false },
  { label: 'New value', id: "newValue",  sort: false },
  { label: 'Action', id: "action",  sort: true }
];

const TABLE_ROW_CONTENT = [
  {
    date: '6/7/2020',
    section: 'Client details',
    updatedBy: 'Cameron Williams ',
    updatedField: 'Starting date of eng...',
    previousValue: 'Client description 1...',
    newValue: 'Client description 2...',
    action: 'Edited',
  },
  {
    date: '4/7/2021',
    section: 'Content configuration',
    updatedBy: 'Gideon Nimoh Agyin',
    updatedField: 'Legislation list',
    previousValue: 'European Green Deal',
    newValue: 'nienke.swift@pwc.c...',
    action: 'Deleted',
  },
  {
    date: '11/20/2010',
    section: 'Admins',
    updatedBy: 'Ayhan Elatik',
    updatedField: 'Preparer admins',
    previousValue: 'Lorem ipsum dolor...',
    newValue: 'Dolor lorem ipsum...',
    action: 'Added',
  },
  {
    date: '1/18/2016',
    section: 'Content configuration',
    updatedBy: 'Nienke Tjalma',
    updatedField: 'Client-specific content: Eu...',
    previousValue: 'Lorem ipsum dolor...',
    newValue: 'Dolor lorem ipsum...',
    action: 'Edited',
  },
];

interface TableInterface {
  date: string;
  section: string;
  updatedBy: string;
  updatedField: string;
  previousValue: string;
  newValue: string;
  action: string;
}


const PAGE_LIMIT = 15;


const CustomTable = ({ data }: { data: TableInterface[] }) => {

  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'date',
    direction: 'ascending'
  });
  const [pageStart, setPageStart] = useState(0);
  const [pageEnd, setPageEnd] = useState(PAGE_LIMIT);


  const onNextPage = () => {
    setPageStart(pageStart + PAGE_LIMIT);
    setPageEnd(pageEnd + PAGE_LIMIT);
  };


  const onPreviousPage = () => {
    setPageStart(pageStart - PAGE_LIMIT);
    setPageEnd(pageEnd - PAGE_LIMIT);
  };

  const items = data.slice(pageStart, pageEnd).sort((a, b) => {
    const column = sortDescriptor.column as keyof typeof a;
    const aValue = a[column];
    const bValue = b[column];
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const d = aValue.localeCompare(bValue);
      return sortDescriptor.direction === 'descending' ? -d : d;
    }
    return 0;
  });

  return (
    <Fragment>
    {/* // <ResizableTableContainer className={styles.root__resizer}> */}
      <Table
        className={styles.root}
        aria-label="Project logs"
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
      >
        <TableHeader className={styles.root__table_header}>
          {Children.toArray(TABLE_HEADER_KEYS.map((header, index) => (
            <Column
              allowsSorting
              isRowHeader={index === 0}
              className={styles.root__table_column}
              id={header.id}
            >
              <div className={styles.root__wrapper}>
                <span>{header.label}</span>
                {header.sort ? (
                  <IconComponent name="SortingIcon" />
                ) : null}
              </div>
            </Column>
          )))}
        </TableHeader>
        <TableBody renderEmptyState={() => 'No content found'} className={styles.root__table_body}>
          {Children.toArray(items.map((row, index) => (
            <Row className={styles.root__table_row} key={index}>
              <Cell className={styles.root__table_cell}>{formatDateString(row.date, 'en-UK')}</Cell>
              <Cell>{row.section}</Cell>
              <Cell>{row.updatedBy}</Cell>
              <Cell>{row.updatedField}</Cell>
              <Cell>{row.previousValue}</Cell>
              <Cell>{row.newValue}</Cell>
              <Cell>{row.action}</Cell>
            </Row>
          )))}
        </TableBody>
      </Table>

      <ButtonSet data-btn-set>
        <Button
          variation="transparent"
          size="small"
          onClick={onPreviousPage}
          disabled={pageStart === 0}
        >
          <IconComponent name="DownIcon" />
        </Button>
        <span data-pages-info>{pageStart + 1} - {pageEnd < data.length ? pageEnd : data.length || 0} of {data.length || 0}</span>
        <Button
          variation="transparent"
          size="small"
          onClick={onNextPage}
          disabled={pageEnd >= data.length}
        >
          <IconComponent name="DownIcon" />
        </Button>
      </ButtonSet>
    {/* // </ResizableTableContainer> */}
    </Fragment>
  );

};

export default CustomTable;
