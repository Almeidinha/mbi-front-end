import { Button, Space } from 'antd'
import React from 'react'

interface ActionButtonsProps {
  typeChangeTitle: string
  onCancel?: () => void
  onOk?: () => void
  onMetricClick: () => void
  onTypeChange?: () => void
}

const ActionButtons = (props: ActionButtonsProps) => {
  return  <Space style={{width: '100%', flexDirection: 'row-reverse'}}>          
    <Button type='default' onClick={props.onCancel}>Cancelar</Button>
    <Button onClick={props.onOk} type='primary'>ok</Button>          
    <Button onClick={props.onMetricClick} type='primary'>Métricas</Button>
    <Button type='primary' onClick={props.onTypeChange}>{props.typeChangeTitle}</Button>
  </Space>
}

export default ActionButtons
