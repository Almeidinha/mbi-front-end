import React, { useState } from 'react'
import useWizardState from '../hooks/use-wizard-state'
import { Button, Card, Col, Divider, Flex, Row, Space, Table, Tooltip, Typography, notification } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { DeleteRowOutlined, FastBackwardOutlined, FastForwardOutlined, MenuOutlined, MinusOutlined, StepBackwardOutlined, StepForwardOutlined, TableOutlined } from '@ant-design/icons'
import { defaultTo, isNil } from 'lodash'
import { AnalyticType, FieldType } from '@/ERDEngine/types'
import { MessageType, getMessageIcon } from '@/lib/helpers/alerts'
import ReactDragListView from 'react-drag-listview';
import CustomTableHeader from '@/components/custom/custom-table-header'
import "./SelectFields.css"

interface DataType {
  key: string;
  name: string;
  type: string
  tableName: string;
  fieldType?: string;
  children?: DataType[];
}

enum ColumnType {
  METRIC = 'METRIC',
  DIMENSION = 'DIMENSION'
}

const tableProps = {
  showHeader: false as const,
  size: "small" as const,
  bordered: true as const,
  pagination: false as const,
}

const sourceColumns: ColumnsType<DataType> = [
  {
    title: 'Available Fields',
    key: 'name',
    dataIndex: 'name',
    render: (text, record) => <Flex justify='space-between'>
      <Typography.Text type='secondary' strong>{text}</Typography.Text>
      <Tooltip title={record.type === 'table' ? 'Table' : record.fieldType}>
        {
          record.type === 'table' ? <TableOutlined style={{color: '#94bfff'}} /> : <DeleteRowOutlined style={{color: '#94bfff'}}/>
        }    
      </Tooltip>
    </Flex>
  },
]

const destineColumns: ColumnsType<FieldType> = [
  {
    title: "Operates",
    key: "operate",
    render: (text, record, index) =>
    <MenuOutlined className="drag-handle"/>
  },
  {
    title: 'Dimensions',
    key: 'name',
    dataIndex: 'name',
    width: '100%',
    render: (text, record) => <Space>
      <Typography.Text type='secondary' strong>{record.tableName}</Typography.Text> 
        <MinusOutlined />
      <Typography.Text type='secondary'>{text}</Typography.Text>
    </Space>
  },
]

const SelectFields: React.FC = () => {

  const {
    tableList,
    metrics, 
    setMetrics, 
    dimensions, 
    setDimensions
  } = useWizardState.useContainer()

  const [sourceKeys, setSourceKeys] = useState<string[]>([])
  const [dimensionKeys, setDimensionKeys] = useState<string[]>([])
  const [metricsKeys, setMetricsKeys] = useState<string[]>([])
  const [selectedRow, setSelectedRow] = useState<DataType | undefined>(undefined)

  const [api, contextHolder] = notification.useNotification();

  const showMessage = (message: string, description: string, type: MessageType) => {
    api.info({
      message,
      icon: getMessageIcon(type),
      description,
      placement: 'topRight',
      role : 'alert'
    });
  }

  const copyItem = (setItem: React.Dispatch<React.SetStateAction<FieldType[]>>, type: ColumnType) => {
    
    if (isNil(selectedRow)) return

    if (type === ColumnType.METRIC) {
      if ((!/^(.*INT.*|DEC.*|NUM.*|ID.*|REAL|DOUBLE|FLOAT|BIT|.*MONEY)$/.test(defaultTo(selectedRow.fieldType, '').toUpperCase()))){
        showMessage('No can do!', 'Campo não é uma métrica válida.', MessageType.ALERT)
        return;
      }
    }
    
    if (dimensions.some((d) => d.key === selectedRow.key)) {
      showMessage('No can do!', 'Campo ja foi adicionado como dimensão', MessageType.ALERT)
      return;
    }
  
    if (metrics.some((m) => m.key === selectedRow.key)) {
      showMessage('No can do!', 'Campo ja foi adicionado as Métricas', MessageType.ALERT)
      return;
    }
    
    setItem((item) => [...item, {
      key: selectedRow.key,
      name: selectedRow.name,
      type: selectedRow.type,
      tableName: selectedRow.tableName,
      analyticType: type === ColumnType.DIMENSION ? AnalyticType.DIMENSION : AnalyticType.METRIC,
    }])

    setSelectedRow(undefined)
    setSourceKeys([])
    
  }

  const clearItems = (
    setItem: React.Dispatch<React.SetStateAction<FieldType[]>>, 
    setItemKeys: React.Dispatch<React.SetStateAction<string[]>>) => {
    
      setItem(() => [])
      setItemKeys(() => [])
  }

  const removeFromDimension = () => {
    setDimensions((data) => data.filter(d => !dimensionKeys.includes(d.key)))
    setDimensionKeys((data) => data.filter(key => !dimensionKeys.includes(key)))
  }

  const removeFromMetrics = () => {
    setMetrics((data) => data.filter(d => !metricsKeys.includes(d.key)))
    setMetricsKeys((data) => data.filter(key => !metricsKeys.includes(key)))
  }

  const onSourceRowClick = (data: DataType, index?: number) => {
    return {
      onClick:  () => {
        
        if (data.type === 'table') return;

        setSourceKeys(() => [data.key])
        setSelectedRow(() => data)
      } 
    }
  }

  const onDimensionRowClick = (data: FieldType, index?: number) => {
    return {
      onClick:  () => {
      
        const hasKey = dimensionKeys.includes(data.key)
        if (hasKey) {
          setDimensionKeys((oldData) => oldData.filter((key) => key !== data.key))
        } else {
          setDimensionKeys((oldData) => [...oldData, data.key])
        }
      } 
    }
  }

  const onMetricRowClick = (data: FieldType, index?: number) => {
    return {
      onClick:  () => {
        
        const hasKey = metricsKeys.includes(data.key)
        if (hasKey) {
          setMetricsKeys((oldData) => oldData.filter((key) => key !== data.key))
        } else {
          setMetricsKeys((oldData) => [...oldData, data.key])
        }
      } 
    }
  }

  const data: DataType[] = tableList.map((table) => ({
    key: table.id,
    type: 'table',
    name: table.name,
    tableName: table.name,
    children: table.fields.map((field) => ({
      type: 'field',
      key: field.id,
      name: field.name,
      tableName: table.name,
      fieldType: field.type
    }))
  }))

  const dimDragProps = {
    onDragEnd(fromIndex: number, toIndex: number) {
        const data = [...dimensions];
        const item = data.splice(fromIndex, 1)[0];
        data.splice(toIndex, 0, item);
        setDimensions(data);
    },
    handleSelector: "svg",
  };

  const metDragProps = {
    onDragEnd(fromIndex: number, toIndex: number) {
        const data = [...metrics];
        const item = data.splice(fromIndex, 1)[0];
        data.splice(toIndex, 0, item);
        setMetrics(data);
    },
    handleSelector: "svg",
  };

  return <Card type="inner" >
      <Col span={24}>
        <Row>
          <Col span={10}>
            <CustomTableHeader title='Available Columns'>
              <Table
                  {...tableProps}
                  rootClassName='source-table'
                  expandable={{ 
                    defaultExpandAllRows: true,
                    expandRowByClick: true,
                  }}
                  columns={sourceColumns}
                  dataSource={data}
                  onRow={onSourceRowClick}
                  rowSelection={{
                    type: 'radio',
                    selectedRowKeys: sourceKeys
                  }}
                />
            </CustomTableHeader>
          </Col>
          
          <Col span={4} style={{textAlign: 'center', alignContent: 'center'}}>
            <Space split={<Divider type="horizontal" />} direction='vertical' align='center' style={{justifyContent: 'center'}}>
              <Space direction='vertical' align='center' style={{justifyContent: 'center'}}>
                <Button disabled={sourceKeys.length === 0} shape="round" onClick={() => copyItem(setDimensions, ColumnType.DIMENSION)} icon={<StepForwardOutlined />}/>
                <Button disabled shape="round" icon={<FastForwardOutlined />}/>
                <Button onClick={() => clearItems(setDimensions, setDimensionKeys)} disabled={dimensions.length === 0} shape="round" icon={<FastBackwardOutlined />}/>
                <Button onClick={removeFromDimension} 
                  disabled={dimensionKeys.length === 0} shape="round" icon={<StepBackwardOutlined />}/>
              </Space>
              <Space direction='vertical' align='center' style={{justifyContent: 'center'}}>
                <Button disabled={sourceKeys.length === 0} shape="round" onClick={() => copyItem(setMetrics, ColumnType.METRIC)} icon={<StepForwardOutlined />}/>
                <Button disabled shape="round" icon={<FastForwardOutlined />}/>
                <Button onClick={() => clearItems(setMetrics, setMetricsKeys)} disabled={metrics.length === 0} shape="round" icon={<FastBackwardOutlined />}/>
                <Button onClick={removeFromMetrics} 
                  disabled={metricsKeys.length === 0} shape="round" icon={<StepBackwardOutlined/>}/> 
              </Space>
            </Space>
          </Col>
          
          <Col span={10}>
            <Space split={<Divider type="horizontal" />} direction='vertical'style={{width: '100%', justifyContent: 'center'}}>
              <CustomTableHeader title='Dimensões'>
                <ReactDragListView {...dimDragProps}>
                  <Table
                    {...tableProps}
                    rootClassName='selected-fields-table dimension-table'
                    columns={destineColumns}
                    dataSource={dimensions}
                    onRow={onDimensionRowClick}
                    rowSelection={{
                      type: 'checkbox',
                      selectedRowKeys: dimensionKeys
                    }}
                  />
                </ReactDragListView>
              </CustomTableHeader>
              <CustomTableHeader title='Métricas'>
                <ReactDragListView {...metDragProps}>
                  <Table
                    {...tableProps}
                    rootClassName='selected-fields-table metric-table'
                    columns={destineColumns}
                    dataSource={metrics}
                    onRow={onMetricRowClick}
                    rowSelection={{
                      type: 'checkbox',
                      selectedRowKeys: metricsKeys
                    }}
                  />
                </ReactDragListView>
              </CustomTableHeader>
            </Space>
          </Col>
        </Row>
      </Col>
      {contextHolder}
  </Card>

}

export default SelectFields
