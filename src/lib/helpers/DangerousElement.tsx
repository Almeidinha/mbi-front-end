import React, { ReactElement } from 'react';
import { useLayoutEffect, useRef } from "react";


interface DangerousElementProps {
  markup: string;
}

const DangerousElement: React.FC<DangerousElementProps> = ({ markup }): ReactElement => {
  const elRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (elRef.current) {
      const range = document.createRange();
      range.selectNode(elRef.current);
      const documentFragment = range.createContextualFragment(markup);
      
      // Inject the markup, triggering a re-run! 
      elRef.current.innerHTML = '';
      elRef.current.append(documentFragment);
    }
  }, [markup]);

  return <div 
    ref={elRef} 
    dangerouslySetInnerHTML={{ __html: markup }}
  />;
}

export default DangerousElement;