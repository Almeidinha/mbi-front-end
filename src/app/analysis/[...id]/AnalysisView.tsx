"use client"

import { useAnalysisMutation, useAnalysisTableQuery } from '@/hooks/controllers/analysis'
import { defaultTo, is, isDefined } from '@/lib/helpers/safe-navigation'
import { Card, Modal, Table, Typography } from 'antd'

import "./analysisView.css"
import { AddFilterIcon, AddSequenceIcon, DecimalPositionsIcon, InsertColumnIcon, RefreshIcon, ViewSequenceIcon } from '@/lib/icons/customIcons'
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
import CustomTableHeader from '@/components/custom/custom-table-header'
import ViewSequence from '../components/viewSequence/ViewSequence'
import DecimalPositions from '../components/decilal-positions/DecimalPositions'

interface IAnalysisView {
  indicatorId: number
}

const getHeaderTitle = (header: IHeader, clickAction: () => void) => {
  if (isDefined(header.properties?.html)) {
    return <div 
      onClick={clickAction}  
      className='header' 
      style={{cursor: 'pointer'}} 
      dangerouslySetInnerHTML={{__html: header.properties.html}}
    />
  }

  return header.title;
}

const AnalysisView = (params: IAnalysisView) => {

  const {
    indicatorId
  } = params

  const {
    isError,
    analysisResult,
    loadingAnalysisResult,
    reloadAnalysisResult, 
    fetchingAnalysisResult,
  } = useAnalysisTableQuery({analysisId: indicatorId})

  const  {
    toggleSequence,
    sequenceData,
    isTogglingSequenceSequence,
    sequenceChanged
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
          onFinish={() => {setModalOpen(false), reloadAnalysisResult()}} 
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
        render: (cell: ITableCell) => {
          if (!isDefined(cell)) {
            return {
              props: {
                colSpan: 0,
                rowSpan: 0
              }
            };
          }
          return {
            children: <div className={cell?.className} dangerouslySetInnerHTML={{__html: cell?.value}}/>,
            props: {
              colSpan: defaultTo(cell?.colspan, 1),
              rowSpan: defaultTo(cell?.rowspan, 1)
            }
          }
        },
        onCell: (row: ITableRow, i: number| undefined) => {
          return {
            onClick: () => {
              console.log('row clicked: ', row)
            }
          }
        }
      }
    })
  }, [getHeaders, indicator?.multidimensional, table])

  if (loadingAnalysisResult) {
    return <Card type='inner' loading={loadingAnalysisResult} />
  }

  const data: ITableRow[] = rows.map((row: ITableRow) =>  {
    return getHeaders().reduce((acc: ITableRow, header: IHeader, index: number) => ({ 
      ...acc, 
      [header.title]: row[index],
      key: nanoid()
    }), {} as ITableRow) 
  }).filter(Boolean) as ITableRow[];

  const handleFilterClick = () => {
    setModalTitle(<Typography.Text type='secondary'>Add Filter</Typography.Text>)
    setModalContent(<AnalysisFilter indicatorId={indicatorId} onFinish={() => setModalOpen(false)} />)
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
    setModalTitle(<Typography.Text type='secondary'>Decimal Positions</Typography.Text>)
    setModalContent(<DecimalPositions 
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

  return <Card type='inner'>
    <DangerousElement markup={convertToStyleTag(defaultTo(table?.styles, []))}/> 
    <CustomTableHeader
      style={{borderColor: 'rgb(51, 119, 204)'}} 
      title={indicator?.name || 'Indicator'}
      actions={[
        {onClick: handleAnalysisTypeChange, icon: <InsertColumnIcon/>},
        {onClick: handleFilterClick, icon: <AddFilterIcon/>},
        {onClick: handleViewSequenceClick, icon: <ViewSequenceIcon/>},
        {onClick: handleSequenceClick, icon: <AddSequenceIcon/>},
        {onClick: handleDecimalPositionsClick, icon: <DecimalPositionsIcon/>},
        {onClick: refreshAnalysis, icon: <RefreshIcon/>}
      ]}  
    >
      <Table
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
    </CustomTableHeader>
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
