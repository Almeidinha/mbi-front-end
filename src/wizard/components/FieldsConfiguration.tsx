import React, { useEffect, useState } from 'react'
import useWizardState from '../hooks/use-wizard-state'
import { Card, Col, Form, Input, Row, Select, Space, Switch, Table, Typography } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { AggregationType, AnalyticType, FieldType, UserDataType } from '@/ERDEngine/types'
import { useForm } from 'antd/es/form/Form'
import { debounce } from 'lodash'
import { isDefined, isNil } from '@/lib/helpers/safe-navigation'
import enumToOptions from '@/lib/helpers/enumToOptions'
import CustomTableHeader from '@/components/custom/custom-table-header'
import "./FieldsConfiguration.css"

const columns: ColumnsType<FieldType> = [
  {
    title: 'Name',
    key: 'name',
    dataIndex: 'name',
    width: '100%',
    render: (text, record) => <span>{`${record.tableName}.${text}`}</span>,
  },
]

interface FieldData {
  name: string | number | (string | number)[];
  value?: any;
  touched?: boolean;
  validating?: boolean;
  errors?: string[];
}

const FieldsConfiguration: React.FC = () => {
  
  const {
    metrics,
    dimensions,
    setMetrics,
    setDimensions
  } = useWizardState.useContainer()
  
   
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [selectedField, setSelectedField] = useState<FieldType | undefined>()
  
  const dataSource = [...dimensions, ...metrics]
  
  const [form] = useForm()


   useEffect(() => {

    setDimensions((previous) => previous.map((data, index) => ({
        key: data.key,
        name: data.name,
        type: data.type,
        analyticType: data.analyticType,
        title: data.title || data.name,
        userDataType: data.analyticType === AnalyticType.DIMENSION ? data.userDataType || UserDataType.STRING : undefined,
        tableName: data.tableName,
        nickname: data.nickname || data.name,
        visualizationOrder: (index + 1),
        drillDownLevel: (index + 1),
        initiallyVisible: data.initiallyVisible || true,
        aggregationType: data.aggregationType || AggregationType.EMPTY,
      })
    ))

    setMetrics((previous) => previous.map((data, index) => ({
        key: data.key,
        name: data.name,
        type: data.type,
        analyticType: data.analyticType,
        title: data.title || data.name,
        tableName: data.tableName,
        nickname: data.nickname || data.name,
        visualizationOrder: dimensions.length + (index + 1),
        initiallyVisible: data.initiallyVisible || true,
        aggregationType: data.aggregationType || AggregationType.SUM,
        hasTotalField:  data.hasTotalField || false,
        vertical: data.vertical || false,
      })
    ))    
    
  }, [dimensions.length, setDimensions, setMetrics])


  const getFormData = (field?: FieldType) => {
    return  isDefined(field) 
      ? Object.entries(field).map(([key, value]) => ({name: [key], value}))
      : []
  }
  
  const updateField = (fieldName: string, value: string | number | boolean) => {
    if (isNil(fieldName)) {
      return
    }

    if (selectedField?.analyticType === AnalyticType.METRIC) {
      setMetrics((data) => data.map((d) => d.key === selectedField?.key ? {...d, [fieldName]: value} : d))      
    } 

    if (selectedField?.analyticType === AnalyticType.DIMENSION) {
      setDimensions((data) => data.map((d) => d.key === selectedField?.key ? {...d, [fieldName]: value} : d))            
    } 

    setSelectedField((d) => d ? {...d, [fieldName]: value} : undefined)
  
  }

  const onFieldsChange = (changedFields: FieldData[], allFields: FieldData[]) => {
    
    const field = changedFields[0]
    updateField((field.name as string[])[0], field.value)

  }

  return <Card type="inner">
    <Row>
      <Col span={12} style={{padding: '0 48px'}}>
        <CustomTableHeader title='Fields'>
          <Table
            className='fields-table'
            columns={columns}
            dataSource={dataSource}
            showHeader={false}
            pagination={false}
            size="small"
            bordered
            onRow={(data) => {
              return {
                onClick:  () => {
                  setSelectedKeys(() => [data.key]);
                  setSelectedField(
                    () => dataSource.find((d) => d.tableName === data.tableName && d.name === data.name)
                  );
                }
              }
            }}
            rowSelection={{
              type: 'radio',
              selectedRowKeys: selectedKeys
            }}
          />
        </CustomTableHeader>
      </Col>
      <Col span={12} style={{padding: '0 48px'}}>
        <Form
          className='select-fields-form'
          form = {form}
          initialValues={selectedField}
          disabled={isNil(selectedField)}
          size='middle'
          fields={getFormData(selectedField)}
          onFieldsChange={debounce(onFieldsChange, 500)}
          name = "fiendsConfiguration"
          autoComplete="off"
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 14 }}
        >
          <Form.Item
            label="Nome"
            labelAlign="left"
          >
            {
              selectedField && <Typography.Text type='secondary' style={{marginLeft: '11px'}}>
                {`${selectedField?.tableName}.${selectedField?.name}`}
              </Typography.Text>
            }
            
          </Form.Item>
          <Form.Item
            label="Tipo Campo"
            labelAlign="left"
          >
            {
              selectedField && <Typography.Text type='secondary' style={{marginLeft: '11px'}}>
                {selectedField?.analyticType}
              </Typography.Text>
            }
          </Form.Item>
          <Form.Item
            label="Titulo"
            name="title"
            labelAlign="left"
          >
            <Input placeholder="Titulo" />
          </Form.Item>
          <Form.Item
            label="Apelido"
            name="nickname"
            labelAlign="left"
          >
            <Input placeholder="Apelido" />
          </Form.Item>
          <Form.Item
            label="Tipo customizado"
            name="userDataType"
            labelAlign="left"
            hidden={selectedField?.analyticType === AnalyticType.METRIC || isNil(selectedField)}
          >
            <Select options={enumToOptions(UserDataType)} placeholder="Tipo customizado"/>
          </Form.Item>
          <Form.Item
            label="Tipo Agregação"
            name="aggregationType"
            labelAlign="left"
          >
            <Select options={enumToOptions(AggregationType)} placeholder="Tipo Agregação"/>
          </Form.Item>
          <Form.Item
            label="Ordem de Visualização"
            name="visualizationOrder"
            labelAlign="left"
          >
            <Input disabled variant="borderless"/>
          </Form.Item>
          <Form.Item
            label="Nivel Drill Dowm"
            name="drillDownLevel"
            labelAlign="left"
            hidden={selectedField?.analyticType === AnalyticType.METRIC || isNil(selectedField)}
          >
            <Input disabled variant="borderless"/>
          </Form.Item>
          <Form.Item
            label="Visivel inicialmente"
            name="initiallyVisible"
            labelAlign="left"
          >
            <Switch/>
          </Form.Item>
          <Form.Item
            label="Tem Totalização"
            name="hasTotalField"
            labelAlign="left"
            hidden={selectedField?.analyticType === AnalyticType.DIMENSION || isNil(selectedField)}
          >
            <Switch/>
          </Form.Item>
          <Form.Item
            label="Análise Vertical?"
            name="vertical"
            labelAlign="left"
            hidden={selectedField?.analyticType === AnalyticType.DIMENSION || isNil(selectedField)}
          >
            <Switch/>
          </Form.Item>
          
        </Form>
      </Col>
    </Row>
  </Card>
}

export default FieldsConfiguration