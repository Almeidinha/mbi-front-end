import { memo, useCallback } from 'react';
import {
  tableWidth,
  titleHeight,
  commentHeight,
  fieldHeight,
} from '../config/settings';

import Image from 'next/image';
import { Field, TableDict } from '../types';
import { KeyOutlined } from '@ant-design/icons';
import { KeyFillIcon, KeyIcon } from '@/lib/icons/customIcons';

interface TableProps {
  table: TableDict;
  onTableMouseDown: (e: React.MouseEvent, table: TableDict) => void;
  onGripMouseDown: (e: React.MouseEvent) => void;
  tableSelectedId: string | null;
  setTableSelectId: React.Dispatch<React.SetStateAction<string | null>>;
}

const Table: React.FC<TableProps> = memo((props: TableProps) => {

  const {
    table,
    onTableMouseDown,
    onGripMouseDown,
    tableSelectedId,
    setTableSelectId,
  } = props

  const handlerContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const height = table.fields.length * fieldHeight + titleHeight + commentHeight + 12;
    
  return (
    <foreignObject
      x={table.x}
      y={table.y}
      width={tableWidth}
      height={height}
      key={`${table.name}-${table.id}`}
      onMouseDown={(e) => onTableMouseDown(e, table)}
      onContextMenu={handlerContextMenu}
    >
      <div
        className={`table editable ${
            tableSelectedId === table.id ? 'table-selected' : ''
        }`}
        style={{ borderColor: table.theme, width: tableWidth -12}}
        onMouseOver={() => setTableSelectId(table.id)}
        onMouseOut={() => setTableSelectId(null)}
      >
        <div
          className="table-title"
          style={{
            background: table.theme,
            height: titleHeight,
            lineHeight: `${titleHeight}px`,
          }}
        >
          <span className="table-name">{table.name}</span>
        </div>
        <div
          className={`table-comment no-comment`}
          style={{ height: commentHeight, lineHeight: `${commentHeight}px` }}
          >
            {table.note}
        </div> 
        {table.fields &&
          table.fields.map((field: Field) => (
            <div
              className={'row editable'}
              key={field.id}
              data-tableid={table.id}
              data-fieldid={field.id}
              style={{ height: fieldHeight, lineHeight: `${fieldHeight}px` }}
            >
              <div
                key={`${field.id}-grip`}
                className="start-grip grip"
                onMouseDown={onGripMouseDown}
              ></div>
              <div className="field-content" key={`${field.id}-content`}>
                <div>
                  {field.name}
                  {field.pk && (
                    <KeyFillIcon style={{
                      marginLeft: "4px",
                      color: 'rgb(148,191,255)'
                    }}/>
                  )}
                  {(field.unique || field.index) && (
                    <Image
                      alt="index"
                      width={10}
                      height={10}
                      style={{
                        marginLeft: "4px",
                        display: "inline"
                      }}
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAA7UlEQVR4AW2Qg26GURQEb/rWtW3bts2otm27jdpouv39YTeeuTjH2FNdUo1a4gBB/KVaFQt+Zp9bkFJe5Yo3OKBahUJSZ60CX8KLbHMhoZIfsq1Kta5eVJel3LDIEA+kYxHeWBPwSn20ckkMQRxWXTLEEh1MMMsgzWwSS9Rh4Hs1jHJKJ0PM0U6jcDzRu4HLf7lmgUYJi5RzzLlw3EbI5o51aT3drJDwHnEaSyIJKyGnz+ijll7hxLfIRvt6vq9op4ZhlnU6ptK5Xh7oYZBF4j5jy4wzFWv6HrskfMTnG7dkRWbcJb8kvqWkGtf8ARG87I1KSSe4AAAAAElFTkSuQmCC"
                    />
                  )}
                </div>
                <div className="field-type">{field.type}</div>
              </div>
            </div>
          ))}
      </div>
    </foreignObject>
  );
});

Table.displayName = 'Table';
export default Table;