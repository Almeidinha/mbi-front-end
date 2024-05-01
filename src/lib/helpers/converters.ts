import { FieldDTO } from "../types/Analysis";
import { BIAnalysisFieldDTO } from "../types/Filter";
import { is } from "./safe-navigation";

export const convertToBIAnalysisFieldDTO = (field: FieldDTO): BIAnalysisFieldDTO => {
  return {
    ...field,
    direction: field.orderDirection,
    fieldOrder: field.order,
    lineFieldTotalization: field.sumLine,
    usesMediaLine: field.mediaLine,
    accumulatedLineField: field.accumulatedLine,
    vertical: field.verticalAnalysisType,
    horizontal: field.horizontalAnalysisType,
    fieldTotalization: field.applyTotalizationExpression ? 'E' : (field.totalizingField ? 'S' : 'N'),
    columnAlignmentPosition: field.columnAlignment,
    decimalPositions: field.numDecimalPositions,
    dependentCalculatedFields: field.dependentCalculatedFields ?
        field.dependentCalculatedFields.map(convertToBIAnalysisFieldDTO) :
        undefined,
    isNavigableUpwards: field.navigableUpwards
  }
}

export const convertToFieldDTO = (field: BIAnalysisFieldDTO): FieldDTO => {
  return {
      ...field,
      order: field.fieldOrder,
      orderDirection: field.direction,
      mediaLine: field.usesMediaLine,
      accumulatedLine: field.accumulatedLineField,
      verticalAnalysisType: field.vertical,
      horizontalAnalysisType: field.horizontal,
      totalizingField: field.fieldTotalization !== 'N',
      applyTotalizationExpression: field.fieldTotalization === 'E',
      columnAlignment: field.columnAlignmentPosition || "",
      dependentCalculatedFields: field.dependentCalculatedFields ?
        field.dependentCalculatedFields.map(convertToFieldDTO) : undefined,
      navigableUpwards: is(field.isNavigableUpwards),
      numDecimalPositions: field.decimalPositions !== undefined ? field.decimalPositions : 0,
      displayLocation: field.displayLocation !== undefined ? field.displayLocation : 0,
      sumLine: is(field.lineFieldTotalization),
      partialTotalization: field.partialTotalization !== undefined ? field.partialTotalization : false,
      horizontalParticipationAccumulated: is(field.horizontalParticipationAccumulated)
  }
}