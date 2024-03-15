import first from 'lodash/first.js'
import isString from 'lodash/isString.js'
import isFunction from 'lodash/isFunction.js'
import uniqueId from 'lodash/uniqueId.js'
import debounce from 'lodash/debounce.js'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'

export {
  first,
  isString,
  isFunction,
  uniqueId,
  debounce,
}

export function isNil<T>(value: T | undefined | null): value is undefined | null {
  return value === null || value === undefined
}

export function isDefined<T>(value: T | undefined | null): value is T {
  return !isNil(value)
}

export function defaultTo<T>(value: T | undefined | null, fallback: T): T {
  return isDefined(value) ? value : fallback
}

export function isEmpty<T extends { length: number }>(obj: T) {
  return obj.length < 1
}


export function validStrValue<T extends { length: number }>(obj: T | undefined | null): obj is T {
  return isDefined(obj) && !isEmpty(obj)
}

/** used for evaluating tri-state logic (true | false | undefined) */
export function is (pred?: boolean): boolean {
  return isDefined(pred) && pred
}

export function toArray<T>(obj: T | T[] | undefined | null): T[] {
  return isDefined(obj) ? Array.isArray(obj) ? obj : [obj] : []
}

export function safeArray<T>(arr: T[] | undefined | null): T[] {
  return isDefined(arr) ? arr : []
}

export function safeCallback <T>(f?: (e: T) => void, e?: T) {
  if (isDefined(f)) {
    if (isDefined(e)) {
      f(e)
    } else {
      (f as () => void)()
    }
  }
}

export function getIdFromParameters(params: Params, name: string) {
  return isDefined(params[name]) && !isNaN(Number(params[name][0]))
    ? Number(params[name][0]) : undefined
}

export function chunkArray(inputArray: any[], perChunk: number) {
   return inputArray.reduce((resultArray, item, index) => { 
    const chunkIndex = Math.floor(index/perChunk)
  
    if(!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [] 
    }
  
    resultArray[chunkIndex].push(item)
  
    return resultArray
  }, [])
}

export function* chunks<T>(arr: T[], n: number): Generator<T[], void> {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n);
  }
}