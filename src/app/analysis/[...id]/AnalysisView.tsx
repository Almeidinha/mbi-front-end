"use client"

import { useAnalysisController, useAnalysisTableController } from '@/hooks/controllers/analysis'
import { chunkArray, defaultTo, is, isDefined } from '@/lib/helpers/safe-navigation'
import { Card, Modal, Space, Table, Typography } from 'antd'

import "./analysisView.css"
import { AddFilterIcon, AddSequenceIcon, RefreshIcon } from '@/lib/icons/customIcons'
import { CloseCircleOutlined } from '@ant-design/icons'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import AnalysisFilter from '../components/filters/Filter'
import useAnalysisState from '../hooks/use-analysis-state'
import { nanoid } from '@reduxjs/toolkit'
import { extractPropValue } from '@/lib/helpers/doomHelper'
import EditFieldComponent from '../components/field/EditField'
import { set } from 'lodash'

interface IAnalysisView {
  indicatorId: number
}

type DataType = {
  [key: string]: any
}

interface Style {
  [key: string]: string;
}

const getHeaderTitle = (header: any, clickAction: () => void) => {
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

  const rows = chunkArray(defaultTo(table?.rows, []), table?.headers.length);
  const title = table?.title;

  
  const columns = useMemo(() => {         
    if (!table) {
      return [];
    }
    
    const getCellStyles = (className: string): Style | undefined => {    
      const classNames = className.split(' ');
  
      return classNames.reduce((acc: Style | undefined, currClassName: string) => {
          const style = table.styles?.[currClassName];
          if (style) {
              return { ...acc, ...style };
          }
          return acc;
      }, {});
    };

    const handleHeaderClick = (header: any) => {
      const fieldId = extractPropValue(header.properties.html, 'data-code-col');
      
      if (isDefined(fieldId)) {
        setModalTitle('Edit Field Properties')
        setModalContent(<EditFieldComponent fieldId={fieldId} onFinish={() => setModalOpen(false)} />)
        setModalOpen(true)
      }
      
    }

    return defaultTo(table.headers, []).map((header: any, index: number) => {    
      return {
        title: getHeaderTitle(header, handleHeaderClick.bind(null, header)),
        key: `${header.title}-${index}`,
        dataIndex: header.title,
        width: 100,
        render: (text: string, record: any) => {
          return <div className={record.className.split(' ')[0]} style={{
              ...getCellStyles(record.className),
              padding: '4px 4px',  
              height: '100%',
              width: '100%',
              minWidth:'100%',
            }}
            dangerouslySetInnerHTML={{__html: text}}
            />
        },
      }
    })
  }, [table])

  if (loadingAnalysisResult) {
    return <Card type='inner' loading={loadingAnalysisResult} />
  }

  const data: DataType[] = rows.map((row: any) => {
    return table?.headers.reduce((a: any, v: any, i: number) => ({ 
      ...a, 
      [v.title]: row[i].value, 
      className: row[i].className,
      key: nanoid()
    }), {}) 
  })

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

  return <Card type='inner' /*style={{
      maxHeight: "100%",
    }} bodyStyle={{
      maxHeight: "60vh",
      overflow: "auto",
    }}*/>    
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
        // scroll={{ y: 450 }}
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
