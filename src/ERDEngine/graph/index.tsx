import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import LinkPath from "../components/link_path";
import LinkModal from "../components/link_modal";
import Table from "../components/table";
import tableModel from "../hooks/table-model";
import { defaultTo, isEmpty } from "lodash";
import { Endpoint, Fk, GraphDict, Field, TableDict, LinkDictState } from "../types";
import { isNil } from "@/lib/helpers/safe-navigation";
import useWizardState from "@/wizard/hooks/use-wizard-state";
import { DatabaseTable } from "@/wizard/types";
import '../erdeengine.css'
import { nanoid } from "@reduxjs/toolkit";

export type ERDGraphProps = {
  graph: GraphDict
}

type StrNotNull = string | undefined

type NumbNotNull = number | undefined

type LinkStatType = {
  startX: number | undefined,
  startY: number | undefined,
  startTableId: StrNotNull,
  startField: StrNotNull,
  endX: NumbNotNull,
  endY: NumbNotNull,
}



export const ERDGraph: React.FC = () => {

  const {
    tableList,
    setTableDict,
    linkDict,
    setLinkDict,
    box,
    setBox,
    theme,
    databaseTableList
  } = useWizardState.useContainer();

  const { calcXY } = tableModel();

  const links = useMemo(() => Object.values(linkDict), [linkDict]);
  const svg = useRef<SVGSVGElement | null>(null);

  const [mode, setMode] = useState<"dragging" | "moving" | "linking" | "">("");
  const [offset, setOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const [movingTable, setMovingTable] = useState<{
    id: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const [editingLink, setEditingLink] = useState<Endpoint | null>(null);
  const [tableSelectedId, setTableSelectId] = useState<string | null>(null);

  const [linkStat, setLinkStat] = useState<LinkStatType>({
    startX: undefined,
    startY: undefined,
    startTableId: undefined,
    startField: undefined,
    endX: undefined,
    endY: undefined,
  });

  const getSVGCursor = (e: React.MouseEvent<Element, MouseEvent>) => {
    let point = svg.current!.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;

    return point.matrixTransform(svg.current!.getScreenCTM()!.inverse());
  };

  const linkExist = useCallback((pkTableId: StrNotNull, pkFieldId: StrNotNull, fkTableId: StrNotNull, fkFieldId: StrNotNull) => {
    const endpointsExist = (endpoints1: Set<string>, endpoints2: Set<string>) => {
      return (
        endpoints1.has(`${pkTableId} ${pkFieldId}`) && endpoints1.has(`${fkTableId} ${fkFieldId}`) ||
        endpoints2.has(`${pkTableId} ${pkFieldId}`) && endpoints2.has(`${fkTableId} ${fkFieldId}`)
      );
    };

    const existingEndpoints = new Set(links.flatMap(link => link.endpoints.map((endpoint: Endpoint) => `${endpoint.id} ${endpoint.fieldId}`)));

    return links.some(link => {
      const linkEndpoints = new Set(link.endpoints.map((endpoint: Endpoint) => `${endpoint.id} ${endpoint.fieldId}`));
      return endpointsExist(existingEndpoints as Set<string>, linkEndpoints as Set<string>);
    });
  }, [links]);

  const mouseDownHandler = useCallback((e: React.MouseEvent<Element, MouseEvent>) => {
    if ((e.target as SVGAElement).tagName === "svg" && e.button !== 2) {
      setOffset({
        x: box.x + (e.clientX * box.w) / window.innerWidth,
        y: box.y + (e.clientY * box.h) / window.innerHeight,
      });
      setMode("dragging");
    }
  },[box]);

  const tableMouseDownHandler = useCallback((
    e: React.MouseEvent<Element, MouseEvent>,
    table: TableDict
  ) => {

    if (e.button === 2) return;
    const { x: cursorX, y: cursorY } = getSVGCursor(e);

    setMovingTable({
      id: table.id,
      offsetX: cursorX - table.x,
      offsetY: cursorY - table.y,
    });

    setMode("moving");
    e.preventDefault();
  },[]);

  const mouseUpHandler = useCallback((e: React.MouseEvent<Element, MouseEvent>) => {
    if (mode === "linking") {
        const row = (e.target as SVGSVGElement).closest(".row");
        if (row) {
            const endTableId = row.getAttribute("data-tableid") || undefined;
            const endField = row.getAttribute("data-fieldid") || undefined;

            if (linkStat.startField !== endField && !linkExist(linkStat.startTableId, linkStat.startField, endTableId, endField)) {
                setLinkDict((state) => {
                    const id = nanoid();
                    return {
                        ...state,
                        [id]: {
                            id,
                            name: undefined,
                            endpoints: [
                                { id: linkStat.startTableId, fieldId: linkStat.startField, relation: "1" },
                                { id: endTableId, fieldId: endField, relation: "*" },
                            ],
                        },
                    };
                });
            }
        }
    }

    setMode("");
    setLinkStat({
        startX: undefined,
        startY: undefined,
        startTableId: undefined,
        startField: undefined,
        endX: undefined,
        endY: undefined,
    });
    setMovingTable(null);
  }, [linkExist, linkStat.startField, linkStat.startTableId, mode, setLinkDict]);


  const mouseMoveHandler = useCallback((e: React.MouseEvent<Element, MouseEvent>) => {
    if (!mode) return;
    if (mode === "dragging") {
      setBox((state) => ({
        ...state,
        x: offset.x - (e.clientX * state.w) / window.innerWidth,
        y: offset.y - (e.clientY * state.h) / window.innerHeight,
      }));
    }

    if (mode === "moving") {
      const { x: cursorX, y: cursorY } = getSVGCursor(e);

      setTableDict((state) => ({
        ...state,
        [movingTable!.id]: {
          ...state[movingTable!.id],
          x: cursorX - movingTable!.offsetX,
          y: cursorY - movingTable!.offsetY,
        },
      }));
    }

    if (mode === "linking") {
      const { x, y } = getSVGCursor(e);
      setLinkStat({
        ...linkStat,
        endX: x,
        endY: y + 3,
      });
    }
  },[linkStat, mode, movingTable, offset, setBox, setTableDict]);

  const gripMouseDownHandler = useCallback((e: React.MouseEvent<Element, MouseEvent>) => {
    const { x, y } = getSVGCursor(e);
    const row = (e.currentTarget as HTMLElement)?.closest(".row");

    setLinkStat({
      ...linkStat,
      startX: x,
      startY: y,
      startTableId: defaultTo(row?.getAttribute("data-tableid"), undefined),
      startField: defaultTo(row?.getAttribute("data-fieldid"), undefined),
    });
    setMode("linking");
    e.preventDefault();
    e.stopPropagation();
  },[linkStat]);
  
  useEffect(() => {
    
    if (isNil(databaseTableList) || isEmpty(databaseTableList)) return;    
    
    const tableDictTemp: any = {};

    const tables = [...tableList];

    const checkForRelations = () => {
      
      // setLinkDict({} as LinkDictState)

      tables.forEach((table: TableDict) => {
          const { fks, id: tableId, fields } = table;
          defaultTo(fks, []).forEach((fk: Fk) => {
              const pkTable = tables.find((t) => t.name === fk.pkTableName);
              if (!pkTable) return;
              
              const pkField = pkTable.fields.find((f: Field) => f.name === fk.pkColumnName);
              if (!pkField) return;
              
              const fkField = defaultTo(fields, []).find((f: Field) => f.name === fk.fkColumnName);
              if (!fkField) return;
              
              if (!linkExist(pkTable.id, pkField.id, tableId, fkField.id)) {
                  setLinkDict((state) => {
                      const id = nanoid();
                      return {
                          ...state,
                          [id]: {
                              id,
                              name: undefined,
                              endpoints: [
                                  { id: pkTable.id, fieldId: pkField.id, relation: "1" },
                                  { id: tableId, fieldId: fkField.id, relation: "*" }
                              ],
                          },
                      };
                  });
              }
          });
      });
    };

    const buildNewTable = (table: DatabaseTable): TableDict => {
      const [x, y] = calcXY(0, tables);
  
      const fields = defaultTo(table.columns, []).map(field => ({
          id: field.uid,
          name: field.columnName,
          pk: !!table.primaryKeys?.find(key => key.columnName === field.columnName),
          fk: !!table.foreignKeys?.find(key => key.fkColumnName === field.columnName),
          type: field.originalDataType,
      }));
  
      return {
          id: table.uid,
          x,
          y,
          theme: theme,
          name: table.tableName,
          fks: table.foreignKeys,
          fields,
      };
    };
    
    databaseTableList.forEach((table: DatabaseTable) => {      
      
      const oldTable = tables.find((t) => t.id === table.uid)
      const newTable = defaultTo(oldTable, buildNewTable(table)) 
      
      tableDictTemp[newTable.id] = newTable;
      if (isNil(oldTable)) {
        tables.push(newTable);  
      }      
    })
  
  
    setTableDict(state => ({ ...state, ...tableDictTemp }));    
    checkForRelations()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="graph">
      <svg
        className="main"
        viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
        onMouseDown={mouseDownHandler}
        onMouseUp={mouseUpHandler}
        onMouseMove={mouseMoveHandler}
        ref={svg}
      >
        {tableList.map((table) => <Table
            key={table.id}
            table={table}
            onTableMouseDown={tableMouseDownHandler}
            onGripMouseDown={gripMouseDownHandler}
            tableSelectedId={tableSelectedId}
            setTableSelectId={setTableSelectId}
          />
        )}
        {links.map((link) => <LinkPath
            link={link}
            key={`${link.id}`}
            setEditingLink={setEditingLink}
          />
        )}
        <rect x="0" y="0" width="2" height="2"></rect>
        {mode === "linking" &&
          linkStat.startX != null &&
          linkStat.endX != null && (
            <line
              x1={linkStat.startX}
              y1={linkStat.startY}
              x2={linkStat.endX}
              y2={linkStat.endY}
              stroke="red"
              strokeDasharray="5,5"
            />
          )}
      </svg>

      {<LinkModal editingLink={editingLink} setEditingLink={setEditingLink} />}
    </div>
  );
}
