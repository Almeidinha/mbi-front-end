export const spaceValidator = (_: any, value: any) => 
  !value.includes(" ")
    ? Promise.resolve()
    : Promise.reject(new Error("No spaces allowed"))