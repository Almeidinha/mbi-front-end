'use client'
import { useAnalysisDtoListController } from '@/hooks/controllers/analysis'
import { useTestDataController } from '@/hooks/controllers/testStuff'
import { defaultTo, isDefined, isNil } from '@/lib/helpers/safe-navigation'
import { Card, Select, Space } from 'antd'
import React, { useEffect, useState } from 'react'

const TestPage = () => {

  const [id, setId] = useState<string | undefined>(undefined)

  const {
    analysis
  } = useAnalysisDtoListController()
  
  const {
    testData,
    reloadTestData,
  } = useTestDataController({id})

  const handleIdChange = (id: string) => {
    setId(id)
    
  }

  useEffect(() => {
    if (isDefined(id)) {
      reloadTestData()
    }
  }, [id, reloadTestData])

  return <Card title="Test old Analysis here.">
    <Space direction='vertical' style={{width: '100%'}}>
      <Select options={defaultTo(analysis, []).map((ana) => ({
        label: ana.name,
        value: ana.id
      }))}
      style={{width: '250px'}}
      onChange={handleIdChange}
      />
      {
        testData && <div dangerouslySetInnerHTML={{__html: testData}} style={{height:'450px', overflow: 'auto'}}/>
      }
    </Space>
  </Card>
}

export default TestPage
