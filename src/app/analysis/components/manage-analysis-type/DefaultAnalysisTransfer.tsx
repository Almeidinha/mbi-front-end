import { Button, Card, Col, Divider, Row, Space, Table } from 'antd'
import React, { useLayoutEffect, useState } from 'react'

import { MenuOutlined, StepBackwardOutlined, StepForwardOutlined } from '@ant-design/icons'
import { FieldDTO } from '@/lib/types/Analysis';
import { ColumnsType } from 'antd/es/table';
import useAnalysisState from '../../hooks/use-analysis-state';
import { FieldTypes } from '@/lib/types/Filter';
import CustomTableHeader from '@/components/custom/custom-table-header';
import ReactDragListView from 'react-drag-listview';
import { cloneDeep, isNil } from 'lodash';
import { CubeStackIcon, SetSquareIcon } from '@/lib/icons/customIcons';
import ActionButtons from './ActionButtons';

import './manage-analysis.type.css'
import { isDefined } from '@/lib/helpers/safe-navigation';
import { mapOrder } from '@/lib/helpers/arrays';

const tableProps = {
  size: "small" as const,
  bordered: true as const,
  showHeader: false as const,
  pagination: false as const,
};

interface DefaultAnalysisTransferProps {
  onTypeChange?: () => void
  onOk?: (fields: FieldDTO[]) => void
  onCancel?: () => void
}

const sourceColumns: ColumnsType<FieldDTO> = [
  {
    title: 'Available Fields',
    key: 'name',
    dataIndex: 'name'
  },
]

const destineColumns: ColumnsType<FieldDTO> = [
  {
    title: "Operates",
    key: "operate",
    render: (text, record, index) =>
    <MenuOutlined className="drag-handle"/>
  },
  {
    title: '',
    key: 'name',
    dataIndex: 'name',
    render: (text, record) => record.fieldType === FieldTypes.DIMENSION ? <><CubeStackIcon/> {text}</> : <><SetSquareIcon/> {text}</>
  },
]

const DefaultAnalysisTransfer = (props: DefaultAnalysisTransferProps) => {

  const {
    indicator, 
    setIndicator
  } = useAnalysisState.useContainer()

  const [dimensionKeys, setDimensionKeys] = useState<number[]>([])
  const [metricKeys, setMetricKeys] = useState<number[]>([])
  const [selectedFieldKeys, setSelectedFieldKeys] = useState<number[]>([])
  const [fields, setFields] = useState<FieldDTO[]>()

  useLayoutEffect(() => {
    if (isDefined(indicator)) {
      const fields = cloneDeep(indicator.fields)
      fields.forEach((field) => field.displayLocation = 0)
      setFields(fields)
    }
  }, [indicator])

  if (isNil(fields)) {
    return <span>No indicator found...</span>
  }

  const handleOk = () => {
    if (isDefined(fields)) {
      fields.forEach((field, i) => {
        field.visualizationSequence = field.defaultField === 'S' ? i+1 : 0
      })
      props.onOk?.(fields)
    }
  }

  const onDimensionRowClick = (data: Partial<FieldDTO>, index?: number) => {
    return {
      onClick:  () => {
      
        const hasKey = dimensionKeys.includes(data.fieldId!)
        if (hasKey) {
          setDimensionKeys((oldData) => oldData.filter((key) => key !== data.fieldId!))
        } else {
          setDimensionKeys((oldData) => [...oldData, data.fieldId!])
        }
      } 
    }
  }

  const onMetricRowClick = (data: FieldDTO, index?: number) => {
    return {
      onClick:  () => {
      
        const hasKey = metricKeys.includes(data.fieldId!)
        if (hasKey) {
          setMetricKeys((oldData) => oldData.filter((key) => key !== data.fieldId!))
        } else {
          setMetricKeys((oldData) => [...oldData, data.fieldId!])
        }
      } 
    }
  }

  const onSelectedFieldsRowClick = (data: FieldDTO, index?: number) => {
    return {
      onClick:  () => {
      
        const hasKey = selectedFieldKeys.includes(data.fieldId!)
        if (hasKey) {
          setSelectedFieldKeys((oldData) => oldData.filter((key) => key !== data.fieldId!))
        } else {
          setSelectedFieldKeys((oldData) => [...oldData, data.fieldId!])
        }
      } 
    }
  }

  const moveFieldIn = () => {
    const data = [...fields];
    data.forEach((field) => {
      if([...dimensionKeys, ...metricKeys].includes(field.fieldId!)) {
        field.defaultField = 'S';
      }
    })
    setDimensionKeys([])
    setMetricKeys([])
    setFields(data);
  }

  const moveFieldOut = () => {
    const data = [...fields];
    data.forEach((field) => {
      if(selectedFieldKeys.includes(field.fieldId!)) {
        field.defaultField = 'N';
      }
    })
    setSelectedFieldKeys([])
    setFields(data);
  }

  const dragProps = {
    onDragEnd(fromIndex: number, toIndex: number) {
      const data = [...fields.filter((field) => field.defaultField === 'S')];
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
          <Col span={10}>
            <CustomTableHeader title='Dimensões'>
              <Table
                {...tableProps}
                style={{width: '100%', overflow: 'auto'}}
                rootClassName='default-source-table dimension-table'
                onRow={onDimensionRowClick}
                columns={sourceColumns}
                dataSource={fields.filter((field) => field.defaultField === 'N' && field.fieldType === FieldTypes.DIMENSION && field.fieldId !== undefined)
                .map((field) => ({...field, key: field.fieldId})) || []}
                rowSelection={{
                  type: 'checkbox',
                  selectedRowKeys: dimensionKeys
                }}
              />
            </CustomTableHeader>
            <CustomTableHeader title='Métricas'>
              <Table
                {...tableProps}
                style={{width: '100%', overflow: 'auto'}}
                rootClassName='default-source-table metric-table'
                onRow={onMetricRowClick}
                columns={sourceColumns}
                dataSource={fields.filter((field) => field.defaultField === 'N' && field.fieldType === FieldTypes.METRIC && field.fieldId !== undefined)
                .map((field) => ({...field, key: field.fieldId})) || []}
                rowSelection={{
                  type: 'checkbox',
                  selectedRowKeys: metricKeys
                }}
              />
            </CustomTableHeader>  
          </Col>
          <Col span={4} style={{textAlign: 'center'}}>
            <Space split={<Divider type="horizontal" />} direction='vertical' align='center' style={{height: '100%', justifyContent: 'center'}}>
              <Button onClick={moveFieldIn} type='text' shape="round" icon={<StepForwardOutlined color='#1677ff' />}/>              
              <Button onClick={moveFieldOut} type='text' shape="round" icon={<StepBackwardOutlined color='#1677ff' />}/>          
            </Space>
          </Col>
          <Col span={10}>
            <CustomTableHeader title='Campos Selecionados'>
              <ReactDragListView {...dragProps}>
                <Table
                  {...tableProps}
                  rootClassName='selected-fields-table'
                  onRow={onSelectedFieldsRowClick}
                  columns={destineColumns}
                  dataSource={fields.filter((field) => field.defaultField === 'S')
                    .map((field) => ({...field, key: field.fieldId})) || []}
                  rowSelection={{
                    type: 'checkbox',
                    selectedRowKeys: selectedFieldKeys
                  }}
                />
              </ReactDragListView>
            </CustomTableHeader>
          </Col>
        </Row>
      </Col>
    </Card>
    <ActionButtons onOk={handleOk} onCancel={props.onCancel} onMetricClick={() => null} onTypeChange={props.onTypeChange} typeChangeTitle='MultiDimensional'/>
  </Space>
}

export default DefaultAnalysisTransfer
