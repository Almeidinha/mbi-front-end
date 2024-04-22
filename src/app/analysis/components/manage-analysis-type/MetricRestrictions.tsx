import { FieldDTO } from '@/lib/types/Analysis';
import { Button, Card, Col, Row, Space, Table } from 'antd'
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react'
import useAnalysisState from '../../hooks/use-analysis-state';
import { defaultTo, isDefined } from '@/lib/helpers/safe-navigation';
import { useMetricRestrictionsActionsController, useMetricRestrictionsController } from '@/hooks/controllers/metricRestrictions';
import { FieldTypes } from '@/lib/types/Filter';
import { MetricRestriction } from './types';
import CustomTableHeader from '@/components/custom/custom-table-header';

const tableProps = {
  size: "small" as const,
  bordered: true as const,
  
  pagination: false as const,
};

const columns: ColumnsType<FieldDTO> = [
  {
    title: 'Visible Dimentions',
    key: 'name',
    dataIndex: 'name',
  },
]

interface MetricRestrictionsProps {
  onOk?: () => void
  onCancel?: () => void
}

const MetricRestrictions = (props: MetricRestrictionsProps) => {

  const {
    indicator,
  } = useAnalysisState.useContainer()

  const {
    metricRestrictions,
    loadingMetricRestrictions,
  } = useMetricRestrictionsController({indicatorId: indicator?.code})

  const {
    saveRestrictions,
    savingRestrictions
  } = useMetricRestrictionsActionsController()

  const dimensions = defaultTo(indicator?.fields.filter((field) => field.fieldType === FieldTypes.DIMENSION), [])
  const metrics = defaultTo(indicator?.fields.filter((field) => field.fieldType === FieldTypes.METRIC), [])
  
  const [restrictions, setRestrictions] = useState<MetricRestriction[]>(defaultTo(metricRestrictions, []))
  const [metricKey, setMetricKey] = useState<React.Key>(metrics[0].fieldId!)

  const [dimensionKeys, setDimensionKeys] = useState<React.Key[]>([])

  useEffect(() => {
    
    setDimensionKeys(
      dimensions
      .filter((dimension) => !metricRestrictions?.some((restriction) => 
        restriction.metricId === metricKey && restriction.dimensionId === dimension.fieldId
      ))
      .map((dimension) => dimension.fieldId!!)
    )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metricKey, metricRestrictions])

  const handleVisibleDimensionChange = (selectedRowKeys: React.Key[], selectedRows: FieldDTO[]) => {
    setRestrictions((prev) => [
      ...prev.filter((rest) => !selectedRowKeys.some((key) => rest.dimensionId === key && rest.metricId === Number(metricKey))),
      ...dimensions.filter((dim) => dim.fieldId && !selectedRowKeys.includes(dim.fieldId)).map((dim) => ({
        indicatorId: indicator?.code!,
        metricId : Number(metricKey),
        dimensionId : dim.fieldId!
      }))
    ])
    setDimensionKeys(selectedRowKeys)
  }

  const handleRestrictionsChange = () => {
    saveRestrictions({
      restrictions,
      onSuccess: () => props.onOk?.()
    })
  }

  return <Space direction='vertical' style={{width: '100%'}}>
    <Card type='inner' loading={loadingMetricRestrictions || savingRestrictions}>
      <Col span={24}>
        <Row>
          <Col span={11}>
            <CustomTableHeader title='Métrics'>
              <Table
                {...tableProps}
                style={{width: '100%', overflow: 'auto'}}
                rootClassName='metrics-restrictions-table'
                columns={columns}
                dataSource={metrics.map((metric) => ({...metric, key: metric.fieldId}))}              
                showHeader={false}
                rowSelection={{
                  type: 'radio',
                  selectedRowKeys: [metricKey],
                  onChange: (selectedRowKeys: React.Key[]) => setMetricKey(selectedRowKeys[0]) 
                }}
              />
            </CustomTableHeader>
          </Col>
          <Col span={2}/>
          <Col span={11}>
            <Table
              {...tableProps}
              rootClassName='dimensions-restrictions-table'
              columns={columns}
              dataSource={dimensions.map((dimension) => ({...dimension, key: dimension.fieldId}))}
              rowSelection={{
                type: 'checkbox',
                selectedRowKeys: dimensionKeys,
                onChange: (handleVisibleDimensionChange)
              }}
            />
          </Col>
        </Row>
      </Col>
    </Card>
    <Space style={{width: '100%', flexDirection: 'row-reverse'}}>
      <Button onClick={handleRestrictionsChange} type='primary'>ok</Button>
      <Button type='default' onClick={props.onCancel}>Cancelar</Button>      
    </Space>
  </Space>
}

export default MetricRestrictions
