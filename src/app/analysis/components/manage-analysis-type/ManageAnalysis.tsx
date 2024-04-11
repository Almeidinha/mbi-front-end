import { Card } from 'antd'
import React, { useState } from 'react'
import useAnalysisState from '../../hooks/use-analysis-state'
import MultiDimensionalAnalysisTransfer from './MultiDimensionalAnalysisTransfer'
import DefaultAnalysisTransfer from './DefaultAnalysisTransfer'
import { is, isNil } from '@/lib/helpers/safe-navigation'
import { FieldDTO } from '@/lib/types/Analysis'
import { useAnalysisController } from '@/hooks/controllers/analysis'

interface IProps {
  onFinish?: () => void
}

const ManageAnalysis = (props: IProps) => {

  const {
    indicator, 
    setIndicator
  } = useAnalysisState.useContainer()

  const {
    editAnalysis,
  } = useAnalysisController({})

  const [multidimensional, setMultidimensional] = useState<boolean>(is(indicator?.multidimensional)) 

  const title = multidimensional ? 'MultiDimensional' : 'Padrão'
  
  if (isNil(indicator)) {
    return "Ind cant be null..."
  }

  const handleTypeChange = () => {
    setMultidimensional(!multidimensional)
  }

  const handleOkClick = (fields: FieldDTO[]) => {
    setIndicator({
      ...indicator,
      tableType: multidimensional ? 2 : 1,
      fields
    })
    editAnalysis({
      analysis: {
        id: indicator.code,
        fields: fields,
        tableType: multidimensional ? 2 : 1,
      }
    })
    props.onFinish?.()
  }

  return <Card 
    title={`Análise ${title}`} 
    style={{ width: '750px' }}
    >
      {
        multidimensional 
          ? <MultiDimensionalAnalysisTransfer onOk={handleOkClick} onTypeChange={handleTypeChange} onCancel={props.onFinish}/> 
          : <DefaultAnalysisTransfer onOk={handleOkClick} onTypeChange={handleTypeChange} onCancel={props.onFinish}/>
      }      
  </Card>
}

export default ManageAnalysis
