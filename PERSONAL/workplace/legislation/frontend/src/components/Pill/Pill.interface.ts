export interface PillProps {
  // Define your props here
  data: {
    checked: boolean,
    label: string,
    name?: string,
    identifier: string
  }
  pillName: string;
  onChange?: (e: any) => void;
  [key: string]: any;
}
