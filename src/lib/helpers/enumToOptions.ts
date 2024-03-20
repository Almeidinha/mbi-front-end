import { startCase, toLower } from "lodash";

const enumToOptions = (enumObj: { [key: string]: any }, zeroBasedIndex: boolean = true, labelName: string = 'label', valueName: string = 'value'): { [x: string]: any; }[] => {
  if (!enumObj) {
    return [];
  }
  return (Object.keys(enumObj)
    .filter(key => isNaN(Number(key))) || [])
    .map(key => ({
      [labelName]: startCase(toLower(key)),
      [valueName]: zeroBasedIndex ? enumObj[key] : enumObj[key] + 1
    }))
}

export default enumToOptions