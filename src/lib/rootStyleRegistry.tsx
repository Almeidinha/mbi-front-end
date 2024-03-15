"use client"

import { StyleProvider, createCache, extractStyle } from '@ant-design/cssinjs'
import { useServerInsertedHTML } from 'next/navigation'
import type Entity from '@ant-design/cssinjs/es/Cache'
import React from 'react'

const StyledComponentsRegistry = ({ children }: { children: React.ReactNode }) => {

  const cache = React.useMemo<Entity>(() => createCache(), [createCache])

  useServerInsertedHTML(() => (
    <style id="antd" dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }} />
  ))

  return <StyleProvider cache={cache}>{children}</StyleProvider>
}

export default StyledComponentsRegistry