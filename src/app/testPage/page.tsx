'use client'
import { useTestDataController } from '@/hooks/controllers/testStuff'
import { isNil } from '@/lib/helpers/safe-navigation'
import React from 'react'

const TestPage = () => {

  const {
    testData
  } = useTestDataController()

  if (isNil(testData)) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div dangerouslySetInnerHTML={{__html: testData}}/>
    </div>
  )
}

export default TestPage
