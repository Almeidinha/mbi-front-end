import { FieldDTO } from "../types/Analysis";
import { BIAnalysisFieldDTO } from "../types/Filter";

export const convertToBIAnalysisFieldDTO = (field: FieldDTO): BIAnalysisFieldDTO => {
  return {
    ...field,
    columnAlignmentPosition: field.columnAlignment,
    dependentCalculatedFields: field.dependentCalculatedFields ?
        field.dependentCalculatedFields.map(convertToBIAnalysisFieldDTO) :
        undefined,
    isNavigableUpwards: field.navigableUpwards
  }
}

export const convertToFieldDTO = (field: BIAnalysisFieldDTO): FieldDTO => {
  const { 
    columnAlignmentPosition, 
    dependentCalculatedFields, 
    isNavigableUpwards, 
    numDecimalPositions, 
    displayLocation, 
    sumLine, 
    partialTotalization, 
    horizontalParticipationAccumulated, 
    ...rest 
  } = field;
  
  return {
      ...rest,
      columnAlignment: columnAlignmentPosition || "",
      dependentCalculatedFields: dependentCalculatedFields ?
          dependentCalculatedFields.map(convertToFieldDTO) :
          undefined,
      navigableUpwards: isNavigableUpwards || false,
      numDecimalPositions: numDecimalPositions !== undefined ? numDecimalPositions : 0,
      displayLocation: displayLocation !== undefined ? displayLocation : 0,
      sumLine: sumLine !== undefined ? sumLine : false,
      partialTotalization: partialTotalization !== undefined ? partialTotalization : false,
      horizontalParticipationAccumulated: horizontalParticipationAccumulated !== undefined ? horizontalParticipationAccumulated : false
  }
}