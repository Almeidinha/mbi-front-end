import enumToOptions from '@/lib/helpers/enumToOptions'
import { FieldColumnAlignment, FieldDataTypes, FieldDefaultValues, FieldTypes } from '@/lib/types/Filter'
import { Button, Card, Form, Input, InputNumber, Select, Space, Typography } from 'antd'
import { useForm } from 'antd/es/form/Form'
import React from 'react'
import useAnalysisState from '../../hooks/use-analysis-state'
import { FieldDTO } from '@/lib/types/Analysis'
import { isNil } from '@/lib/helpers/safe-navigation'
import { SaveOutlined } from '@ant-design/icons'
import { useFieldController } from '@/hooks/controllers/fields'

interface IProps {
  fieldId: string
  onFinish?: () => void
}

const EditFieldComponent = (props: IProps) => {

  const [form] = useForm()

  const {
    indicator,
  } = useAnalysisState.useContainer()

  const {
    editField,
    isEditingField,
  } = useFieldController({})

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

  }

  const handleFormSubmit = (values: any) => {
    
    form.validateFields().then(fields => {
      editField({
        ...fields,
        fieldId: field.fieldId
      })
    })
  }


  return <Card type='inner' loading={isEditingField}>    
    <Form
      form = {form}
      preserve={false}
      name = "EditFieldForm"
      autoComplete="off"
      onFinish={handleFormSubmit}
      initialValues={initialValues}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
    >
      <Form.Item 
        label="Título"
        name="title"
        labelAlign="left"
        rules={[{ required: true, message: 'Digite um título' }]}
      >
        <Input type="text" allowClear />          
      </Form.Item>
      <Form.Item 
        label="Tipo do Campo"
        name="fieldType"
        labelAlign="left"
      >
        <Select options={enumToOptions(FieldTypes)} />
      </Form.Item>
      <Form.Item 
        label="Tipo Dado"
        name="dataType"
        labelAlign="left"
      >
        <Select options={enumToOptions(FieldDataTypes)} />
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
        rules={[{ required: true, message: 'Digite um valor' }]}
      >
        <InputNumber/>
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
      <Form.Item wrapperCol={{ offset: 20 }}>
        <Button
          type="primary"
          loading={false}
          icon={<SaveOutlined />}
          htmlType="submit"
        >
          Ok
        </Button>
      </Form.Item>
    </Form>
    
  </Card>
}

export default EditFieldComponent
