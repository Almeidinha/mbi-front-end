import React, { useState } from 'react'

import { useFieldsMutation } from '@/hooks/controllers/fields';
import ReactDragListView from 'react-drag-listview';
import useAnalysisState from '../../hooks/use-analysis-state';
import { FieldDTO, OrderTypes } from '@/lib/types/Analysis';
import { cloneDeep, defaultTo, isDefined } from '@/lib/helpers/safe-navigation';
import { convertToBIAnalysisFieldDTO } from '@/lib/helpers/converters';
import { Button, Card, Col, Divider, Flex, Row, Select, Space, Table, Typography } from 'antd';
import { DragOutlined, MenuOutlined, StepBackwardOutlined, StepForwardOutlined } from '@ant-design/icons';
import { ColumnsType, ColumnType } from 'antd/es/table';
import enumToOptions from '@/lib/helpers/enumToOptions';

import './order-fields.css'
import CustomTableHeader from '@/components/custom/custom-table-header';
import { mapOrder } from '@/lib/helpers/arrays';

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
    title: 'Available Fields',
    key: 'name',
    dataIndex: 'name',
    render: (text, record) => <Flex style={{marginLeft: '12px'}}>{text}</Flex>
  },
]

const getDestineColumns = (handleSave: (field: FieldDTO) => void): ColumnType<FieldDTO>[] => {
  return [
    {
      title: <DragOutlined />,
      key: "operate",
      width: 15,
      render: () =>
      <MenuOutlined className="drag-handle"/>
    },
    {
      title: 'Field',
      key: 'name',
      dataIndex: 'name',
      width: 240,
    },
    {
      title: 'Ordem',
      key: 'orderDirection',
      dataIndex: 'orderDirection',
      width: 200,
      render: (value: string, record: FieldDTO) => <Select 
      options={enumToOptions(OrderTypes)}
      value={value}
      style={{width: '100%'}}
      onChange={(value) => handleSave({...record, orderDirection: value})}/>
    },
  ]
}


const OrderFields = (props: IProps) => {

  const {
    editFields,
    isEditingFields,
  } = useFieldsMutation()

  const {
    indicator,
  } = useAnalysisState.useContainer()

  const [sourceKeys, setSourceKeys] = useState<number[]>([])
  const [destineKeys, setDestineKeys] = useState<number[]>([])

  const [fields, setFields] = useState<FieldDTO[]>(
    cloneDeep(defaultTo(indicator?.fields, [])).filter((field) => field.order === 0)
      .sort((a, b) => a.visualizationSequence - b.visualizationSequence)
  )
  const [selectedFields, setSelectedFields] = useState<FieldDTO[]>(
    cloneDeep(defaultTo(indicator?.fields, [])).filter((field) => field.order !== 0)
      .sort((a, b) => a.visualizationSequence - b.visualizationSequence)
  )

  const moveFieldIn = () => {
    const currentSelectedKeys = selectedFields.map((field) => field.fieldId)
    const validFields = fields.filter((field) => !currentSelectedKeys.includes(Number(field.fieldId)) && sourceKeys.includes(Number(field.fieldId))) 
    setSelectedFields((prev) => [...prev, ...validFields])
    setSourceKeys([])
  }

  const moveFieldOut = () => {
    setSelectedFields(selectedFields.filter((field) => !destineKeys.includes(Number(field.fieldId))))
    setDestineKeys([])
  }

  const handleSave = (row: FieldDTO) => {
    const updatedFields = selectedFields.map(field => {
      if (field.fieldId === row.fieldId) {
        return { ...field, ...row };
      }
      return field;
    });
    setSelectedFields(updatedFields);
  };

  const handleOk = () => {
    selectedFields.forEach((field, i) => {
      field.order = field.order = i+1 
    })
    
    editFields({
      fields: selectedFields.map((field) => convertToBIAnalysisFieldDTO(field)),
      onSuccess: () => props.onFinish?.()
    })
  }

  const onSourceRowClick = (data: FieldDTO, index?: number) => {
    return {
      onClick:  () => {
      
        const hasKey = sourceKeys.includes(data.fieldId!)
        if (hasKey) {
          setSourceKeys((oldData) => oldData.filter((key) => key !== data.fieldId!))
        } else {
          setSourceKeys((oldData) => [...oldData, data.fieldId!])
        }
      } 
    }
  }

  const onDestineRowClick = (data: FieldDTO, index?: number) => {
    return {
      onClick:  () => {
      
        const hasKey = destineKeys.includes(data.fieldId!)
        if (hasKey) {
          setDestineKeys((oldData) => oldData.filter((key) => key !== data.fieldId!))
        } else {
          setDestineKeys((oldData) => [...oldData, data.fieldId!])
        }
      } 
    }
  }

  const dragProps = {
    onDragEnd(fromIndex: number, toIndex: number) {
      const item = selectedFields.splice(fromIndex, 1)[0];
      selectedFields.splice(toIndex, 0, item);
      const ordered = mapOrder(selectedFields, selectedFields.map((d) => d.fieldId), "fieldId")
      setSelectedFields([...ordered])
    },
    handleSelector: "svg",
  };

  return <Space direction='vertical' style={{width: '100%'}}>
    <Card type='inner'>
      <Col span={24}>
        <Row>
        <Col span={8}>
          <CustomTableHeader title='Avaliable Fields'>
            <Table
              {...tableProps}
              style={{width: '100%', overflow: 'auto'}}
              rootClassName='order-fields-source-table'
              onRow={onSourceRowClick}
              columns={sourceColumns}
              dataSource={fields.map((field) => ({...field, key: field.fieldId})) || []}
              rowSelection={{
                type: 'checkbox',
                selectedRowKeys: sourceKeys
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
        <Col span={12}>
          <ReactDragListView {...dragProps}>
            <Table
              {...tableProps}
              showHeader={true}
              style={{width: '100%', overflow: 'auto'}}
              rootClassName='order-fields-destine-table'
              onRow={onDestineRowClick}
              columns={getDestineColumns(handleSave)}
              dataSource={selectedFields.map((field) => ({...field, key: field.fieldId})) || []}
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
      <Button onClick={handleOk} type='primary'>ok</Button>
      <Button type='default' onClick={props.onCancel}>Cancelar</Button>
    </Space>
  </Space>
}

export default OrderFields
