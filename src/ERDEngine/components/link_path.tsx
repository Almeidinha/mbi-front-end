import useWizardState from "@/wizard/hooks/use-wizard-state";
import {
  commentHeight,
  fieldHeight,
  tableWidth,
  titleHeight,
} from "../config/settings";
import { memo, useCallback } from "react";
import { Endpoint, Field, LinkDict } from "../types";

const control = 20;
const padding = 5;
const gripWidth = 10;
const gripRadius = gripWidth / 2;
const margin = 0.5;

interface IProps {
  link: LinkDict;
  setEditingLink: React.Dispatch<React.SetStateAction<Endpoint | null>>;
}

const LinkPath: React.FC<IProps> = memo((props) => {

  const { link, setEditingLink } = props;
  const { tableDict } = useWizardState.useContainer();

  const handlerContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  if (!tableDict) return null;

  const { endpoints } = link;
  const [sourceTable, targetTable] = [
    tableDict[endpoints[0].id],
    tableDict[endpoints[1].id],
  ];

  const [sourceFieldIndex, targetFieldIndex] = [
    sourceTable.fields.findIndex(
      (field: Field) => field.id === endpoints[0].fieldId
    ),
    targetTable.fields.findIndex(
      (field: Field) => field.id === endpoints[1].fieldId
    ),
  ];

  const calcHeight = titleHeight + commentHeight + fieldHeight / 2;

  const sourceFieldPosition = {
    x: sourceTable.x,
    y: sourceTable.y + sourceFieldIndex * fieldHeight + calcHeight,
    ...endpoints[0],
  };

  const targetFieldPosition = {
    x: targetTable.x,
    y: targetTable.y + targetFieldIndex * fieldHeight + calcHeight,
    ...endpoints[1],
  };

  const [source, target] = [sourceFieldPosition, targetFieldPosition].sort(
    (a, b) => {
      return a.x - b.x || a.y - b.y;
    }
  );

  const sourceLeft = source.x + padding + gripRadius + margin;
  const sourceRight = source.x + tableWidth - padding - gripRadius - margin;
  let x = sourceLeft;
  const y = source.y + gripRadius + margin;
  const targetLeft = target.x + padding + gripRadius + margin;
  const targetRight = target.x + tableWidth - padding - gripRadius - margin;
  let minDistance = Math.abs(sourceLeft - targetLeft);
  let x1 = targetLeft;

  [
    [sourceLeft, targetRight],
    [sourceRight, targetLeft],
    [sourceRight, targetRight],
  ].forEach((items) => {
    if (Math.abs(items[0] - items[1]) < minDistance) {
      minDistance = Math.min(items[0] - items[1]);
      x = items[0];
      x1 = items[1];
    }
  });

  const y1 = target.y + gripRadius + margin;
  const midX = x1 - (x1 - x) / 2;
  const midY = y1 - (y1 - y) / 2;

  let d = `M ${x} ${y}
  C ${x + control} ${y} ${midX} ${midY} ${midX} ${midY}
  C ${midX} ${midY} ${x1 - control} ${y1} ${x1} ${y1}`;
  
  let foreignObjectPositions = [
    {
      x: (x + control + midX) / 2 - 10,
      y: (y + midY) / 2 - 10,
    },
    { x: (x1 - control + midX) / 2 - 10, y: (y1 + midY) / 2 - 10 },
  ];

  if (endpoints[0].id === endpoints[1].id) {
    const factor = (y1 - y) / 50 < 2 ? 2 : (y1 - y) / 50;

    d = `M ${sourceRight} ${y}
      L ${sourceRight + control} ${y}
      C ${sourceRight + control * factor} ${y} ${
      sourceRight + control * factor
    } ${y1} ${sourceRight + control} ${y1}
      L ${sourceRight} ${y1}`;

    foreignObjectPositions = [
      {
        x: sourceRight + control - 10,
        y: y - 10,
      },
      { x: targetRight + control - 10, y: y1 - 10 },
    ];
  }

  return (
    <>
      <path
        d={d}
        stroke="black"
        strokeWidth="2"
        fill="none"
        className="path-line"
      />
      <foreignObject
        x={foreignObjectPositions[0].x}
        y={foreignObjectPositions[0].y}
        width={20}
        height={20}
        onMouseDown={() => setEditingLink({
            id: link.id,
            fieldId: source.fieldId,
          })
        }
        onContextMenu={handlerContextMenu}
      >
        <div
          style={{
            cursor: "pointer",
            userSelect: "none",
          }}
          className="path-label"
        >
          {source.relation}
        </div>
      </foreignObject>
      <foreignObject
        x={foreignObjectPositions[1].x}
        y={foreignObjectPositions[1].y}
        width={20}
        height={20}
        onMouseDown={() => setEditingLink({
            id: link.id,
            fieldId: target.fieldId,
          })
        }
        onContextMenu={handlerContextMenu}
      >
        <div
          style={{
            cursor: "pointer",
            userSelect: "none",
          }}
          className="path-label"
        >
          {target.relation}
        </div>
      </foreignObject>
    </>
  );
});

LinkPath.displayName = "LinkPath";
export default LinkPath;
