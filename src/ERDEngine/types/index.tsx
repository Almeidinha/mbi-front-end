export type GraphDict = {
  id: string;
  name: string;
  tableDict: TableDict[]
  linkDict?: LinkDict[]
  box: Box,
}

export type TableDict = {
  id: string;
  theme: string;
  name: string;
  note?: string;
  x: number;
  y: number;
  fks?: Fk[];
  fields: Field[];
  nickname?: string;
}

export type Fk = {
  pkTableName: string;
  pkColumnName: string;
  fkTableName: string;
  fkColumnName: string;
}

export type Field = {
  id: string;
  name: string;
  type: string;
  pk: boolean;
  fk: boolean;
  nickname?: string;
  unique?: boolean;
  index?: boolean;
}

export type LinkDict = {
  id: string;
  name: string;
  endpoints: Endpoint[]
}

export type Endpoint = {
  id: string;
  fieldId: string;
  relation?: string;
}

export type Box = {
  x: number;
  y: number;
  w: number;
  h: number;
  clientW: number;
  clientH: number;
}

export enum AnalyticType {
  METRIC = 'metric',
  DIMENSION = 'dimension',
}

export enum AggregationType {
  NO_AGGREGATION = 'NO_AGGREGATION',
  SUM = 'SUM',
  AVG = 'AVG',
  MIN = 'MIN',
  MAX = 'MAX',
  COUNT = 'COUNT',
  COUNT_DISTINCT = 'COUNT_DISTINCT',
}

export enum UserDataType {
  DATE = 'DATE',
  STRING = 'STRING',
  NUMBER = 'NUMBER',
}

export interface FieldType {
  key: string;
  name: string;
  type: string; // data type (int, char, etc.)
  analyticType?: AnalyticType; // analytic type (metric, dimension.)
  title?: string;
  userDataType?: UserDataType // Date, String or Number
  tableName: string;
  nickname?: string;
  tableNickname?: string;
  visualizationOrder?: number;
  drillDownLevel?: number;
  initiallyVisible?: boolean;
  aggregationType?: AggregationType;
  hasTotalField?: boolean;
  vertical?: boolean;
}

export interface TableDictState extends TableDict {
  [key: string]: any;
}

export interface LinkDictState extends LinkDict {
  [key: string]: any;
}