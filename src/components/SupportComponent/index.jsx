import React, { useContext, Suspense } from 'react';
import { globalContext } from '../../store';

import './index.css';

const componentMap = {
  grayscale: React.lazy(() => import('../../canvas/grayscale/Support')),
  thresholding: React.lazy(() => import('../../canvas/thresholding/Support')),
  blur: React.lazy(() => import('../../canvas/blur/Support')),
  sharpen: React.lazy(() => import('../../canvas/sharpen/Support')),
};

function SupportComponentContainer() {
  const { state, dispatch } = useContext(globalContext);

  function handleProcessComplete() {
    state.ctx.canvas.toBlob(blob => {
      dispatch({
        type: 'canvas/updateCurrentImage',
        payload: URL.createObjectURL(blob),
      });
    });
  }

  if (!componentMap[state.processModule.name] || state.mode !== 'webgl') {
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
}

export default SupportComponentContainer;
