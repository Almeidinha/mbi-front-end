

export enum DisplayLocation {
  LINE = 1,
  COLUMN = 2,
  NONE = 0
}

export interface MetricRestriction {
  indicatorId: number
  metricId : number
  dimensionId : number
}