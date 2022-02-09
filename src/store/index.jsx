import React, { useReducer } from 'react';
import defaultImageUrl from '../assets/Lenna.png';

const initialState = {
  /** 图片原图 url */
  imageUrl: defaultImageUrl,
  /** 处理后的图片 url */
  currentImageUrl: defaultImageUrl,
  /** 当前 canvas context */
  ctx: null,
  /** 当前使用的模块信息 */
  processModule: {
    name: '',
    originImage: null,
    processFn: () => {},
  },
};

export const globalContext = React.createContext();

/**
 * 
 * @param {object} state 
 * @param {{ type: string; payload: string }} action payload 为新导入图片的 url
 * @returns state
 */
function selectNewImageReducer(state, action) {
  return {
    ...state,
    imageUrl: action.payload,
    currentImageUrl: action.payload,
  };
}

/**
 * 
 * @param {object} state 
 * @param {{ type: string; payload: WebGL2RenderingContext }} action
 * @returns state
 */
 function updateCtxReducer(state, action) {
  return {
    ...state,
    ctx: action.payload,
  };
}

/**
 * 
 * @param {object} state 
 * @param {{ type: string; payload: { currentImageUrl: string; processModule: string } }} action
 * @returns state
 */
function updateProcessModuleReducer(state, action) {
  return {
    ...state,
    currentImageUrl: action.payload.currentImageUrl,
    processModule: action.payload.processModule,
  };
}

/**
 * 
 * @param {object} state 
 * @param {{ type: string; payload: string }} action
 * @returns state
 */
 function updateCurrentImageReducer(state, action) {
  return {
    ...state,
    currentImageUrl: action.payload,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'image/new':
      return selectNewImageReducer(state, action);
    case 'canvas/updateProcessModule':
      return updateProcessModuleReducer(state, action);
    case 'canvas/updateCtx':
      return updateCtxReducer(state, action);
    case 'canvas/updateCurrentImage':
      return updateCurrentImageReducer(state, action);
  }
  return state;
}

export function GlobalProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <globalContext.Provider value={{ state, dispatch }}>
      {props.children}
    </globalContext.Provider>
  );
}
