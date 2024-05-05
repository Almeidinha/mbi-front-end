import { useFieldsMutation } from '@/hooks/controllers/fields';
import { FieldDTO } from '@/lib/types/Analysis';
import { Button, Card, Col, Divider, Flex, Row, Space, Typography } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import React, { useState } from 'react'
import ReactDragListView from 'react-drag-listview';
import useAnalysisState from '../../hooks/use-analysis-state';
import { cloneDeep, defaultTo } from '@/lib/helpers/safe-navigation';
import { FieldTypes } from '@/lib/types/Filter';
import { convertToBIAnalysisFieldDTO } from '@/lib/helpers/converters';
import { useTableTransferRowClick } from '../../hooks/use-table-transfer-row-click';
import { DragOutlined, MenuOutlined, StepBackwardOutlined, StepForwardOutlined } from '@ant-design/icons';
import { getDragProps } from '@/components/custom/dragable/DragableProps';

import './drill-down-sequence.css'

const tableProps = {
  size: "small" as const,
  showHeader: false as const,
  bordered: true as const,
  pagination: false as const,
};

interface IProps {
  onFinish?: () => void
  onCancel?: () => void
}

const sourceColumns: ColumnsType<FieldDTO> = [
  {
    key: 'name',
    dataIndex: 'name',
    render: (text, record) => <Flex style={{marginLeft: '12px'}}>{text}</Flex>
  },
]

const destineColumns: ColumnsType<FieldDTO> = [
  {
    title: <DragOutlined />,
    key: "operate",
    width: 15,
    render: () =>
    <MenuOutlined className="drag-handle"/>
  },
  ...sourceColumns 
]


const DrillDownSequence = (props: IProps) => {

  const {
    editFields,
    isEditingFields,
  } = useFieldsMutation()

  const {
    indicator,
  } = useAnalysisState.useContainer()

  const { 
    sourceKeys,
    destineKeys,
    setSourceKeys,
    setDestineKeys,
    onSourceRowClick, 
    onDestineRowClick
  } = useTableTransferRowClick<FieldDTO, 'fieldId'>({
    key: 'fieldId'
  })

  const [fields, setFields] = useState<FieldDTO[]>(
    cloneDeep(defaultTo(indicator?.fields, []))
      .filter((field) => field.fieldType === FieldTypes.DIMENSION)
      .sort((a, b) => a.drillDownSequence - b.drillDownSequence)
  )

  const moveFieldIn = () => {
    fields
      .filter((field) => sourceKeys.includes(Number(field.fieldId)))
      .forEach((field) => field.drillDown = true)
    setSourceKeys([])
  }

  const moveFieldOut = () => {
    fields.filter((field) => destineKeys.includes(Number(field.fieldId)))
      .forEach((field) => {
        field.drillDown  = false
        field.drillDownSequence = 0
      })
    setDestineKeys([])
  }

  const handleOk = () => {
    fields
      .filter((field) => field.drillDown)
      .forEach((field, i) => {
      field.drillDownSequence = i+1 
    })
    
    editFields({
      fields: fields.map((field) => convertToBIAnalysisFieldDTO(field)),
      onSuccess: () => props.onFinish?.()
    })
  }

  return <Space direction='vertical' style={{width: '100%'}}>
    <Card type='inner'>
      <Col span={24}>
        <Row>
          <Col span={10}>
            <Table
              {...tableProps}
              title={() => <Typography.Text type='secondary' strong>Campos disponíveis</Typography.Text>}
              style={{width: '100%', overflow: 'auto'}}
              rootClassName='drill-down-source-table'
              onRow={onSourceRowClick}
              columns={sourceColumns}
              dataSource={fields.filter((field) => !field.drillDown)
                .map((field) => ({...field, key: field.fieldId})) || []
              }
              rowSelection={{
                type: 'checkbox',
                selectedRowKeys: sourceKeys
              }}
            />
          </Col>
          <Col span={4} style={{textAlign: 'center'}}>
            <Space split={<Divider type="horizontal" />} direction='vertical' align='center' style={{height: '100%', justifyContent: 'center'}}>
              <Button onClick={moveFieldIn} type='text' shape="round" icon={<StepForwardOutlined color='#1677ff' />}/>              
              <Button onClick={moveFieldOut} type='text' shape="round" icon={<StepBackwardOutlined color='#1677ff' />}/>          
            </Space>
          </Col>
          <Col span={10}>
            <ReactDragListView {...getDragProps({fields, dataIndex: 'fieldId', setter: setFields})}>
              <Table
                {...tableProps}
                title={() => <Typography.Text type='secondary' strong>Campos Selecionados</Typography.Text>}
                style={{width: '100%', overflow: 'auto'}}
                rootClassName='drill-down-destine-table'
                onRow={onDestineRowClick}
                columns={destineColumns}
                dataSource={fields.filter((field) => field.drillDown)
                  .map((field) => ({...field, key: field.fieldId})) || []
                }
                rowSelection={{
                  type: 'checkbox',
                  selectedRowKeys: destineKeys
                }}
              />
            </ReactDragListView>
          </Col>
        </Row>
      </Col>
    </Card>
    <Space style={{width: '100%', flexDirection: 'row-reverse'}}>              
      <Button onClick={handleOk} type='primary' loading={isEditingFields}>ok</Button>
      <Button type='default' onClick={props.onCancel}>Cancelar</Button>
    </Space>
  </Space>
}

export default DrillDownSequence
