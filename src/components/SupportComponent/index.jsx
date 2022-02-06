import React, { useContext, Suspense } from 'react';
import { globalContext } from '../../store';

import './index.css';

const componentMap = {
  'grayscale': React.lazy(() => import('../../canvas/grayscale/Support')),
  'thresholding': React.lazy(() => import('../../canvas/thresholding/Support')),
};

function SupportComponentContainer() {
  const { state, dispatch } = useContext(globalContext);

  function handleProcessComplete() {
    dispatch({
      type: 'canvas/updateCurrentImage',
      payload: state.ctx.canvas.toDataURL(),
    })
  }

  if (!componentMap[state.processModule.name]) {
    return false;
  }
  const SupportComponent = componentMap[state.processModule.name];
  return (
    <div className="support-component-container">
      <Suspense fallback={<div />}>
        <SupportComponent
          ctx={state.ctx}
          image={state.processModule.originImage}
          processFn={state.processModule.processFn}
          handleProcessComplete={handleProcessComplete}
        />
      </Suspense>
    </div>
  );
  return <div></div>
}

export default SupportComponentContainer;
