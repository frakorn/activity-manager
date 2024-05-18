export interface ITaskColumns {
  dataField: string;
  label: string;
  template?: string;
  width?: number;
  dataType: string;
  groupIndex?: number;
}

export enum AppInfo {
  TITLE = 'Activity App',
  FETCH_BTN = 'Fetch Activity',
  ITEM_DONE = 'Item marked as done:'
}

export enum AppAnimationClass {
  ACTIVE = 'active'
}

export interface IAppState {
  isLoading?: boolean;
  animation?: AppAnimationClass.ACTIVE | '';
  smallScreenSize?: boolean
}