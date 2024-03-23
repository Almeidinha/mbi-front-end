"use client"

import { useAnalysisController, useAnalysisTableController } from '@/hooks/controllers/analysis'
import { chunkArray, defaultTo, is, isDefined, isNil } from '@/lib/helpers/safe-navigation'
import { Card, Modal, Space, Table, Typography } from 'antd'

import "./analysisView.css"
import { AddFilterIcon, AddSequenceIcon, RefreshIcon } from '@/lib/icons/customIcons'
import { CloseCircleOutlined } from '@ant-design/icons'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import AnalysisFilter from '../components/filters/Filter'
import useAnalysisState from '../hooks/use-analysis-state'
import { nanoid } from '@reduxjs/toolkit'
import { convertToStyleTag, extractPropValue } from '@/lib/helpers/doomHelper'
import EditFieldComponent from '../components/field/EditField'
import DangerousElement from '@/lib/helpers/DangerousElement'
import { IHeader, IResultTableRow } from '@/lib/types/Analysis'

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
  } = useAnalysisTableController({analysisId: indicatorId})

  const  {
    toggleSequence,
    sequenceData,
    isTogglingSequenceSequence,
    sequenceChanged
  } = useAnalysisController({})

  const {
    indicator,
    setIndicator
  } = useAnalysisState.useContainer()

  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<ReactNode | undefined>(undefined);
  

  useEffect(() => {
    if (isDefined(analysisResult?.indicator)) {
      setIndicator(analysisResult?.indicator);
    }    
  }, [analysisResult, setIndicator])

  const table = analysisResult?.table;

  const rows: IResultTableRow[][]  = chunkArray(defaultTo(table?.rows, []), defaultTo(table?.headers.length, 0));
  const title = table?.title;

  
  const columns = useMemo(() => {         
    if (!table) {
      return [];
    }
    
    const handleHeaderClick = (header: IHeader) => {
      const fieldId = extractPropValue(header.properties.html, 'data-code-col');
      
      if (isDefined(fieldId)) {
        setModalTitle('Edit Field Properties')
        setModalContent(<EditFieldComponent fieldId={fieldId} onFinish={() => setModalOpen(false)} />)
        setModalOpen(true)
      } 
    }

    return defaultTo(table.headers, []).map((header: IHeader, index: number) => {    
      return {
        title: getHeaderTitle(header, handleHeaderClick.bind(null, header)),
        key: `${header.title}-${index}`,
        dataIndex: header.title,
        width: header.title === "Seq" ? 30 : undefined,
        render: (row: {className: string, value: string}) => {
          return <div className={row.className} 
            dangerouslySetInnerHTML={{__html: row.value}}
          />
        },
      }
    })
  }, [table])

  if (loadingAnalysisResult) {
    return <Card type='inner' loading={loadingAnalysisResult} />
  }

  const data: IResultTableRow[] = rows.map((row: IResultTableRow[]) =>  {
    return table?.headers.reduce((acc: IResultTableRow, header: IHeader, index: number) => ({ 
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
    <Space.Compact direction='vertical' className='analysis-table-wrapper'>
      <div className='custom-table-header'>
        <Typography.Text type='secondary' style={title?.style}>
          {indicator?.name || 'Indicator'}
        </Typography.Text>
        <Space.Compact style={{float: "right", gap: "4px"}}>
          <span onClick={handleFilterClick}><AddFilterIcon style={{fontSize: "24px", cursor: "pointer"}} /></span>
          <span onClick={handleSequenceClick}><AddSequenceIcon style={{fontSize: "24px", cursor: "pointer"}} /></span>
          <span onClick={refreshAnalysis}><RefreshIcon style={{fontSize: "24px", cursor: "pointer"}}/></span>
        </Space.Compact>
      </div>
    
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
    </Space.Compact>
    <Modal
      
      centered
      title={modalTitle}
      open={modalOpen}
      onCancel={() => setModalOpen(false)}
      destroyOnClose
      closeIcon={<CloseCircleOutlined />}
      footer={null}
    >
      {modalContent}
    </Modal>    
  </Card>

}

export default AnalysisView
