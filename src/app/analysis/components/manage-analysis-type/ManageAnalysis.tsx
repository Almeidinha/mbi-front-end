import { Card, Modal, Typography } from 'antd'
import React, { useState } from 'react'
import useAnalysisState from '../../hooks/use-analysis-state'
import MultiDimensionalAnalysisTransfer from './MultiDimensionalAnalysisTransfer'
import DefaultAnalysisTransfer from './DefaultAnalysisTransfer'
import { is, isNil } from '@/lib/helpers/safe-navigation'
import { FieldDTO } from '@/lib/types/Analysis'
import { useAnalysisController } from '@/hooks/controllers/analysis'
import { CloseCircleOutlined } from '@ant-design/icons'
import MetricRestrictions from './MetricRestrictions'

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
  const [modalOpen, setModalOpen] = useState<boolean>(false);

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
        code: indicator.code,
        fields: fields,
        tableType: multidimensional ? 2 : 1,
      }
    })
    props.onFinish?.()
  }

  const onMetricClick = () => {
    setModalOpen(true)
  }

  return <React.Fragment>
    <Card 
      title={`Análise ${title}`} 
      style={{ width: '750px' }}
      >
        {
          multidimensional 
            ? <MultiDimensionalAnalysisTransfer onOk={handleOkClick} onMetricClick={onMetricClick} onTypeChange={handleTypeChange} onCancel={props.onFinish}/> 
            : <DefaultAnalysisTransfer onOk={handleOkClick} onMetricClick={onMetricClick} onTypeChange={handleTypeChange} onCancel={props.onFinish}/>
        }      
    </Card>
    <Modal
      width="auto"
      maskClosable={false}
      centered
      title={<Typography.Text type='secondary'>Manage Metrics Visualization</Typography.Text>}
      open={modalOpen}
      onCancel={() => setModalOpen(false)}
      destroyOnClose
      closeIcon={<CloseCircleOutlined />}
      footer={null}
      style={{minWidth: '600px'}}
    >
      <MetricRestrictions onCancel={() => setModalOpen(false)} onOk={() => setModalOpen(false)}/>
    </Modal>  
  </React.Fragment>
}

export default ManageAnalysis
