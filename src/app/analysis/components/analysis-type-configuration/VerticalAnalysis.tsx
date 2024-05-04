import React from 'react'

import { FieldDTO } from '@/lib/types/Analysis'
import { Button, Card, Select, Space, Switch, Table } from 'antd'
import { analysisTypeTableProps } from '.'
import { ColumnType } from 'antd/es/table'
import enumToOptions from '@/lib/helpers/enumToOptions'
import { VerticalAnalysisTypes, VertycalTotalization } from './types'
import './pages.css'
import { is } from '@/lib/helpers/safe-navigation'


interface IProps {
  onFinish?: () => void
  onCancel?: () => void
  fields: FieldDTO[]
  setFields: React.Dispatch<React.SetStateAction<FieldDTO[]>>
}

const getColumns = (handleSave: (field: FieldDTO) => void): ColumnType<FieldDTO>[] => {
  return [
    {
      title: 'Field',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: 'Totalizar',
      key: 'totalizingField',
      dataIndex: 'totalizingField', 
      align: 'center',
      width: 160,
      render: (value: boolean, record: FieldDTO) => <Select 
        options={enumToOptions(VertycalTotalization)}
        value={record.applyTotalizationExpression ? 'E' : (value ? 'S' : 'N')}
        style={{width: '100%'}}
        onChange={(value) => handleSave({...record, applyTotalizationExpression: value === 'E', totalizingField: value !== 'N'})}/>
    },
    {
      title: 'Analise vertical',
      key: 'verticalAnalysisType',
      dataIndex: 'verticalAnalysisType', 
      align: 'center',
      width: 160,
      render: (value: string, record: FieldDTO) => <Select 
        options={enumToOptions(VerticalAnalysisTypes)}
        value={value}
        style={{width: '100%'}}
        onChange={(value) => handleSave({...record, verticalAnalysis: value !== 'N', verticalAnalysisType: value})}/>
    },
    {
      title: 'Accumulated Participation',
      key: 'accumulatedParticipation',
      dataIndex: 'accumulatedParticipation', 
      align: 'center',
      render: (value: boolean, record: FieldDTO) => <Switch 
        checked={value} 
        onChange={() => handleSave({...record, accumulatedParticipation: !value})} 
        />
    },
    {
      title: 'Accumulated Value',
      key: 'accumulatedValue',
      dataIndex: 'accumulatedValue',
      align: 'center',
      render: (value: boolean, record: FieldDTO) => <Switch 
        checked={value} 
        onChange={() => handleSave({...record, accumulatedValue: !value})} 
        />
    }
  ]
}  

const VerticalAnalysis = (props: IProps) => {


  const handleSave = (row: FieldDTO) => {
    const updatedFields = props.fields.map(field => {
      if (field.fieldId === row.fieldId) {
        return { ...field, ...row };
      }
      return field;
    });
    props.setFields(updatedFields);
  };

  return <Space direction='vertical' style={{width: '100%'}}>
    <Card type='inner'>
      <Table
        {...analysisTypeTableProps}
        rootClassName='vertical-analysis-table'
        rowClassName={() => 'editable-row'}
        columns={getColumns(handleSave)}
        dataSource={props.fields}
      />
    </Card>
    <Space style={{width: '100%', flexDirection: 'row-reverse'}}>              
      <Button onClick={props.onFinish} type='primary'>ok</Button>
      <Button type='default' onClick={props.onCancel}>Cancelar</Button>
    </Space>
  </Space>
}

export default VerticalAnalysis
