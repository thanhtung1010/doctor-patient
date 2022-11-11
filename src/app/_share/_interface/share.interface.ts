
export interface ITableElement {
    field: string;
    title: string;

    fieldType?:
    "text" | "dateTime" | "date" | "number" | "float" | "statusType" | "checkbox" | "select"; // plain text, date time, date, number, price

    child?: ITableElement[];
    sortField?: string;
    get?: Function;
    colSpan?: number;
    rowSpan?: number;
    translateTitle?: boolean;
    width?: number | string | null;
    align?: 'center' | 'right' | 'left';
    padding?: string;

    value?: any;
    showBum?: boolean;
    sort?: string
    isHide?: boolean;
    isLock?: boolean;
}