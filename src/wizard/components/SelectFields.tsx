import React, { useState } from 'react'
import useWizardState from '../hooks/use-wizard-state'
import { Button, Card, Col, Flex, Row, Space, Table, Tooltip, Typography, notification } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { DeleteRowOutlined, FastBackwardOutlined, FastForwardOutlined, MenuOutlined, MinusOutlined, StepBackwardOutlined, StepForwardOutlined, TableOutlined } from '@ant-design/icons'
import { defaultTo, isNil } from 'lodash'
import { AnalyticType, FieldType } from '@/ERDEngine/types'
import { MessageType, getMessageIcon } from '@/lib/helpers/alerts'
import ReactDragListView from 'react-drag-listview';
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

  const onSourceRowClick = (data: DataType, index?: number) => {
    return {
      onClick:  () => {
        
        if (data.type === 'table') return;

        setSourceKeys(() => [data.key])
        setSelectedRow(() => data)
      } 
    }
  }

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
      <Row>
        <Col span={10} style={{padding: '0 48px'}}>
          <Space.Compact direction='vertical' className='custom-table-wrapper'>
            <div className='custom-table-title'>
              <Typography.Title type='secondary' level={5}>
                Available Columns
              </Typography.Title>
            </div>
            <Table
              style={{ maxHeight: '500px', overflowY: 'auto'}}
              className='source-table'
              showHeader={false}
              expandable={{ 
                defaultExpandAllRows: true,
                expandRowByClick: true,
              }}
              columns={sourceColumns}
              dataSource={data}
              size="small"
              bordered
              pagination={false}
              onRow={onSourceRowClick}
              rowSelection={{
                type: 'radio',
                selectedRowKeys: sourceKeys
              }}
            />
          </Space.Compact>
        </Col>
        
        <Col span={4} style={{height: '500px'}}>
          <Row justify={'center'} align={'middle'} style={{flexDirection: 'column', height: '50%'}}>
            <Space direction='vertical'>
              <Button disabled={sourceKeys.length === 0} shape="round" onClick={() => copyItem(setDimensions, ColumnType.DIMENSION)} icon={<StepForwardOutlined />}/>
              <Button disabled shape="round" icon={<FastForwardOutlined />}/>
              <Button onClick={() => clearItems(setDimensions, setDimensionKeys)} disabled={dimensions.length === 0} shape="round" icon={<FastBackwardOutlined />}/>
              <Button 
                onClick={removeFromDimension} 
                disabled={dimensionKeys.length === 0} shape="round" icon={<StepBackwardOutlined />}/>
            </Space>
          </Row>
          <Row justify={'center'} align={'middle'} style={{flexDirection: 'column', height: '50%'}}>
            <Space direction='vertical'>
              <Button disabled={sourceKeys.length === 0} shape="round" onClick={() => copyItem(setMetrics, ColumnType.METRIC)} icon={<StepForwardOutlined />}/>
              <Button disabled shape="round" icon={<FastForwardOutlined />}/>
              <Button onClick={() => clearItems(setMetrics, setMetricsKeys)} disabled={metrics.length === 0} shape="round" icon={<FastBackwardOutlined />}/>
              <Button 
                onClick={removeFromMetrics} 
                disabled={metricsKeys.length === 0} shape="round" icon={<StepBackwardOutlined/>}/>
            </Space>
          </Row>
        </Col>
        
        <Col span={10} style={{padding: '0 48px'}}>
          <Row justify={'center'} style={{height:'50%'}}>
            <Space.Compact direction='vertical' className='custom-table-wrapper'>
              <div className='custom-table-title'>
              <Typography.Title type='secondary' level={5}>
                Dimensões
              </Typography.Title>
              </div>
              <ReactDragListView {...dimDragProps}>
                <Table
                  style={{ maxHeight: '200px', overflowY: 'auto'}}
                  className='dimension-table'
                  showHeader={false}
                  columns={destineColumns}
                  dataSource={dimensions}
                  pagination={false}
                  size="small"
                  bordered
                  onRow={onDimensionRowClick}
                  rowSelection={{
                    type: 'checkbox',
                    selectedRowKeys: dimensionKeys
                  }}
                />
              </ReactDragListView>
            </Space.Compact>
          </Row>
          <Row justify={'center'} style={{height:'50%'}} >
            <Space.Compact direction='vertical' className='custom-table-wrapper'>
              <div className='custom-table-title'>
              <Typography.Title type='secondary' level={5}>
                  Métricas
                </Typography.Title>
              </div>
              <ReactDragListView {...metDragProps}>
                <Table
                  style={{ maxHeight: '200px', overflowY: 'auto'}}
                  className='metric-table'
                  showHeader={false}
                  columns={destineColumns}
                  dataSource={metrics}
                  pagination={false}
                  size="small"
                  bordered
                  onRow={onMetricRowClick}
                  rowSelection={{
                    type: 'checkbox',
                    selectedRowKeys: metricsKeys
                  }}
                />
              </ReactDragListView>
            </Space.Compact>            
          </Row>
        </Col>
      </Row>
      {contextHolder}
  </Card>

}

export default SelectFields
