import React, { Children, ReactElement, useEffect, useRef } from 'react';

export interface VerticalResizableProps {
  defaultHeightList?: string;
  children: React.ReactNode;
  dividerText?: string[];
}

function VerticalResizable(props: VerticalResizableProps) {
  const { children: reactChildren, defaultHeightList, dividerText } = props;

  const children = Children.toArray(reactChildren);

  const elementRefList = Array.from({ length: children.length }, () =>
    useRef<HTMLDivElement>(null)
  );

  const heightInfo = useRef({
    containerHeight: -1,
    dividerHeight: -1,
  });

  const movingInfo = useRef({
    isMoving: false,
    topIndex: -1,
    bottomIndex: -1,
    farTop: -1,
    farBottom: -1,
  });

  const resizeItem = (e: MouseEvent) => {
    if (
      !movingInfo.current.isMoving ||
      e.clientY <= movingInfo.current.farTop ||
      e.clientY >= movingInfo.current.farBottom
    ) {
      return;
    }
    const newLeftHeight = e.clientY - movingInfo.current.farTop;
    const newRightHeight = movingInfo.current.farBottom - e.clientY;
    elementRefList[movingInfo.current.topIndex].current!.style.height =
      (newLeftHeight / heightInfo.current.containerHeight) * 100 + '%';
    elementRefList[movingInfo.current.bottomIndex].current!.style.height =
      (newRightHeight / heightInfo.current.containerHeight) * 100 + '%';
  };

  const resizeFinish = () => {
    movingInfo.current.isMoving = false;
    window.removeEventListener('mousemove', resizeItem);
  };

  const handleDividerMouseDown = (index: number) => {
    const topIndex = index,
      bottomIndex = index + 1;
    movingInfo.current.topIndex = topIndex;
    movingInfo.current.bottomIndex = bottomIndex;
    movingInfo.current.farTop =
      elementRefList[topIndex].current!.getBoundingClientRect().top;
    movingInfo.current.farBottom =
      elementRefList[bottomIndex].current!.getBoundingClientRect().bottom;
    movingInfo.current.isMoving = true;
    window.addEventListener('mousemove', resizeItem);
    window.addEventListener('mouseup', resizeFinish, { once: true });
  };

  useEffect(() => {
    const containerHeight = document
      .querySelector('.vertical-resizable')!
      .getBoundingClientRect().height;
    const dividerHeight = document
      .querySelector('.vertical-divider')!
      .getBoundingClientRect().height;
    heightInfo.current.containerHeight = containerHeight;
    heightInfo.current.dividerHeight = dividerHeight;

    const itemAverageHeight =
      (containerHeight - (children.length - 1) * dividerHeight) /
      children.length;
    elementRefList.forEach((elementRef, index) => {
      if (defaultHeightList) {
        elementRef.current!.style.height = defaultHeightList[index];
        return;
      }
      elementRef.current!.style.height =
        ((index < children.length - 1
          ? itemAverageHeight + dividerHeight
          : itemAverageHeight) /
          containerHeight) *
          100 +
        '%';
    });
  }, []);

  const toRender: ReactElement[] = [];

  children.forEach((element, index) => {
    toRender.push(
      <div
        className="vertical-item flex flex-col overflow-auto children:flex-1"
        key={index * 2}
        ref={elementRefList[index]}
      >
        {element}
      </div>
    );
    if (index < children.length - 1) {
      toRender.push(
        <div
          className="vertical-divider py-0.5 px-2 flex-shrink-0 cursor-row-resize bg-[var(--divider-bg)] text-[var(--divider-text)] text-xs font-bold"
          key={index * 2 + 1}
          onMouseDown={() => handleDividerMouseDown(index)}
        >
          {dividerText && dividerText[index]}
        </div>
      );
    }
  });

  return (
    <div className="vertical-resizable w-full h-full flex flex-col bg-[var(--bg-color)]">
      {toRender}
    </div>
  );
}

export default VerticalResizable;
