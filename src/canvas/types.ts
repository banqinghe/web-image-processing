import React from 'react';

export interface SupportComponentProps {
  ctx: WebGL2RenderingContext;
  image: HTMLImageElement;
  processFn: (
    ctx: WebGL2RenderingContext,
    image: HTMLImageElement,
    customValue?: any
  ) => void;
  onProcessComplete: () => void;
}

export type SupportComponentKey =
  | 'Grayscale'
  | 'Thresholding'
  | 'Blur'
  | 'Sharpen';

export type SupportComponentMap = {
  [K in SupportComponentKey]: React.LazyExoticComponent<
    React.FC<SupportComponentProps>
  >;
};
