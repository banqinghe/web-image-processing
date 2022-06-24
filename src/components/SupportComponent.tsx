import React, { useContext, Suspense } from 'react';
import { globalContext } from '@/store';
import { SupportComponentKey, SupportComponentMap } from '@/canvas/types';

const supportComponentKey: SupportComponentKey[] = [
  'Grayscale',
  'Thresholding',
  'Blur',
  'Sharpen',
];

const componentMap: SupportComponentMap = {
  Grayscale: React.lazy(() => import('../canvas/grayscale/Support')),
  Thresholding: React.lazy(() => import('../canvas/thresholding/Support')),
  Blur: React.lazy(() => import('../canvas/blur/Support')),
  Sharpen: React.lazy(() => import('../canvas/sharpen/Support')),
};

export default function SupportComponentContainer() {
  const { state, dispatch } = useContext(globalContext);

  const handleProcessComplete = () => {
    state.ctx.canvas.toBlob(blob => {
      dispatch({
        type: 'canvas/updateCurrentImage',
        payload: URL.createObjectURL(blob),
      });
    });
  };

  if (
    supportComponentKey.indexOf(state.processModule.name) === -1 ||
    state.mode !== 'webgl'
  ) {
    return false;
  }

  // TODO: need store type
  const SupportComponent = componentMap[state.processModule.name];

  return (
    <div className="support-component-container flex justify-center items-center">
      <Suspense fallback={<div />}>
        <SupportComponent
          ctx={state.ctx}
          image={state.processModule.originImage}
          processFn={state.processModule.processFn}
          onProcessComplete={handleProcessComplete}
        />
      </Suspense>
    </div>
  );
}
