import {
  tableWidth,
  tableMarginLeft,
  tableMarginTop,
  tableRowNumbers,
  fieldHeight,
  titleHeight,
  commentHeight,
} from "../config/settings";

import useWizardState from "@/wizard/hooks/use-wizard-state";
import { TableDict } from "../types";

type TableModel = {
  addTable: (table: TableDict) => void;
  updateGraph: () => Promise<void>;
  updateTable: (table: TableDict) => void;
  removeTable: (tableId: string) => void;
  calcXY: (start: number, tables?: TableDict[]) => [number, number];
};

const tableModel: () => TableModel = () => {
  const {
    tableList,
    setTableDict,
    setLinkDict,
    box,
  } = useWizardState.useContainer();

  const updateGraph = async () => {
    try {

    } catch (e) {
      console.log(e);
    }
  };

  const calcXY = (start: number, tables = tableList): [number, number] => {
    const index = start || Math.max(1, tables.length);
    let x, y;

    if (tables.length === 0) {
        x = box.x + 196 + 72;
        y = box.y + 72;
    } else {
        const lastTable = tables[index - 1];
        if (index < tableRowNumbers) {
            x = lastTable.x + tableWidth + tableMarginLeft;
            y = lastTable.y;
        } else {
            const { fields } = lastTable;
            x = lastTable.x;
            y = lastTable.y + fields.length * fieldHeight + titleHeight + commentHeight + tableMarginTop;
        }
    }

    return [x, y];
  };

  const removeTable = (tableId: string) => {
    setTableDict(state => {
        const newState = { ...state };
        delete newState[tableId];
        return newState;
    });

    setLinkDict(state => {
        const newState = { ...state };
        Object.keys(newState).forEach(key => {
            if (newState[key].endpoints.find((endpoint: { id: string; }) => endpoint.id === tableId)) {
                delete newState[key];
            }
        });
        return newState;
    });

  };

  const addTable = (table: TableDict) => {
    const newTable = {
      [table.id]: {
        ...table
      },
    }
    setTableDict(state => ({ ...state, ...newTable }));
  };

  const updateTable = (table: TableDict) => {
    if (table) {
      setTableDict((state) => {
        return {
          ...state,
          [table.id]: {
            ...state[table.id],
            ...table,
          },
        };
      });
    }
    setLinkDict((state) => {
      const newState = { ...state };
      Object.keys(newState).forEach((key) => {
        if (
          newState[key].endpoints.some(
            (endpoint: { id: string; fieldId: string }) =>
              endpoint.id === table.id &&
              !table.fields.some(
                (field: { id: string }) => field.id === endpoint.fieldId
              )
          )
        )
          delete newState[key];
      });
      return newState;
    });
  };

  return {
    addTable,
    updateGraph,
    updateTable,
    removeTable,
    calcXY,
  };
};

export default tableModel;
