"use client"

import { useAnalysisMutation, useAnalysisTableQuery } from '@/hooks/controllers/analysis'
import { chunkArray, defaultTo, is, isDefined, isNil } from '@/lib/helpers/safe-navigation'
import { Card, Modal, Space, Table, Typography } from 'antd'

import "./analysisView.css"
import { AddFilterIcon, AddSequenceIcon, InsertColumnIcon, RefreshIcon } from '@/lib/icons/customIcons'
import { CloseCircleOutlined } from '@ant-design/icons'
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import AnalysisFilter from '../components/filters/Filter'
import useAnalysisState from '../hooks/use-analysis-state'
import { nanoid } from '@reduxjs/toolkit'
import { convertToStyleTag, extractPropValue } from '@/lib/helpers/doomHelper'
import EditFieldComponent from '../components/field/EditField'
import DangerousElement from '@/lib/helpers/DangerousElement'
import { IHeader, IResultTableRow } from '@/lib/types/Analysis'
import ManageAnalysis from '../components/manage-analysis-type/ManageAnalysis'
import CustomTableHeader from '@/components/custom/custom-table-header'

interface IAnalysisView {
  indicatorId: number
}

interface IRow {
  colspan: number
  rowspan: number
  className: string
  value: string
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

const getHeaderSize = (headers: IHeader[]) => {
  return defaultTo(headers.reduce(
    (total, header) => total + defaultTo(header.properties?.colspan, 1), 0), 0
  )
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

  const rows: IResultTableRow[][]  = chunkArray(defaultTo(table?.rows, []), getHeaderSize(defaultTo(table?.headers, [])));
  const title = table?.title;
  
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
        setModalTitle('Edit Field Properties')
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
        render: (row: IRow) => {
          if (!isDefined(row)) {
            return {
              props: {
                colSpan: 0,
                rowSpan: 0
              }
            };
          }
          return {
            children: <div className={row?.className} dangerouslySetInnerHTML={{__html: row?.value}}/>,
            props: {
              colSpan: defaultTo(row?.colspan, 1),
              rowSpan: defaultTo(row?.rowspan, 1)
            }
          }
        },
        onCell: (row: IResultTableRow, i: number| undefined) => {
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

  const data: IResultTableRow[] = rows.map((row: IResultTableRow[]) =>  {
    return getHeaders().reduce((acc: IResultTableRow, header: IHeader, index: number) => ({ 
      ...acc, 
      [header.title]: row[index],
      key: nanoid()
    }), {} as IResultTableRow) 
  }).filter(Boolean) as IResultTableRow[];

  const handleFilterClick = () => {
    setModalTitle('Add Filter')
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
    if (sequenceChanged) {
      console.log('sequence changed, data: ', sequenceData)
    }
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
        {onClick: handleSequenceClick, icon: <AddSequenceIcon/>},
        {onClick: refreshAnalysis, icon: <RefreshIcon/>}
      ]}  
    >
      <Table
        className='analysis-table'
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
