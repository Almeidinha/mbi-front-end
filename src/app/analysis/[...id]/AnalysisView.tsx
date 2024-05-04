"use client"

import { useAnalysisMutation, useAnalysisTableQuery } from '@/hooks/controllers/analysis'
import { defaultTo, is, isDefined } from '@/lib/helpers/safe-navigation'
import { Card, Flex, Modal, Row, Space, Table, Tooltip, Typography } from 'antd'
import { AddFilterIcon, AddSequenceIcon, AggregationIcon, DecimalPositionsIcon, HorizontalAnalysisIcon, InsertColumnIcon, OrderIcon, RefreshIcon, VerticalAnalysisIcon, ViewSequenceIcon } from '@/lib/icons/customIcons'
import { CloseCircleOutlined } from '@ant-design/icons'
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import AnalysisFilter from '../components/filters/Filter'
import useAnalysisState from '../hooks/use-analysis-state'
import { nanoid } from '@reduxjs/toolkit'
import { convertToStyleTag, extractPropValue } from '@/lib/helpers/doomHelper'
import EditFieldComponent from '../components/field/EditField'
import DangerousElement from '@/lib/helpers/DangerousElement'
import { IHeader, ITableCell, ITableRow } from '@/lib/types/Analysis'
import ManageAnalysis from '../components/manage-analysis-type/ManageAnalysis'
import ViewSequence from '../components/viewSequence/ViewSequence'
import DecimalPositions from '../components/decimal-positions/DecimalPositions'
import AnalysisTypeConfiguration from '../components/analysis-type-configuration'
import { AnalysisType, FieldTypes } from '@/lib/types/Filter'
import OrderFields from '../components/order-fields/OrderFields'
import Aggregation from '../components/aggregation/Aggregation'

import "./analysisView.css"

interface IAnalysisView {
  indicatorId: number
}

const getHeaderTitle = (header: IHeader, clickAction: () => void) => {
  if (isDefined(header.properties?.html)) {
    return <Row 
      onClick={clickAction}  
      className='header' 
      style={{cursor: 'pointer'}} 
      dangerouslySetInnerHTML={{__html: header.properties.html}}
    />
  }

  return header.title;
}

const renderCell = (cell: ITableCell) => {
  if (!isDefined(cell)) {
    return {
      props: {
        colSpan: 0,
        rowSpan: 0
      }
    }
  }
  return {
    children: <div className={cell?.className} dangerouslySetInnerHTML={{__html: cell?.value}}/>,
    props: {
      colSpan: defaultTo(cell?.colspan, 1),
      rowSpan: defaultTo(cell?.rowspan, 1)
    }
  }
}

const AnalysisView = (params: IAnalysisView) => {

  const {
    indicatorId
  } = params

  const {
    analysisResult,
    loadingAnalysisResult,
    reloadAnalysisResult, 
    fetchingAnalysisResult,
  } = useAnalysisTableQuery({analysisId: indicatorId})

  const  {
    toggleSequence,
    isTogglingSequenceSequence,
  } = useAnalysisMutation()

  const {
    indicator,
    setIndicator
  } = useAnalysisState.useContainer()

  const [modalTitle, setModalTitle] = useState<ReactNode>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<ReactNode | undefined>(undefined);
  
  useEffect(() => {
    if (isDefined(analysisResult?.indicator)) {
      setIndicator(analysisResult?.indicator);
    }    
  }, [analysisResult, setIndicator])

  const table = analysisResult?.table;
  const hasNumericFields = indicator?.fields?.some(field => field.defaultField === 'S' && field.fieldType === FieldTypes.METRIC);

  const rows: ITableRow[]  = table?.rows || [];
  
  const getHeaders = useCallback(() => {
    const tableHeaders = defaultTo(table?.headers, []);
    return is(indicator?.multidimensional) 
      ? [{title: 'Seq', properties: {className: '', html: ''}}, ...tableHeaders] 
      : tableHeaders
  }, [indicator?.multidimensional, table?.headers])

  const columns = useMemo(() => {         
    if (!table) {
      return [];
    }
    
    const handleHeaderClick = (header: IHeader) => {
      const fieldId = extractPropValue(header.properties.html, 'data-code-col');
      
      if (isDefined(fieldId)) {
        setModalTitle(<Typography.Text type='secondary'>Edit Field Properties</Typography.Text>)
        setModalContent(<EditFieldComponent 
          fieldId={fieldId} 
          onFinish={() => {
            setModalOpen(false) 
            reloadAnalysisResult()
          }} 
          onCancel={() => setModalOpen(false)}/>
        )
        setModalOpen(true)
      } 
    }

    return getHeaders().map((header: IHeader, index: number) => {    
      return {
        colSpan: header.title === "Seq" && is(indicator?.multidimensional) ? 0 : defaultTo(header.properties?.colspan, 1),
        title: getHeaderTitle(header, handleHeaderClick.bind(null, header)),
        key: `${header.title}-${index}`,
        dataIndex: header.title,
        width: header.title === "Seq" ? 30 : undefined,
        render: (cell: ITableCell) => renderCell(cell),
        onCell: (row: ITableRow, index: number| undefined) => {
          return {
            onClick: () => {
              console.log('row clicked: ', `index = ${index}, row = ${JSON.stringify(row)}`)
            }
          }
        }
      }
    })
  }, [getHeaders, indicator?.multidimensional, reloadAnalysisResult, table])

  if (loadingAnalysisResult) {
    return <Card type='inner' loading={loadingAnalysisResult} />
  }

  const data: ITableRow[] = rows.map((row: ITableRow) =>  {
    return getHeaders().reduce((acc: ITableRow, header: IHeader, index: number) => ({ 
      ...acc, 
      [header.title]: row[index],
      key: nanoid()
    }), {} as ITableRow) 
  }).filter(Boolean);

  const handleFilterClick = () => {
    setModalTitle(<Typography.Text type='secondary'>Add Filter</Typography.Text>)
    setModalContent(<AnalysisFilter indicatorId={indicatorId} onFinish={() => setModalOpen(false)} />)
    setModalOpen(true)
  }

  const handAggregationClick = () => {
    setModalTitle(<Typography.Text type='secondary'>Add Aggregation</Typography.Text>)
    setModalContent(<Aggregation onCancel={() => setModalOpen(false)} onFinish={() => {
      setModalOpen(false)
      reloadAnalysisResult()
    }} />)
    setModalOpen(true)
  }

  const handleAnalysisTypeChange = () => {
    setModalTitle(<div style={{height: '20px'}}/>)
    setModalContent(<ManageAnalysis onFinish={() => setModalOpen(false)} />)
    setModalOpen(true)
  }

  const handleSequenceClick = () => {
    toggleSequence({
      analysisId: indicatorId,
      add: !is(indicator?.usesSequence)
    })
  }

  const handleViewSequenceClick = () => {
    setModalTitle(<Typography.Text type='secondary'>View Sequence</Typography.Text>)
    setModalContent(<ViewSequence 
      onCancel={() => setModalOpen(false)} 
      onFinish={() => {
        setModalOpen(false)
        reloadAnalysisResult()
      }}/>)
    setModalOpen(true)
  }

  const handleDecimalPositionsClick = () => {
    if (!hasNumericFields) {
      return
    }
    setModalTitle(<Typography.Text type='secondary'>Decimal Positions</Typography.Text>)
    setModalContent(<DecimalPositions 
      onCancel={() => setModalOpen(false)} 
      onFinish={() => {
        setModalOpen(false)
        reloadAnalysisResult()
      }}/>)
    setModalOpen(true)
  }

  const handleOrderClick = () => {
    setModalTitle(<Typography.Text type='secondary'>Set Fields Order</Typography.Text>)
    setModalContent(<OrderFields
      onCancel={() => setModalOpen(false)} 
      onFinish={() => {
        setModalOpen(false)
        reloadAnalysisResult()
      }}/>)
    setModalOpen(true)
  }

  const handleVerticalAnalysisClick = () => {
    if (!indicator?.multidimensional) {
      return;
    }
    setModalTitle(<Typography.Text type='secondary'>Vertical Analysis Configuration</Typography.Text>)
    setModalContent(<AnalysisTypeConfiguration
      analysisType={AnalysisType.VERTICAL} 
      onCancel={() => setModalOpen(false)} 
      onFinish={() => {
        setModalOpen(false)
        reloadAnalysisResult()
      }}/>)
    setModalOpen(true)
  }

  const handleHorizontalAnalysisClick = () => {
    if (!indicator?.multidimensional) {
      return;
    }
    setModalTitle(<Typography.Text type='secondary'>Horizontal Analysis Configuration</Typography.Text>)
    setModalContent(<AnalysisTypeConfiguration
      analysisType={AnalysisType.HORIZONTAL} 
      onCancel={() => setModalOpen(false)} 
      onFinish={() => {
        setModalOpen(false)
        reloadAnalysisResult()
      }}/>)
    setModalOpen(true)
  }

  const refreshAnalysis = () => {
    reloadAnalysisResult()
  }

  const getTitle = () => {
    return <Space className='analysis-table-title' direction='horizontal'>
      <Flex>
        <Typography.Text type='secondary' strong>{indicator?.name ?? 'Indicator'}</Typography.Text>
      </Flex>
      <Flex justify='flex-end' gap={4}>
        <Flex onClick={handleAnalysisTypeChange}><Tooltip title="Change Type"><InsertColumnIcon className='active'/></Tooltip></Flex>
        <Flex onClick={handleFilterClick}><Tooltip title="Filter"><AddFilterIcon className='active'/></Tooltip></Flex>
        <Flex onClick={handAggregationClick}><Tooltip title="Aggregations"><AggregationIcon className={hasNumericFields ? 'active' : ''}/></Tooltip></Flex>
        <Flex onClick={handleViewSequenceClick}><Tooltip title="Change View Order"><ViewSequenceIcon className='active'/></Tooltip></Flex>
        <Flex onClick={handleSequenceClick}><Tooltip title="Add Sequence"><AddSequenceIcon className='active'/></Tooltip></Flex>
        <Flex onClick={handleVerticalAnalysisClick}><Tooltip title="Vertical Analysis"><VerticalAnalysisIcon className={indicator?.multidimensional ? 'active' : ''}/></Tooltip></Flex>
        <Flex onClick={handleHorizontalAnalysisClick}><Tooltip title="Horizontal Analysis"><HorizontalAnalysisIcon className={indicator?.multidimensional ? 'active' : ''}/></Tooltip></Flex>
        <Flex onClick={handleOrderClick}><Tooltip title="Fields Order"><OrderIcon className='active'/></Tooltip></Flex>
        <Flex onClick={handleDecimalPositionsClick}><Tooltip title="Decimal Positions"><DecimalPositionsIcon className={hasNumericFields ? 'active' : ''}/></Tooltip></Flex>
        <Flex onClick={refreshAnalysis}><Tooltip title="Reload"><RefreshIcon className='active'/></Tooltip></Flex>
      </Flex>
    </Space>
  } 

  return <Card type='inner'>
    <DangerousElement markup={convertToStyleTag(defaultTo(table?.styles, []))}/>    
    <Table
      title={getTitle}
      className='analysis-table'
      scroll={{ x: "max-content" }}
      bordered
      loading={loadingAnalysisResult || fetchingAnalysisResult || isTogglingSequenceSequence}
      size='small'
      dataSource={data}
      columns={columns}
      pagination={{
        hideOnSinglePage: true,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
      }}
    />
    <Modal
      width="auto"
      maskClosable={false}
      centered
      title={modalTitle}
      open={modalOpen}
      onCancel={() => setModalOpen(false)}
      destroyOnClose
      closeIcon={<CloseCircleOutlined />}
      footer={null}
      style={{minWidth: '600px'}}

    >
      {modalContent}
    </Modal>    
  </Card>

}

export default AnalysisView
