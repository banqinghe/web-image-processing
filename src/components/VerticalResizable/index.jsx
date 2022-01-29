import { useEffect, useRef } from 'react';

import './index.css';

function VerticalResizable(props) {
  const { elements, defaultHeightList } = props;
  const elementRefList = Array.from({ length: elements.length }, () => useRef());

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

  useEffect(() => {
    const containerHeight = document.querySelector('.vertical-resizable').getBoundingClientRect().height;
    const dividerHeight = document.querySelector('.vertical-divider').getBoundingClientRect().height;
    heightInfo.current.containerHeight = containerHeight;
    heightInfo.current.dividerHeight = dividerHeight;

    const itemAverageHeight = (containerHeight - (elements.length - 1) * dividerHeight) / elements.length;
    elementRefList.forEach((elementRef, index) => {
      if (defaultHeightList) {
        elementRef.current.style.height = defaultHeightList[index];
        return;
      }
      elementRef.current.style.height = (
        index < elements.length - 1 ? itemAverageHeight + dividerHeight : itemAverageHeight
      ) / containerHeight * 100 + '%';
    });
  }, [elements]);

  function resizeItem(e) {
    if (!movingInfo.current.isMoving ||
      e.clientY <= movingInfo.current.farTop ||
      e.clientY >= movingInfo.current.farBottom
    ) {
      return;
    }
    const newLeftHeight = e.clientY - movingInfo.current.farTop;
    const newRightHeight = movingInfo.current.farBottom - e.clientY;
    elementRefList[movingInfo.current.topIndex].current.style.height = 
      newLeftHeight / heightInfo.current.containerHeight * 100 + '%';
    elementRefList[movingInfo.current.bottomIndex].current.style.height =
      newRightHeight / heightInfo.current.containerHeight * 100 + '%';
  }

  function resizeFinish() {
    movingInfo.current.isMoving = false;
    window.removeEventListener('mousemove', resizeItem);
  }

  const toRender = [];
  elements.forEach((element, index) => {
    toRender.push(
      <div className="vertical-item" key={index * 2} ref={elementRefList[index]}>
        {element}
      </div>
    );
    if (index < elements.length - 1) {
      toRender.push(
        <div
          className="vertical-divider"
          key={index * 2 + 1}
          onMouseDown={() => {
            const topIndex = index, bottomIndex = index + 1;
            movingInfo.current.topIndex = topIndex;
            movingInfo.current.bottomIndex = bottomIndex;
            movingInfo.current.farTop = elementRefList[topIndex].current.getBoundingClientRect().top;
            movingInfo.current.farBottom = elementRefList[bottomIndex].current.getBoundingClientRect().bottom;
            movingInfo.current.isMoving = true;
            window.addEventListener('mousemove', resizeItem);
            window.addEventListener('mouseup', resizeFinish, { once: true });
          }}
        />
      );
    }
  });

  return (
    <div className="vertical-resizable">
      {toRender}
    </div>
  );
}

export default VerticalResizable;
