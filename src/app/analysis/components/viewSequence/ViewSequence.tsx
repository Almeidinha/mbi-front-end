import React, { useLayoutEffect, useState } from 'react'
import { FieldDTO } from '@/lib/types/Analysis';
import { Button, Card, Space, Table, Typography } from 'antd'
import { ColumnsType } from 'antd/es/table';
import ReactDragListView from 'react-drag-listview';
import useAnalysisState from '../../hooks/use-analysis-state';
import CustomTableHeader from '@/components/custom/custom-table-header';
import { CubeStackIcon, SetSquareIcon } from '@/lib/icons/customIcons';
import { FieldTypes } from '@/lib/types/Filter';
import { cloneDeep, is, isDefined } from '@/lib/helpers/safe-navigation';
import { mapOrder } from '@/lib/helpers/arrays';
import { MenuOutlined } from '@ant-design/icons';
import { useFieldsMutation } from '@/hooks/controllers/fields';
import { convertToBIAnalysisFieldDTO } from '@/lib/helpers/converters';
import './view-sequence.css';

const tableProps = {
  size: "small" as const,
  bordered: true as const,
  showHeader: false as const,
  pagination: false as const,
};

interface IProps {
  onFinish?: () => void
  onCancel?: () => void
}

const sourceColumns: ColumnsType<FieldDTO> = [
  {
    key: "operate",
    width: 15,
    render: (text, record, index) =>
    <MenuOutlined className="drag-handle"/>
  },
  {
    title: 'Fields',
    key: 'name',
    dataIndex: 'name',
    render: (text, record) => record.fieldType === FieldTypes.DIMENSION 
    ? <Space direction='horizontal' size={6}>
        <CubeStackIcon style={{color:'#3377cc'}}/><Typography.Text>{text}</Typography.Text>
      </Space> 
    : <Space direction='horizontal' size={6}>
        <SetSquareIcon style={{color:'#3377cc'}}/><Typography.Text>{text}</Typography.Text>
      </Space>
  },
]

const ViewSequence = (props: IProps) => {

  const {
    editFields,
    isEditingFields,
  } = useFieldsMutation()

  const {
    indicator,
  } = useAnalysisState.useContainer()

  const [fields, setFields] = useState<FieldDTO[]>([])

  useLayoutEffect(() => {
    if (isDefined(indicator)) {
      const fields = cloneDeep(indicator.fields)
      fields.sort((a, b) => a.visualizationSequence - b.visualizationSequence)
      if (is(indicator.multidimensional)) {
        setFields([
          ...fields.filter((field) => field.fieldType === FieldTypes.DIMENSION),
          ...fields.filter((field) => field.fieldType === FieldTypes.METRIC)
        ]) 
      } else {
        setFields(fields)
      }
    }
  }, [indicator])

  const handleOk = () => {
    if (isDefined(fields)) {
      fields.forEach((field, i) => {
        field.visualizationSequence = field.defaultField !== 'N' ? i+1 : 0
      })
      editFields({
        fields: fields.map((field) => convertToBIAnalysisFieldDTO(field)),
        onSuccess: () => props.onFinish?.()
      })
    }
  }

  const dragProps = {
    onDragEnd(fromIndex: number, toIndex: number) {
      const data = [...fields.filter((field) => ['S', 'T'].includes(field.defaultField))];
      const item = data.splice(fromIndex, 1)[0];
      data.splice(toIndex, 0, item);
      const ordered = mapOrder(fields, data.map((d) => d.fieldId), "fieldId")
      
      if (is(indicator?.multidimensional)) {
        const dimensions = ordered.filter(field => field.fieldType === FieldTypes.DIMENSION)
        const metrics = ordered.filter(field => field.fieldType === FieldTypes.METRIC)
        setFields([...dimensions, ...metrics])
      } else {
        setFields([...ordered])
      }
      
    },
    handleSelector: "svg",
  };

  return <Space direction='vertical' style={{width: '100%'}}>
    <Card type='inner' loading={isEditingFields}>
      <CustomTableHeader title='Available Fields'>
        <ReactDragListView {...dragProps}>
          <Table
            {...tableProps}
            style={{width: '100%', overflow: 'auto'}}
            rootClassName='view-sequence-table'
            columns={sourceColumns}
            dataSource={fields.filter(field => field.defaultField === 'S').map(field => ({...field, key: field.fieldId}))}
          />
        </ReactDragListView>
      </CustomTableHeader>
    </Card>
    <Space style={{width: '100%', flexDirection: 'row-reverse'}}>              
      <Button onClick={handleOk} type='primary'>ok</Button>
      <Button type='default' onClick={props.onCancel}>Cancelar</Button>
    </Space>
  </Space>
}

export default ViewSequence
