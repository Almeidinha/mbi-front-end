import { Button, Card, Col, Divider, Modal, Row, Space, Table, Typography } from 'antd'
import React, { useLayoutEffect, useState } from 'react'
import ActionButtons from './ActionButtons'
import { ExclamationCircleOutlined, MenuOutlined, StepBackwardOutlined, StepForwardOutlined } from '@ant-design/icons'
import CustomTableHeader from '@/components/custom/custom-table-header'
import { ColumnsType } from 'antd/es/table'
import { FieldDTO } from '@/lib/types/Analysis'
import useAnalysisState from '../../hooks/use-analysis-state'
import { cloneDeep, isNil } from 'lodash'
import { CubeStackIcon, SetSquareIcon } from '@/lib/icons/customIcons'
import { FieldTypes } from '@/lib/types/Filter'
import ReactDragListView from 'react-drag-listview';
import { isDefined } from '@/lib/helpers/safe-navigation'

import './manage-analysis.type.css'
import { DisplayLocation } from './types'
import { mapOrder } from '@/lib/helpers/arrays'

interface MultiDimensionalAnalysisTransferProps {
  onTypeChange?: () => void
  onMetricClick: () => void
  onOk?: (fields: FieldDTO[]) => void
  onCancel?: () => void
}

const tableProps = {
  size: "small" as const,
  bordered: true as const,
  showHeader: false as const,
  pagination: false as const,
};

const sourceColumns: ColumnsType<FieldDTO> = [
  {
    title: 'Available Fields',
    key: 'name',
    dataIndex: 'name',
    render: (text, record) => record.fieldType === FieldTypes.DIMENSION ? <><CubeStackIcon/> {text}</> : <><SetSquareIcon/> {text}</>
  },
]

const destineColumns: ColumnsType<FieldDTO> = [
  {
    key: "operate",
    width: 15,
    render: (text, record, index) =>
    <MenuOutlined className="drag-handle"/>
  },
  {
    key: 'name',
    dataIndex: 'name',
    render: (text, record) => record.fieldType === FieldTypes.DIMENSION 
      ? <Space direction='horizontal' size={4}>
          <CubeStackIcon/><Typography.Text type={record.defaultField === 'T' ? 'danger': undefined}>{text}</Typography.Text>
        </Space> 
      : <Space direction='horizontal' size={4}>
          <SetSquareIcon/><Typography.Text type={record.defaultField === 'T' ? 'danger': undefined}>{text}</Typography.Text>
        </Space>
  },
]

const MultiDimensionalAnalysisTransfer = (props: MultiDimensionalAnalysisTransferProps) => {

  const {
    indicator, 
    setIndicator
  } = useAnalysisState.useContainer()

  const [sourceFieldKeys, setSourceFieldKeys] = useState<number[]>([])  
  const [lineKeys, setLineKeys] = useState<number[]>([])
  const [columnsKeys, setColumnsKeys] = useState<number[]>([])
  
  const [fields, setFields] = useState<FieldDTO[]>()

  const [modal, modalContext] = Modal.useModal();

  useLayoutEffect(() => {
    if (isDefined(indicator)) {
      const fields = cloneDeep(indicator.fields)
      fields.forEach((field) => {
        if (field.defaultField === "N") {
          return
        }
        field.displayLocation = field.fieldType === FieldTypes.DIMENSION ?  DisplayLocation.COLUMN : DisplayLocation.LINE
      })
      setFields(fields.sort((a, b) => a.visualizationSequence - b.visualizationSequence))
    }
  }, [indicator])

  const handleOk = () => {
    if (isDefined(fields)) {
      fields.forEach((field, i) => {  
        field.visualizationSequence = field.defaultField !== 'N' ? i+1 : 0
      })
      props.onOk?.(fields)
    }
  }

  if (isNil(fields)) {
    return <span>No indicator found...</span>
  }

  const onSourceFieldsRowClick = (data: Partial<FieldDTO>, index?: number) => {
    return {
      onClick:  () => {
      
        const hasKey = sourceFieldKeys.includes(data.fieldId!)
        if (hasKey) {
          setSourceFieldKeys((oldData) => oldData.filter((key) => key !== data.fieldId!))
        } else {
          setSourceFieldKeys((oldData) => [...oldData, data.fieldId!])
        }
      } 
    }
  }

  const onLineRowClick = (data: Partial<FieldDTO>, index?: number) => {
    return {
      onClick:  () => {
      
        const hasKey = lineKeys.includes(data.fieldId!)
        if (hasKey) {
          setLineKeys((oldData) => oldData.filter((key) => key !== data.fieldId!))
        } else {
          setLineKeys((oldData) => [...oldData, data.fieldId!])
        }
      } 
    }
  }

  const onColumnRowClick = (data: Partial<FieldDTO>, index?: number) => {
    return {
      onClick:  () => {
      
        const hasKey = columnsKeys.includes(data.fieldId!)
        if (hasKey) {
          setColumnsKeys((oldData) => oldData.filter((key) => key !== data.fieldId!))
        } else {
          setColumnsKeys((oldData) => [...oldData, data.fieldId!])
        }
      } 
    }
  }

  const moveFieldIn = (displayLocation: DisplayLocation) => {
    const data = [...fields];
    
    const hasInvalidMetrics = data
      .filter((field) => sourceFieldKeys.includes(field.fieldId!))
      .some((field) => displayLocation === DisplayLocation.COLUMN && field.fieldType === FieldTypes.METRIC)
    
    if (hasInvalidMetrics) {
      modal.warning({
        title: "Not allowed!",
        icon: <ExclamationCircleOutlined />,
        content: "Métricas não podem estar nas Linhas!"
      })
    }

    data.forEach((field) => {
      if (displayLocation === DisplayLocation.COLUMN && field.fieldType === FieldTypes.METRIC) {
        return
      }
      if(sourceFieldKeys.includes(field.fieldId!)) {
        field.displayLocation = displayLocation;
        field.defaultField = 'S'
      }
    })
    setSourceFieldKeys([])
    setFields(data);
  }

  const moveFieldOut = (displayLocation: DisplayLocation) => {
    const data = [...fields];
    const keys = displayLocation === DisplayLocation.LINE ? lineKeys : columnsKeys

    const invalidMetrics = data.filter((field) => keys.includes(field.fieldId!)).some((field) => field.fieldType === FieldTypes.METRIC && field.defaultField === 'T')

    if (invalidMetrics) {
      modal.warning({
        title: "Not allowed!",
        icon: <ExclamationCircleOutlined />,
        content: "Uma métrica 'somente cálculo' não pode ser removida da visualização."
      })
    }

    data.forEach((field) => {
      if (field.fieldType === FieldTypes.METRIC && field.defaultField === 'T') {
        return
      }
      if([...keys].includes(field.fieldId!)) {
        field.displayLocation = DisplayLocation.NONE;
        field.defaultField = 'N'
      }
    })
    displayLocation === DisplayLocation.LINE ? setLineKeys([]) : setColumnsKeys([])
    setFields(data);
  }

  const lineDragProps = {
    onDragEnd(fromIndex: number, toIndex: number) {
      const data = [...fields.filter((field) => field.defaultField !== 'N' && field.displayLocation === 2)
        .map((field) => ({...field, key: field.fieldId}))];  
      const item = data.splice(fromIndex, 1)[0];
      data.splice(toIndex, 0, item);
      const ordered = mapOrder(fields, data.map((d) => d.fieldId), "fieldId")
      setFields([...ordered])
    },
    handleSelector: "svg",
  };

  const columnDragProps = {
    onDragEnd(fromIndex: number, toIndex: number) {
      const data = [...fields.filter((field) => field.defaultField !== 'N' && field.displayLocation === 1)
        .map((field) => ({...field, key: field.fieldId}))];  
    
      const item = data.splice(fromIndex, 1)[0];
      data.splice(toIndex, 0, item);
      const ordered = mapOrder(fields, data.map((d) => d.fieldId), "fieldId")
      setFields([...ordered])
    },
    handleSelector: "svg",
  };

  return <Space direction='vertical' style={{width: '100%'}}>
    <Card type="inner">
      <Col span={24}>
        <Row>
          <Col span={11}>
            <CustomTableHeader title='Campos Disponíveis'>
                <Table
                  {...tableProps}
                  rootClassName='available-fields-table'
                  onRow={onSourceFieldsRowClick}
                  columns={sourceColumns}
                  dataSource={fields.filter((field) => field.defaultField === 'N')
                    .map((field) => ({...field, key: field.fieldId})) || []}
                  rowSelection={{
                    type: 'checkbox',
                    selectedRowKeys: sourceFieldKeys
                  }}
                />
              </CustomTableHeader>
          </Col>
          <Col span={2} style={{textAlign: 'center'}}>
            <Space split={<Divider type="horizontal" />} direction='vertical' align='center' style={{height: '100%', justifyContent: 'center'}}>
              <Space split={<Divider type="horizontal" />} direction='vertical' align='center' style={{height: '100%', justifyContent: 'center'}}>
                <Button onClick={() => moveFieldIn(DisplayLocation.COLUMN)} type='text' shape="round" icon={<StepForwardOutlined color='#1677ff' />}/>              
                <Button onClick={() => moveFieldOut(DisplayLocation.LINE)} type='text' shape="round" icon={<StepBackwardOutlined color='#1677ff' />}/>          
              </Space>
              <Space split={<Divider type="horizontal" />} direction='vertical' align='center' style={{height: '100%', justifyContent: 'center'}}>
                <Button onClick={() => moveFieldIn(DisplayLocation.LINE)} type='text' shape="round" icon={<StepForwardOutlined color='#1677ff' />}/>              
                <Button onClick={() => moveFieldOut(DisplayLocation.COLUMN)} type='text' shape="round" icon={<StepBackwardOutlined color='#1677ff' />}/>          
              </Space>
            </Space>
          </Col>
          <Col span={11}>
            <CustomTableHeader title='Linhas'>
              <ReactDragListView {...lineDragProps}>
                <Table
                  {...tableProps}
                  style={{width: '100%', overflow: 'auto'}}
                  rootClassName='destine-table lines-table'
                  onRow={onLineRowClick}
                  columns={destineColumns}
                  dataSource={fields.filter((field) => field.defaultField !== 'N' && field.displayLocation === DisplayLocation.COLUMN)
                    .map((field) => ({...field, key: field.fieldId})) || []}
                  rowSelection={{
                    type: 'checkbox',
                    selectedRowKeys: lineKeys
                  }}
                />
              </ReactDragListView>
            </CustomTableHeader>            
            <CustomTableHeader title='Colunas'>
              <ReactDragListView {...columnDragProps}>
                <Table
                  {...tableProps}
                  style={{width: '100%', overflow: 'auto'}}
                  rootClassName='destine-table columns-table'
                  onRow={onColumnRowClick}
                  columns={destineColumns}
                  dataSource={fields.filter((field) => field.defaultField !== 'N' && field.displayLocation === DisplayLocation.LINE)
                    .map((field) => ({...field, key: field.fieldId})) || []}
                  rowSelection={{
                    type: 'checkbox',
                    selectedRowKeys: columnsKeys
                  }}
                />
              </ReactDragListView>
            </CustomTableHeader>
          </Col>
        </Row>
      </Col>
      {modalContext}
    </Card>
    <ActionButtons onOk={handleOk} onCancel={props.onCancel} onMetricClick={props.onMetricClick} onTypeChange={props.onTypeChange} typeChangeTitle='Padrão'/>
  </Space>
}

export default MultiDimensionalAnalysisTransfer
