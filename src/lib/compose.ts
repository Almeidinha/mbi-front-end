export const compose = (...fn: CallableFunction[]) => (arg: any) =>
  fn.reduce((returned, fn) => fn(returned), arg);