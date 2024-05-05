import { defaultTo } from "@/lib/helpers/safe-navigation"
import { useState } from "react"

interface ITableTransferRowClick<T, Key extends keyof T> {
  sourceKeys?: number[]
  destineKeys?: number[]
  key: Key
}


export const useTableTransferRowClick = <T extends { [K in Key]: number }, Key extends keyof T>(props: ITableTransferRowClick<T, Key>) => {

  const [sourceKeys, setSourceKeys] = useState<number[]>(defaultTo(props.sourceKeys, []))
  const [destineKeys, setDestineKeys] = useState<number[]>(defaultTo(props.destineKeys, []))

  const onSourceRowClick = (data: T, index?: number) => {
    return {
      onClick:  () => {
      
        const hasKey = sourceKeys.includes(data[props.key])
        if (hasKey) {
          setSourceKeys((oldData) => oldData.filter((key) => key !== data[props.key]))
        } else {
          setSourceKeys((oldData) => [...oldData, data[props.key]])
        }
      } 
    }
  }

  const onDestineRowClick = (data: T, index?: number) => {
    return {
      onClick:  () => {
      
        const hasKey = destineKeys.includes(data[props.key])
        if (hasKey) {
          setDestineKeys((oldData) => oldData.filter((key) => key !== data[props.key]))
        } else {
          setDestineKeys((oldData) => [...oldData, data[props.key]])
        }
      } 
    }
  }

  return { 
    sourceKeys, 
    destineKeys,
    setSourceKeys,
    setDestineKeys,
    onSourceRowClick, 
    onDestineRowClick
  }

}