import enumToOptions from '@/lib/helpers/enumToOptions'
import { FieldDTO } from '@/lib/types/Analysis'
import { Button, Card, Select, Space, Switch } from 'antd'
import Table, { ColumnType } from 'antd/es/table'
import React from 'react'
import { HorizontalAccTypes, HorizontalAnalysisTypes } from './types'
import { analysisTypeTableProps } from '.'
import './pages.css'

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
      key: 'sumLine',
      dataIndex: 'sumLine', 
      align: 'center',
      width: 100,
      render: (value: boolean, record: FieldDTO) => <Switch 
        checked={value} 
        onChange={() => handleSave({...record, sumLine: !value})} 
        />
    },
    {
      title: 'Media',
      key: 'mediaLine',
      dataIndex: 'mediaLine', 
      align: 'center',
      width: 160,
      render: (value: boolean, record: FieldDTO) => <Switch 
      checked={value} 
      onChange={() => handleSave({...record, mediaLine: !value})} 
      />
    },
    {
      title: 'Participacao',
      key: 'horizontalParticipation',
      dataIndex: 'horizontalParticipation', 
      align: 'center',
      render: (value: boolean, record: FieldDTO) => <Switch 
        checked={value} 
        onChange={() => handleSave({...record, horizontalParticipation: !value})} 
        />
    },
    {
      title: 'Participacao Acumulada',
      key: 'horizontalParticipationAccumulated',
      dataIndex: 'horizontalParticipationAccumulated',
      align: 'center',
      render: (value: boolean, record: FieldDTO) => <Switch 
        checked={value} 
        onChange={() => handleSave({...record, horizontalParticipationAccumulated: !value})} 
        />
    },
    {
      title: 'Acumulado',
      key: 'accumulatedLine',
      dataIndex: 'accumulatedLine',
      align: 'center',
      width: 160,
      render: (value: string, record: FieldDTO) => <Select 
      options={enumToOptions(HorizontalAccTypes)}
      value={value}
      style={{width: '100%'}}
      onChange={(value) => handleSave({...record, accumulatedLine: value})}/>
    },
    {
      title: 'Analise Horizontal',
      key: 'horizontalAnalysisType',
      dataIndex: 'horizontalAnalysisType',
      align: 'center',
      width: 180,
      render: (value: string, record: FieldDTO) => <Select 
      options={enumToOptions(HorizontalAnalysisTypes)}
      value={value}
      style={{width: '100%'}}
      onChange={(value) => handleSave({...record, horizontalAnalysis: value !== 'N', horizontalAnalysisType: value})}/>
    }
  ]
}  

const HorizontalAnalysis = (props: IProps) => {

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
        rootClassName='horizontal-analysis-table'
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

export default HorizontalAnalysis
