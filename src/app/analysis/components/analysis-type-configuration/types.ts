export enum VerticalAnalysisTypes {
  DONT_APPLY = 'N',
  TOTAL_PARTIAL = 'P',
  TOTAL_GENERAL = 'T',
}

export enum VertycalTotalization {
  TOTALIZE = 'S',
  DONT_TOTALIZE = 'N',
  APPLY_EXPRESSION = 'E'
}

export enum HorizontalAccTypes {
  ACCUMULATE = 'S',
  DONT_ACCUMULATE = 'N',
  // APPLY_EXPLESSION = 'E' // TODO Code this in the backend 
}

export enum HorizontalAnalysisTypes {
  WITHOUT_ANALYSIS = 'N',
  HORIZONTAL_FIXED = 'F', 
  HORIZONTAL_DYNAMIC = 'D', 

}