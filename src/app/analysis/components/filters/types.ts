
export enum ConnectorType {
  AND = "AND",
  OR = "OR"
}

export enum OperatorType {
  GREATER_THAN = "GREATER_THAN", 
  GREATER_TAN_OR_EQUAL = "GREATER_TAN_OR_EQUAL",
  LESS_THAN = "LESS_THAN",
  LESS_THAN_OR_EQUAL = "LESS_THAN_OR_EQUAL",
  EQUAL_TO = "EQUAL_TO",
  NOT_EQUAL_TO = "NOT_EQUAL_TO",
  CONTAINS = "CONTAINS",
  NOT_CONTAINS = "NOT_CONTAINS",
  STARTS_WITH = "STARTS_WITH",
}

export enum OperatorTypeValues {
  GREATER_THAN = ">", 
  GREATER_TAN_OR_EQUAL = ">=",
  LESS_THAN = "<",
  LESS_THAN_OR_EQUAL = "<=",
  EQUAL_TO = "=",
  NOT_EQUAL_TO = "<>",
  CONTAINS = "like",
  NOT_CONTAINS = "notlike",
  STARTS_WITH = "like%",
}

export enum FilterType {
  DIMENSION = "DIMENSION",
  METRIC = "METRIC",
  METRIC_SQL = "METRIC_SQL",
  FUNCTION = "FUNCTION"
}

export interface EditingFields {
  connector?: ConnectorType
  field?: number
  operator?: OperatorTypeValues
  value?: string | number
}