
export enum FilterType {
  DIMENSION = "DIMENSION",
  METRIC = "METRIC",
  METRIC_SQL = "METRIC_SQL",
  FUNCTION = "FUNCTION"
}

export enum FilterAction {
  ADD = "ADD",
  REMOVE = "REMOVE",
  UPDATE = "UPDATE"
}

export enum FieldTypes {
  METRIC = "M",
  DIMENSION = "D",
}

export enum FieldDataTypes {
  NUMBER = "N",
  DATA = "D",
  STRING = "S",
}

export enum FieldDefaultValues {
  YES = "S",
  NO = "N",
  ONLY_CALCULATION = "T",
}

export enum FieldColumnAlignment {
  LEFT = "E",
  RIGHT = "D",
  CENTER = "C",
}

export interface FilterBuilderInput {
  filters: FiltersDTO;
  field?: BIAnalysisFieldDTO;
  operator?: String;
  value?: String;
  link: String;
  connector?: String;
}


export interface BIAnalysisFieldDTO {
  fieldId?: number;
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
  decimalPositions?: number;
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
  displayLocation?: number;
  columnWidth: number;
  columnAlignmentPosition?: string;
  sumLine?: boolean;
  accumulatedLine?: string;
  dateMask?: string;
  partialTotalization?: boolean;
  partialMedia?: boolean;
  partialExpression?: boolean;
  partialTotalExpression?: boolean;
  applyTotalizationExpression?: boolean;
  generalFilter: number;
  requiredField?: boolean;
  horizontalParticipation: boolean;
  horizontalParticipationAccumulated?: boolean;
  accumulatedOrder: number;
  accumulatedOrderDirection: string;
  mediaLine?: boolean;
  childField?: boolean;
  fixedValue: boolean;
  calculatorPerRestriction?: boolean;
  originalFieldCode?: number;
  replicateChanges?: boolean;
  dependentCalculatedFields?: BIAnalysisFieldDTO[];
  isNavigableUpwards?: boolean;
  drillDown: boolean;
  drillUp?: boolean;
  navigable?: boolean;
  deleted?: boolean;
}

export interface FiltersDTO {
  dimensionFilter: DimensionFilterDTO;
  metricFilters: MetricFiltersDTO;
  metricSqlFilter: MetricSqlFiltersDTO;
}


export interface DimensionFilterDTO {
  filters: DimensionFilterDTO[];
  connector: string;
  condition: ConditionDTO;
  macro: BIMacroDTO;
  macroField: BIAnalysisFieldDTO;
  drillDown: boolean;
}

export type MetricFiltersDTO = MetricFilterDTO[]

export type MetricSqlFiltersDTO = MetricFilterDTO[] 

export interface MetricFilterDTO {
  condition: ConditionDTO;
}

export interface ConditionDTO {
  valuesMap: Map<number, any>;
  valueCount: number;
  field: BIAnalysisFieldDTO;
  operator: OperatorDTO;
  value: string;
  title: string;
  SQLValue: string;
}

export interface BIMacroDTO {
  id: string;
  description: string;
  fieldType: string;
  incrementalField: number;
}

export interface OperatorDTO {
  symbol: string;
  description: string; 
}

export type GenericFilter = {
  id?: string,
  sqlText: string,
}