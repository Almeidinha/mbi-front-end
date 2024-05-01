import enumToOptions from '@/lib/helpers/enumToOptions'
import { FieldColumnAlignment, FieldDataTypes, FieldDefaultValues, FieldTypes } from '@/lib/types/Filter'
import { Button, Card, Form, Input, InputNumber, Select, Space, Typography } from 'antd'
import { useForm } from 'antd/es/form/Form'
import React from 'react'
import useAnalysisState from '../../hooks/use-analysis-state'
import { FieldDTO } from '@/lib/types/Analysis'
import { is, isNil } from '@/lib/helpers/safe-navigation'
import { SaveOutlined } from '@ant-design/icons'
import { useFieldsMutation } from '@/hooks/controllers/fields'
import { convertToBIAnalysisFieldDTO } from '@/lib/helpers/converters'

interface IProps {
  fieldId: string
  onFinish?: () => void
  onCancel?: () => void
}

const EditFieldComponent = (props: IProps) => {

  const [form] = useForm()

  const {
    indicator,
  } = useAnalysisState.useContainer()

  const {
    editField,
    isEditingField,
  } = useFieldsMutation()

  const field: FieldDTO | undefined = indicator?.fields.find((field) => field.fieldId === Number(props.fieldId))

  if (isNil(field)) {
    return <Typography.Text type="warning">Could not find Field with ID {props.fieldId}</Typography.Text>
  }

  const initialValues: Partial<FieldDTO> = {
    title: field.title,
    fieldType: field.fieldType,
    dataType: field.dataType,
    defaultField: field.defaultField,
    columnWidth: field.columnWidth,
    columnAlignment: field.columnAlignment,
    dateMask: field.dateMask,
    delegateOrder: field.delegateOrder,
  }

  const handleFormSubmit = (values: any) => {    
    form.validateFields().then(formFields => {
      const analysisField =  convertToBIAnalysisFieldDTO({...field,...formFields})
      editField({
        field: analysisField,
        onSuccess: () => props.onFinish?.()
      })
    })
  }

  const getDelegateOrderFields = () => {
    return indicator?.fields
      .filter((f) => f.fieldId !== field.fieldId && isNil(f.delegateOrder)).map((f) => ({
        value: f.fieldId,
        label: f.title
      }))
  }

  const handleTypeChange = (value: string) => {
    if (value !== 'N') {
      form.setFieldsValue({fieldType: 'D'})
    }
  }

  return <Card type='inner'>    
    <Form
      form = {form}
      preserve={false}
      name = "EditFieldForm"
      autoComplete="off"
      onFinish={handleFormSubmit}
      initialValues={initialValues}
      labelCol={{ span: 10 }}
      wrapperCol={{ span: 14 }}
    >
      <Form.Item 
        label="Título"
        name="title"
        labelAlign="left"
        rules={[{ required: true, message: 'Digite um título' }]}
      >
        <Input type="text" allowClear />          
      </Form.Item>
      <Form.Item dependencies={['dataType']} noStyle>
      {({getFieldValue}) => (
        <Form.Item 
          label="Tipo do Campo"
          name="fieldType"
          labelAlign="left"
        >
          <Select options={enumToOptions(FieldTypes)} disabled={getFieldValue('dataType') !== 'N' } />
        </Form.Item>
      )}
      </Form.Item>
      <Form.Item 
        label="Tipo Dado"
        name="dataType"
        labelAlign="left"
      >
        <Select options={enumToOptions(FieldDataTypes)} onChange={handleTypeChange} />
      </Form.Item>
      <Form.Item 
        label="Mostrar"
        name="defaultField"
        labelAlign="left"
      >
        <Select options={enumToOptions(FieldDefaultValues)} />
      </Form.Item>
      <Form.Item 
        label="Largura Coluna"
        name="columnWidth"
        labelAlign="left"
        rules={[
          { required: true, message: 'Digite um valor' }
        ]}
      >
        <InputNumber min={1} max={250}/>
      </Form.Item>
      <Form.Item 
        label="Alinhamento Coluna"
        name="columnAlignment"
        labelAlign="left"
      >
        <Select options={enumToOptions(FieldColumnAlignment)} />
      </Form.Item>
      <Form.Item 
        label="Mascara Data"
        name="dateMask"
        labelAlign="left"
        >
          <Input type="text" allowClear />
      </Form.Item>
      {
        is(indicator?.multidimensional) ? (
        <Form.Item 
          label="Aggregate and Order by"
          name="delegateOrder"
          labelAlign="left"
        >
          <Select options={getDelegateOrderFields()} placeholder="Sem configuraçao" allowClear />
        </Form.Item>
        ) : null
      }
      <Form.Item wrapperCol={{ offset: 16 }}>
        <Space direction='horizontal'>
          <Button type='default' onClick={props.onCancel}>Cancelar</Button>   
          <Button
            type="primary"
            loading={isEditingField}
            icon={<SaveOutlined />}
            htmlType="submit"
          >
            Ok
          </Button>
        </Space>
      </Form.Item>
    </Form>
    
  </Card>
}

export default EditFieldComponent
