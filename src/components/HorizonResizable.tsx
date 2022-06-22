import React, { Children, ReactElement, useEffect, useRef } from 'react';

export interface HorizonResizableProps {
  defaultWidthList?: string;
  children: React.ReactNode;
}

export default function HorizonResizable(props: HorizonResizableProps) {
  const { defaultWidthList, children: reactChildren } = props;
  const children = Children.toArray(reactChildren);

  const elementRefList = Array.from({ length: children.length }, () =>
    useRef<HTMLDivElement>(null)
  );

  const widthInfo = useRef({
    containerWidth: -1,
    dividerWidth: -1,
  });

  const movingInfo = useRef({
    isMoving: false,
    leftIndex: -1,
    rightIndex: -1,
    farLeft: -1,
    farRight: -1,
  });

  const resizeItem = (e: MouseEvent) => {
    if (
      !movingInfo.current.isMoving ||
      e.clientX <= movingInfo.current.farLeft ||
      e.clientX >= movingInfo.current.farRight
    ) {
      return;
    }
    const newLeftWidth = e.clientX - movingInfo.current.farLeft;
    const newRightWidth = movingInfo.current.farRight - e.clientX;
    elementRefList[movingInfo.current.leftIndex].current!.style.width =
      (newLeftWidth / widthInfo.current.containerWidth) * 100 + '%';
    elementRefList[movingInfo.current.rightIndex].current!.style.width =
      (newRightWidth / widthInfo.current.containerWidth) * 100 + '%';
  };

  const resizeFinish = () => {
    movingInfo.current.isMoving = false;
    window.removeEventListener('mousemove', resizeItem);
  };

  const handleDividerMouseDown = (index: number) => {
    const leftIndex = index,
      rightIndex = index + 1;
    movingInfo.current.leftIndex = leftIndex;
    movingInfo.current.rightIndex = rightIndex;
    movingInfo.current.farLeft =
      elementRefList[leftIndex].current!.getBoundingClientRect().left;
    movingInfo.current.farRight =
      elementRefList[rightIndex].current!.getBoundingClientRect().right;
    movingInfo.current.isMoving = true;
    window.addEventListener('mousemove', resizeItem);
    window.addEventListener('mouseup', resizeFinish, { once: true });
  };

  useEffect(() => {
    const containerWidth = document
      .querySelector('.horizon-resizable')!
      .getBoundingClientRect().width;
    const dividerWidth = document
      .querySelector('.horizon-divider')!
      .getBoundingClientRect().width;
    widthInfo.current.containerWidth = containerWidth;
    widthInfo.current.dividerWidth = dividerWidth;

    const itemAverageWidth =
      (containerWidth - (children.length - 1) * dividerWidth) / children.length;
    elementRefList.forEach((elementRef, index) => {
      if (defaultWidthList) {
        elementRef.current!.style.width = defaultWidthList[index];
        return;
      }
      elementRef.current!.style.width =
        ((index < children.length - 1
          ? itemAverageWidth + dividerWidth
          : itemAverageWidth) /
          containerWidth) *
          100 +
        '%';
    });
  }, []);

  const toRender: ReactElement[] = [];

  children.forEach((element, index) => {
    toRender.push(
      <div
        className="horizon-item flex overflow-auto children:flex-1"
        key={index * 2}
        ref={elementRefList[index]}
      >
        {element}
      </div>
    );
    if (index < children.length - 1) {
      toRender.push(
        <div
          className="horizon-divider w-2 flex-shrink-0 cursor-col-resize bg-[var(--divider-bg)]"
          key={index * 2 + 1}
          onMouseDown={() => handleDividerMouseDown(index)}
        />
      );
    }
  });

  return <div className="horizon-resizable w-full h-full flex">{toRender}</div>;
}
