import { useEffect, useRef } from 'react';

import './index.css';

function HorizonResizable(props) {
  const { elements, defaultWidthList } = props;
  const elementRefList = Array.from({ length: elements.length }, () => useRef());

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

  useEffect(() => {
    const containerWidth = document.querySelector('.horizon-resizable').getBoundingClientRect().width;
    const dividerWidth = document.querySelector('.horizon-divider').getBoundingClientRect().width;
    widthInfo.current.containerWidth = containerWidth;
    widthInfo.current.dividerWidth = dividerWidth;

    const itemAverageWidth = (containerWidth - (elements.length - 1) * dividerWidth) / elements.length;
    elementRefList.forEach((elementRef, index) => {
      if (defaultWidthList) {
        elementRef.current.style.width = defaultWidthList[index];
        return;
      }
      elementRef.current.style.width = (
        index < elements.length - 1 ? itemAverageWidth + dividerWidth : itemAverageWidth
      ) / containerWidth * 100 + '%';
    });
  }, [elements]);

  function resizeItem(e) {
    if (!movingInfo.current.isMoving ||
      e.clientX <= movingInfo.current.farLeft ||
      e.clientX >= movingInfo.current.farRight
    ) {
      return;
    }
    const newLeftWidth = e.clientX - movingInfo.current.farLeft;
    const newRightWidth = movingInfo.current.farRight - e.clientX;
    elementRefList[movingInfo.current.leftIndex].current.style.width = 
      newLeftWidth / widthInfo.current.containerWidth * 100 + '%';
    elementRefList[movingInfo.current.rightIndex].current.style.width =
      newRightWidth / widthInfo.current.containerWidth * 100 + '%';
  }

  function resizeFinish() {
    movingInfo.current.isMoving = false;
    window.removeEventListener('mousemove', resizeItem);
  }

  const toRender = [];
  elements.forEach((element, index) => {
    toRender.push(
      <div className="horizon-item" key={index * 2} ref={elementRefList[index]}>
        {element}
      </div>
    );
    if (index < elements.length - 1) {
      toRender.push(
        <div
          className="horizon-divider"
          key={index * 2 + 1}
          onMouseDown={() => {
            const leftIndex = index, rightIndex = index + 1;
            movingInfo.current.leftIndex = leftIndex;
            movingInfo.current.rightIndex = rightIndex;
            movingInfo.current.farLeft = elementRefList[leftIndex].current.getBoundingClientRect().left;
            movingInfo.current.farRight = elementRefList[rightIndex].current.getBoundingClientRect().right;
            movingInfo.current.isMoving = true;
            window.addEventListener('mousemove', resizeItem);
            window.addEventListener('mouseup', resizeFinish, { once: true });
          }}
        />
      );
    }
  });

  return (
    <div className="horizon-resizable">
      {toRender}
    </div>
  );
}

export default HorizonResizable;
