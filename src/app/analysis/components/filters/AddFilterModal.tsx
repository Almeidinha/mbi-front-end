import { Button, Form, Input, Modal, ModalProps, Select } from 'antd'
import React, { useEffect } from 'react'
import { ConnectorType, EditingFields, FilterType, OperatorTypeValues } from './types'
import enumToOptions from '@/lib/helpers/enumToOptions'
import { useForm } from 'antd/es/form/Form'
import useAnalysisState from '../../hooks/use-analysis-state'
import { FilterAction } from '@/lib/types/Filter'
import { SaveOutlined } from '@ant-design/icons'
import { useIndFilterMutationController } from '@/hooks/controllers/filters'
import { isDefined } from '@/lib/helpers/safe-navigation'
import { getAnalysisFieldFromFieldDto } from './helper'
import { startCase } from 'lodash'


interface IFilterModal extends ModalProps {
  filterType: FilterType
  action: FilterAction
  link: string;
  onFinish?: () => void;
}

const AddFilterModal = (props: IFilterModal) => {

  const [form] = useForm()

  const {
    indicator,
    filters: stateFilters,
    setFilters, 
    setSynchronized,
    updateMetricFilter,
    updateDimensionFilter,
    editingFields
  } = useAnalysisState.useContainer()

  const {
    buildFilterMutation,
    buildedFilter,
    buildingFilter,
    filtersError,
  } = useIndFilterMutationController()

  useEffect(() => {

    if (isDefined(buildedFilter)) {
      setFilters(buildedFilter)
    }

  }, [buildedFilter, setFilters])

  const initialValues: EditingFields = {
    connector: editingFields?.connector,
    field: editingFields?.field,
    operator: editingFields?.operator,
    value: editingFields?.value,
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

      const analysisField = indicator?.biAnalysisFields.find(field => field.fieldId === values.field)
      
      if (isDefined(analysisField)) {
        buildFilterMutation({
          input: {
            filters: {...stateFilters!},
            field: getAnalysisFieldFromFieldDto(analysisField),
            operator: fields.operator,
            value: fields.value,
            link: props.link,
            connector: fields.connector,
          },
          indicatorId: indicator!.id!
        })
      }
      
    }).then(() => {
      props.onFinish?.()
    })
  }

  const availableFields = indicator?.biAnalysisFields
    .filter((field) => field.fieldType === (props.filterType === FilterType.DIMENSION ? "D" : "M") && field.defaultField == "S")
    .map((field) => ({label: field.title, value: field.fieldId}))

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
          <Select options={enumToOptions(ConnectorType)} disabled={props.action === FilterAction.UPDATE} />
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
        <Select options={availableFields} disabled={props.action === FilterAction.UPDATE} />
      </Form.Item>
      <Form.Item 
        label="Operador"
        name="operator"
        labelAlign="left"
        rules={[{ required: true, message: 'Selecione um operador' }]}
      >
        <Select options={enumToOptions(OperatorTypeValues)} />
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
