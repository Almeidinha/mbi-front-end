import { useFieldsMutation } from '@/hooks/controllers/fields'
import React, { useState } from 'react'
import useAnalysisState from '../../hooks/use-analysis-state'
import { defaultTo, cloneDeep } from '@/lib/helpers/safe-navigation'
import { FieldDTO } from '@/lib/types/Analysis'
import { AnalysisType, FieldTypes } from '@/lib/types/Filter'
import HorizontalAnalysis from './HorizontalAnalysis'
import VerticalAnalysis from './VerticalAnalysis'
import { convertToBIAnalysisFieldDTO } from '@/lib/helpers/converters'

export const analysisTypeTableProps = {
  size: "middle" as const,
  pagination: false as const,
};

interface IProps {
  onFinish?: () => void
  onCancel?: () => void
  analysisType: AnalysisType
}

const AnalysisTypeConfiguration = (props: IProps) => {

  const {
    editFields
  } = useFieldsMutation()

  const {
    indicator,
  } = useAnalysisState.useContainer()

  const [fields, setFields] = useState<FieldDTO[]>(
    cloneDeep(defaultTo(indicator?.fields, []))
      .filter(field => field.defaultField === 'S' && field.fieldType === FieldTypes.METRIC)
      .sort((a, b) => a.visualizationSequence - b.visualizationSequence)
  )
  
  const handleSave = () => {    
    editFields({
      fields: fields.map((field) => convertToBIAnalysisFieldDTO(field)),
      onSuccess: () => props.onFinish?.()
    })
  }


  return props.analysisType === AnalysisType.HORIZONTAL 
    ? <HorizontalAnalysis onCancel={props?.onCancel} onFinish={handleSave} fields={fields} setFields={setFields} /> 
    : <VerticalAnalysis onCancel={props?.onCancel} onFinish={handleSave} fields={fields} setFields={setFields}/>
}

export default AnalysisTypeConfiguration
