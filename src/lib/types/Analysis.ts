import { FiltersDTO, OperatorDTO } from "./Filter";

export interface IAnalysisResult {
  table: ITableResult;
  indicator: IndicatorDTO;
}

export interface ITableResult {
  headers: IHeader[];
  rows: ITableRow[];
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

export interface ITableCell {
  colspan?: number
  rowspan?: number
  className: string
  value: string
}

export type ITableRow = ITableCell[]

export interface IHeader {
  title: string;
  properties: IProperties;
}

export interface IProperties {
  className: string;
  colspan?: number;
  rowspan?: number;
  html: string;
}

export interface IndicatorDTO {
  code?: number;
  name: string;
  areaCode: number;
  companyId: number;
  filters: FiltersDTO;
  // filtersFunction: FiltersFunction; // TODO: MAP THIS WHEN IMPLEMENTING FILTERS FUNCTION
  fields: FieldDTO[];
  // analysisComments: AnalysisComments; // TODO: MAP THIS WHEN IMPLEMENTING AnalysisComments
  // AnalysisUserPermissions: AnalysisUserPermission[]; // TODO: CODE THIS WHEN IMPLEMENTING ANALYSIS PERMISSIONS
  // analysisGroupPermissions: AnalysisGroupPermissions[]; // TODO: CODE THIS WHEN IMPLEMENTING ANALYSIS PERMISSIONS
  fileName: string;
  searchClause: string;
  fixedConditionClause: string;
  fromClause: string;
  whereClause: string;
  groupClause: string;
  orderClause: string;
  dimensionFilters: string;
  metricSqlFilters: string;
  metricFilters: string;
  scheduled: boolean;
  scheduledCode: number | null;
  filterTable: string;
  temporaryFrozenStatus: boolean;
  frozenStatus: boolean;
  panelCode: number;
  connectionId: string;
  databaseType: number | null;
  tenantId: string;
  multidimensional: boolean;
  currentView: string;
  dateFormat: string;
  leftCoordinates: number;
  topCoordinates: number;
  height: number;
  width: number;
  isMaximized: boolean;
  isOpen: boolean;
  // restrictions: Restrictions; // TODO: MAP THIS WHEN IMPLEMENTING restrictions
  partialTotalizations: PartialTotalizationsDTO;
  usesSequence: boolean;
  tableType: number;
  metricDimensionRestrictions: MetricDimensionRestrictionDTO[]; 
  colorAlerts: ColorsAlertDTO;
  panelIndex: number;
  hasData: boolean;
  originalCode: number;
  originalIndicator: number | null;
  inheritsRestrictions: boolean;
  inheritsFields: boolean;
  replicateChanges: boolean;
}

export interface MetricDimensionRestrictionDTO {
  metricId: number;
  dimensionIds: number[];
}

export interface FieldDTO {
  fieldId: number;
  indicatorId: number;
  name: string;
  title: string;
  nickname: string;
  expression: boolean;
  drillDownSequence: number;
  visualizationSequence: number;
  defaultField: string;
  order: number;
  delegateOrder?: number;
  tableNickname: string;
  orderDirection: string;
  numDecimalPositions: number;
  totalizingField: boolean;
  verticalAnalysis?: boolean;
  verticalAnalysisType: string;
  horizontalAnalysis?: boolean;
  horizontalAnalysisType: string;
  aggregationType: string;
  accumulatedParticipation?: boolean;
  accumulatedValue?: boolean;
  lastColorValueList?: boolean;
  dataType: string;
  fieldType: string;
  displayLocation: number;
  columnWidth: number;
  columnAlignment: string;
  sumLine: boolean;
  accumulatedLine?: string;
  dateMask?: string;
  partialTotalization: boolean;
  partialMedia?: boolean;
  partialExpression?: boolean;
  partialTotalExpression?: boolean;
  applyTotalizationExpression?: boolean;
  generalFilter: number;
  requiredField?: boolean;
  horizontalParticipation: boolean;
  horizontalParticipationAccumulated: boolean;
  accumulatedOrder: number;
  accumulatedOrderDirection: string;
  mediaLine?: boolean;
  childField?: boolean;
  fixedValue: boolean;
  calculatorPerRestriction?: boolean;
  replicateChanges?: boolean;
  dependentCalculatedFields?: FieldDTO[];
  navigableUpwards?: boolean;
  drillDown: boolean;
  drillUp?: boolean;
  navigable?: boolean;
  deleted?: boolean;
  numberOfSteps?: number;
}

interface ColorsAlertDTO {
  colorAlertList: ColorAlertDTO[];
}
interface ColorAlertDTO {
  sequence: number;
  firstField: FieldDTO;
  firstFieldFunction: string;
  operator: OperatorDTO;
  firstValue: string;
  secondValue: string;
  valueType: string;
  secondField: FieldDTO;
  secondFieldFunction: string;
  action: string;
  alertProperty: AlertPropertyDTO;
  compareToAnotherField: boolean;
}

interface AlertPropertyDTO {
  fontName: string;
  fontSize: number;
  fontStyle: string;
  fontColor: string;
  cellBackgroundColor: string;
}

export type AnalysisResponse = {
  table: any;
  indicator: IndicatorDTO;
}

export interface PartialTotalizationsDTO {
  totalizationList: PartialTotalizationDTO[];
}

interface PartialTotalizationDTO {
  field: FieldDTO;
  values: any[][];
  partialTotalization: number;
  sequence: number;
}

export enum OrderTypes {
  ASC =  'ASC',
  DESC = 'DESC'
}