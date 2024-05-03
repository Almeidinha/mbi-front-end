import { useFieldsMutation } from '@/hooks/controllers/fields'
import { FieldDTO } from '@/lib/types/Analysis'
import React, { useState } from 'react'
import useAnalysisState from '../../hooks/use-analysis-state'
import { Button, Card, Space, Table } from 'antd'
import { cloneDeep, defaultTo, isDefined } from '@/lib/helpers/safe-navigation'
import { convertToBIAnalysisFieldDTO } from '@/lib/helpers/converters'
import { FieldTypes } from '@/lib/types/Filter'
import { ColumnTypes, EditableNumberCell } from '@/components/custom/editableCell/editable-number-cell'
import './decimal-positions.css'

const tableProps = {
  size: "small" as const,
  bordered: true as const,
  pagination: false as const,
};

interface IProps {
  onFinish?: () => void
  onCancel?: () => void
}

const DecimalPositions = (props: IProps) => {

  const {
    editFields,
    isEditingFields,
  } = useFieldsMutation()

  const {
    indicator,
  } = useAnalysisState.useContainer()

  const [fields, setFields] = useState<FieldDTO[]>(
    cloneDeep(defaultTo(indicator?.fields, []))
      .filter(field => field.defaultField === 'S' && field.fieldType === FieldTypes.METRIC)
      .sort((a, b) => a.visualizationSequence - b.visualizationSequence)
  )

  const columns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: 'Available Metrics',
      key: 'name',
      dataIndex: 'name'
    },
    {
      title: 'Decimal Positions',
      key: 'numDecimalPositions',
      dataIndex: 'numDecimalPositions',
      width: '40%',
      onCell: (record: any) => ({
        record,
        editable: true,
        dataIndex: 'numDecimalPositions',
        title: 'Posições Decimais',
        handleSave,
      }),
    }
  ]

  const handleSave = (row: FieldDTO) => {
    const field =  fields.find(field => field.fieldId === row.fieldId);
    if (isDefined(field)) {
      field.numDecimalPositions = row.numDecimalPositions
      setFields([...fields])
    }
  };

  const handleOk = () => {
    if (isDefined(fields)) {
      editFields({
        fields: fields.map((field) => convertToBIAnalysisFieldDTO(field)),
        onSuccess: () => props.onFinish?.()
      })
    }
  }

  const components = {
    body: {
      cell: EditableNumberCell,
    },
  };

  return <Space direction='vertical' style={{width: '100%'}}>
    <Card type='inner' loading={isEditingFields}>
      <Table
        {...tableProps}
        rootClassName='decimal-positions-table'
        rowClassName={() => 'editable-row'}
        columns={columns}
        dataSource={fields.map(field => ({...field, key: field.fieldId}))}
        components={components}
      />
    </Card>
    <Space style={{width: '100%', flexDirection: 'row-reverse'}}>              
      <Button onClick={handleOk} type='primary'>ok</Button>
      <Button type='default' onClick={props.onCancel}>Cancelar</Button>
    </Space>
  </Space>
}

export default DecimalPositions
