interface BIIndAlertColor {
  alertSequence: number;
  indicatorId: number;
  firstFieldId: number;
  firstFieldFunction: string;
  operator: string;
  valueType: string;
  firstValueReference: string;
  secondValueReference: string;
  secondFiled: number | null;
  secondFiledFunction: string;
  action: string;
  fontName: string;
  fontSize: number | null;
  fontStyle: string;
  fontColor: string;
  backgroundColor: string;
}