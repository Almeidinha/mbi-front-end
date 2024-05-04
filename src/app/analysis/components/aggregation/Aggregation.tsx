import React, { useState } from 'react'

import { FieldDTO } from '@/lib/types/Analysis';
import Table, { ColumnType } from 'antd/es/table';
import { Button, Card, Select, Space } from 'antd';
import { AggregationType } from '@/ERDEngine/types';
import enumToOptions from '@/lib/helpers/enumToOptions';
import { useFieldsMutation } from '@/hooks/controllers/fields';
import useAnalysisState from '../../hooks/use-analysis-state';
import { cloneDeep, defaultTo } from '@/lib/helpers/safe-navigation';
import { convertToBIAnalysisFieldDTO } from '@/lib/helpers/converters';
import './aggregation.css'

const tableProps = {
  size: "small" as const,
  pagination: false as const,
};

interface IProps {
  onFinish?: () => void
  onCancel?: () => void
}

const getColumns = (handleSave: (field: FieldDTO) => void): ColumnType<FieldDTO>[] => {
  return [
    {
      title: 'Field',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: 'Aggregation Type',
      key: 'aggregationType',
      dataIndex: 'aggregationType',
      render: (value, record) => <Select
      options={enumToOptions(AggregationType)}
      value={value}
      style={{width: '100%'}}
      onChange={(value) => handleSave({...record, aggregationType: value})}/>
    }
  ]
}

const Aggregation = (props: IProps) => {

  const {
    editFields,
    isEditingFields,
  } = useFieldsMutation()

  const {
    indicator,
  } = useAnalysisState.useContainer()

  const [fields, setFields] = useState<FieldDTO[]>(
    cloneDeep(defaultTo(indicator?.fields, [])).filter((field) => field.dataType === 'N')
      .sort((a, b) => a.visualizationSequence - b.visualizationSequence)
  )

  const handleSave = (row: FieldDTO) => {
    const updatedFields = fields.map(field => {
      if (field.fieldId === row.fieldId) {
        return { ...field, ...row };
      }
      return field;
    });
    setFields(updatedFields);
  };

  const handleOk = () => {
    
    editFields({
      fields: fields.map((field) => convertToBIAnalysisFieldDTO(field)),
      onSuccess: () => props.onFinish?.()
    })
  }

  return <Space direction='vertical' style={{width: '100%'}}>
    <Card type='inner'>
      <Table
        {...tableProps}
        rootClassName='aggregation-table'
        rowClassName={() => 'editable-row'}
        columns={getColumns(handleSave)}
        dataSource={fields}
      />
    </Card>
    <Space style={{width: '100%', flexDirection: 'row-reverse'}}>              
      <Button onClick={handleOk} type='primary' loading={isEditingFields}>ok</Button>
      <Button type='default' onClick={props.onCancel}>Cancelar</Button>
    </Space>
  </Space>
}

export default Aggregation
