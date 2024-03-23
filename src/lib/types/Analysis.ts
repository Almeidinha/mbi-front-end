import { FiltersDTO, GenericFilter } from "./Filter";
import { BIUserGroupIndDTO, BIUserIndDTO } from "./User";

export interface IAnalysisResult {
  table: ITableResult;
  indicator: BIIndLogicDTO;
}

export interface ITableResult {
  headers: IHeader[];
  rows: IResultTableRow[];
  styles: ITableStyles[];
  title: {
    drillup: any[],
    style: IStyle;
  };
}

export interface ITableStyles {
  [className: string]: {
    [property: string]: string;
  };
}

export interface IStyle {
  [property: string]: string | boolean | Number | undefined;
}

export interface IResultTableRow {
  className: string;
  values: string;
}

export interface IHeader {
  title: string;
  properties: IProperties;
}

export interface IProperties {
  className: string;
  colSpan: number;
  rowSpan: number;
  html: string;
}

export interface BIIndLogicDTO {
  id?: number;
  companyId: number;
  name: string;
  areaId: number;
  fileName?: string;
  graphTitle?: string;
  scheduled?: boolean;
  defaultGraph?: number;
  lastUpdatedUser?: number;
  comment?: string | null;
  isFrozen?: boolean;
  defaultDisplay?: string;
  connectionId?: string;
  numberOfSteps?: number;
  usesSequence?: boolean;
  tableType?: number;
  originalIndicator?: number;
  inheritsFields?: boolean;
  inheritsRestrictions?: boolean;
  biSearchClause: GenericFilter;
  biFromClause: GenericFilter;
  biWhereClause: GenericFilter;
  biGroupClause?: GenericFilter;
  biOrderClause?: GenericFilter;
  biHavingClause?: GenericFilter;
  biFixedConditionClause?: GenericFilter;
  biDimensionFilter?: GenericFilter;
  biIndMetricFilter?: GenericFilter;
  biIndSqlMetricFilter?: GenericFilter;
  biIndAlertColors?: BIIndAlertColorDTO[];
  biAnalysisFields: Field[];
  biColorConditions?: BIColorConditionsDTO[];
  filtersDTO?: FiltersDTO;
  biUserIndicators?: BIUserIndDTO[];
  biUserGroupIndicators?: BIUserGroupIndDTO[];
}

export interface Field {
  fieldId?: number;
  indicatorId?: number;
  name: string;
  title: string;
  fieldType: string;
  dataType: string;
  nickname: string;
  expression: boolean;
  filterSequence: number;
  visualizationSequence: number;
  defaultField: string;
  fieldOrder: number;
  tableNickname: string;
  direction: string;
  decimalPosition?: number;
  fieldTotalization: boolean;
  vertical: string;
  aggregationType: string;
  accumulatedShare?: string;
  fieldColor?: string;
  defaultGraph?: string;
  ignoreZeros?: string;
  accumulatedValue: boolean;
  localApres?: number;
  columnWidth: number;
  columnAlignment?: string;
  horizontal: string;
  lineFieldTotalization?: boolean;
  accumulatedLineField?: boolean;
  tendencyLine?: string;
  tendencyLineColor?: string;
  dateMask?: string;
  partialTotalization: boolean;
  numberOfSteps?: number;
  ganttGraphPosition?: number;
  ganttGraphColor?: string;
  horizontalParticipation: boolean;
  accumulatedHorizontalParticipation?: boolean;
  accumulatedOrder: number;
  accumulatedOrderDirection: string;
  usesLineMetric?: boolean;
  fixedValue: boolean;
  locApresGraph?: number;
  graphType?: string;
  firstGraphType?: string;
  secGraphType?: string;
  referenceAxis?: string;
  graphVisualizationSequence?: number;
  originalAnalysisField?: number;
  drillDown: boolean;
  generalFilter: number;
  mandatoryFilter?: boolean;
  delegateOrder?: number;
}

interface BIIndAlertColorDTO {
  alertSequence: number;
  indicatorId: number;
  firstFieldId: number;
  firstFieldFunction: string;
  operator: string;
  valueType: string;
  firstValueReference: string;
  secondValueReference: string;
  secondFiled?: number;
  secondFiledFunction?: string;
  action: string;
  fontName: string;
  fontSize?: number;
  fontStyle: string;
  fontColor: string;
  backgroundColor: string;
}


interface BIColorConditionsDTO {
  indicatorId: number;
  fieldId: number;
  initialValue: number;
  finalValue: number;
  classDescription: string;
  fontColor: string;
  backgroundColor: string;
}

export type AnalysisResponse = {
  table: any;
  indicator: BIIndLogicDTO;
}