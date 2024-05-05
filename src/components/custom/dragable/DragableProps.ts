import { mapOrder } from "@/lib/helpers/arrays";

interface IDragProps<T> {
  fields: T[]
  dataIndex: keyof T
  setter: React.Dispatch<React.SetStateAction<T[]>>;
}


export const getDragProps = <T,>(props: IDragProps<T>) => {
  return {
    onDragEnd(fromIndex: number, toIndex: number) {
      const fields = [...props.fields];
      const item = fields.splice(fromIndex, 1)[0];
      fields.splice(toIndex, 0, item);
      const ordered = mapOrder(fields, fields.map((d) => d[props.dataIndex]), props.dataIndex)
      props.setter([...ordered])
    },
    handleSelector: "svg",
  }
}