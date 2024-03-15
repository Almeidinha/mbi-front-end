import { BaseOptionType } from "antd/es/select"

export type FilterFunc<OptionType> = (inputValue: string, option?: OptionType) => boolean;

export const selectFilterSort = (optionA: BaseOptionType, optionB: BaseOptionType) => {   
  return (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
}

export const selectFilterOption = (input: string, option: BaseOptionType | undefined): boolean => {
  return (option?.label ?? '').toLocaleLowerCase().includes(input.toLocaleLowerCase())
}