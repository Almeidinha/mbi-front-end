import { FieldDTO, MetricDimensionRestrictionDTO } from '@/lib/types/Analysis';
import { Button, Card, Col, Row, Space, Table } from 'antd'
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react'
import useAnalysisState from '../../hooks/use-analysis-state';
import { defaultTo } from '@/lib/helpers/safe-navigation';
import { useMetricRestrictionsActionsMutation } from '@/hooks/controllers/metricRestrictions';
import { FieldTypes } from '@/lib/types/Filter';
import CustomTableHeader from '@/components/custom/custom-table-header';
import './metric-restrictions.css'

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
    saveRestrictions,
    savingRestrictions,
    removeAllRestriction,
    removingAllRestriction
  } = useMetricRestrictionsActionsMutation()

  const dimensions = defaultTo(indicator?.fields.filter((field) => field.fieldType === FieldTypes.DIMENSION), [])
  const metrics = defaultTo(indicator?.fields.filter((field) => field.fieldType === FieldTypes.METRIC), [])
  
  const [restrictions, setRestrictions] = useState<MetricDimensionRestrictionDTO[]>(defaultTo(indicator?.metricDimensionRestrictions, []))
  const [metricKey, setMetricKey] = useState<React.Key>(metrics[0].fieldId!)

  const [dimensionKeys, setDimensionKeys] = useState<React.Key[]>([])

  useEffect(() => {
    
    setDimensionKeys(
      dimensions
      .filter((dimension) => !restrictions.some((restriction) => 
        restriction.metricId === metricKey && restriction.dimensionIds.includes(Number(dimension.fieldId))
      ))
      .map((dimension) => Number(dimension.fieldId))
    )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metricKey, restrictions])

  const handleVisibleDimensionChange = (selectedRowKeys: React.Key[], selectedRows: FieldDTO[]) => {

    const restrictedKeys = dimensions
      .filter((dim) => !selectedRowKeys.includes(Number(dim.fieldId)))
      .map((dim) => Number(dim.fieldId))
    
    const existingRestrictionIndex = restrictions.findIndex(
      (restriction) => restriction.metricId === Number(metricKey)
    );

    if (existingRestrictionIndex !== -1) {
      const updatedRestrictions = [...restrictions];
      updatedRestrictions[existingRestrictionIndex].dimensionIds = restrictedKeys;
  
      if (restrictedKeys.length === 0) {
        updatedRestrictions.splice(existingRestrictionIndex, 1);
      }
  
      setRestrictions(updatedRestrictions);
    } else if (restrictedKeys.length > 0) {
      const newRestriction: MetricDimensionRestrictionDTO = {
        metricId: Number(metricKey),
        dimensionIds: restrictedKeys,
      };
  
      setRestrictions([...restrictions, newRestriction]);
    }
  }

  const handleRestrictionsChange = () => {
    if (restrictions.length === 0) {
      removeAllRestriction({
        indicatorId: indicator?.code!,
        onSuccess: () => props.onOk?.()
      })
    } else {
      saveRestrictions({
        restrictions: restrictions.flatMap((restriction) =>
          restriction.dimensionIds.map((dimensionId) => ({
            indicatorId: indicator?.code!, 
            metricId: restriction.metricId,
            dimensionId: dimensionId,
          }))
        ),
        onSuccess: () => props.onOk?.()
      })
    }
  }



  return <Space direction='vertical' style={{width: '100%'}}>
    <Card type='inner' loading={savingRestrictions || removingAllRestriction }>
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
