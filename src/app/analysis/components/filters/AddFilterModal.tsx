import { Button, Form, Input, Modal, ModalProps, Select } from 'antd'
import React, { useEffect } from 'react'
import { ConnectorType, EditingFilter, FilterType, OperatorTypeValues } from './types'
import enumToOptions from '@/lib/helpers/enumToOptions'
import { useForm } from 'antd/es/form/Form'
import useAnalysisState from '../../hooks/use-analysis-state'
import { FilterAction } from '@/lib/types/Filter'
import { SaveOutlined } from '@ant-design/icons'
import { useIndFiltersMutation } from '@/hooks/controllers/filters'
import { isDefined } from '@/lib/helpers/safe-navigation'
import { convertToBIAnalysisFieldDTO } from '@/lib/helpers/converters'


interface IFilterModal extends ModalProps {
  filterType: FilterType
  action: FilterAction
  link: string;
  onFinish?: () => void;
}

const AddFilterModal = (props: IFilterModal) => {

  const [form] = useForm()
  const formField = Form.useWatch('field', form);

  const {
    indicator,
    filters: stateFilters,
    setFilters, 
    setSynchronized,
    updateMetricFilter,
    updateDimensionFilter,
    editingFilter
  } = useAnalysisState.useContainer()

  const {
    buildFilterMutation,
    buildedFilter,
    buildingFilter,
    filtersError,
  } = useIndFiltersMutation()

  useEffect(() => {

    if (isDefined(buildedFilter)) {
      setFilters(buildedFilter)
    }

  }, [buildedFilter, setFilters])


  const initialValues: EditingFilter = {
    connector: editingFilter?.connector,
    field: editingFilter?.field,
    operator: editingFilter?.operator,
    value: editingFilter?.value,
  }

  const handleFormSubmit = (values: any) => {
    
    form.validateFields().then(fields => {

      if (props.action === FilterAction.UPDATE) {
        
        if (props.filterType === FilterType.DIMENSION) {
          updateDimensionFilter(props.link, fields.operator, fields.value)
        } else {
          updateMetricFilter(props.link, fields.operator, fields.value)
        }
        return
      }

      const fieldDto = indicator?.fields.find(field => field.fieldId === values.field)
      
      if (isDefined(fieldDto)) {
        buildFilterMutation({
          input: {
            filters: {...stateFilters!},
            field: convertToBIAnalysisFieldDTO(fieldDto),
            operator: fields.operator,
            value: fields.value,
            link: props.link,
            connector: fields.connector,
          },
          indicatorId: indicator!.code!
        })
      }
      
    }).then(() => {
      props.onFinish?.()
    })
  }

  const availableFields = indicator?.fields
    .filter((field) => field.fieldType === (props.filterType === FilterType.DIMENSION ? "D" : "M") && field.defaultField == "S")
    .map((field) => ({label: field.title, value: field.fieldId}))

  const getDisabledOperators = () => {
    const field = indicator?.fields.find(field => field.fieldId === formField)
    if (field) {
      return field.fieldType === "D" && field.dataType !== "N" 
        ? [OperatorTypeValues.GREATER_THAN, OperatorTypeValues.GREATER_TAN_OR_EQUAL, OperatorTypeValues.LESS_THAN, OperatorTypeValues.LESS_THAN_OR_EQUAL] 
        : [OperatorTypeValues.STARTS_WITH]
    }
    return []
  }

  return <Modal
    title={props.title}
    { ...props }
  >
    <Form
      form = {form}
      preserve={false}
      name = "addEditFiltersForm"
      autoComplete="off"
      onFinish={handleFormSubmit}
      initialValues={initialValues}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
    >
    <Form.Item
      noStyle
      shouldUpdate={(prevValues, currentValues) => prevValues.databaseTypeValue !== currentValues.databaseTypeValue}
    >
      {() =>
        props.filterType === FilterType.DIMENSION ? (
        <Form.Item 
          label="Conector"
          name="connector"
          labelAlign="left"
          rules={[{ required: true, message: 'Selecione um conector' }]}
        >
          <Select 
            options={enumToOptions(ConnectorType)} 
            disabled={props.action === FilterAction.UPDATE} 
          />
        </Form.Item>
        ) : null
      }
    </Form.Item>
      <Form.Item 
        label="Campo"
        name="field"
        labelAlign="left"
        rules={[{ required: true, message: 'Selecione um campo' }]}
      >
        <Select 
          options={availableFields} 
          disabled={props.action === FilterAction.UPDATE} 
          onChange={() => form.setFieldValue("operator", undefined)}
        />
      </Form.Item>
      <Form.Item 
        label="Operador"
        name="operator"
        labelAlign="left"
        rules={[{ required: true, message: 'Selecione um operador' }]}
      >
        <Select options={enumToOptions(OperatorTypeValues, getDisabledOperators())} />
      </Form.Item>
      <Form.Item 
        label="Valor"
        name="value"
        labelAlign="left"
        rules={[{ required: true, message: 'Digite um valor' }]}
      >
        <Input.Search type="text" allowClear />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 20 }}>
        <Button
          type="primary"
          loading={buildingFilter}
          icon={<SaveOutlined />}
          htmlType="submit"
        >
          Ok
        </Button>
      </Form.Item>
    </Form>
    
  </Modal>
}

export default AddFilterModal
