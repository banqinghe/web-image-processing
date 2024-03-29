import React, { useReducer } from 'react';
import defaultImageUrl from '../assets/demo.jpg';
import localLanguageResource from '../i18n/resource.json';

const initialState = {
  /** 图片原图 url */
  imageUrl: defaultImageUrl,

  /** 图片信息 */
  imageInfo: {
    url: defaultImageUrl,
    name: 'DEFAULT',
    fileSize: 45265,
    imageSize: '800×1050',
  },

  /** 处理后的图片 url */
  currentImageUrl: defaultImageUrl,

  /** 使用 canvas 2d 或 webgl 上下文, 'canvas' | 'webgl' */
  mode: 'webgl',

  /** 当前 canvas context */
  ctx: null,

  /** 当前使用的模块信息 */
  processModule: {
    name: '',
    originImage: null,
    processFn: () => {},
  },

  /** 当前叠加的处理模块, { name: string; repeat: number } */
  moduleList: [],

  /** 当前存储的用户自定义模块 */
  savedModuleList: window.localStorage.getItem('custom-modules')
    ? JSON.parse(window.localStorage.getItem('custom-modules'))
    : [],

  /** 当前语言信息，默认使用本地 resource */
  i18n: {
    languageResourceUrl: 'http://101.43.247.72:7777/resource.json',
    language: window.navigator.language,
    resource: localLanguageResource,
  },
};

export const globalContext = React.createContext();

/**
 *
 * @param {object} state
 * @param {{
 *   type: string;
 *   payload: {
 *     url: string;
 *     name: string;
 *     fileSize: number;
 *     imageSize: string;
 *   }
 * }} action payload 为新导入图片的 url
 * @returns state
 */
function selectNewImageReducer(state, action) {
  const { url, name, fileSize, imageSize } = action.payload;
  return {
    ...state,
    imageInfo: {
      url,
      name,
      fileSize,
      imageSize,
    },
    imageUrl: url,
    currentImageUrl: url,
    moduleList: [],
  };
}

/**
 *
 * @param {object} state
 * @param {{ type: string; payload: WebGL2RenderingContext }} action
 * @returns state
 */
function updateCtxReducer(state, action) {
  const { ctx, imageSize } = action.payload;
  return {
    ...state,
    ctx,
    imageInfo: {
      ...state.imageInfo,
      imageSize,
    },
  };
}

/**
 *
 * @param {object} state
 * @param {{
 *  type: string;
 *  payload: {
 *    currentImageUrl: string;
 *    processModule: {
 *      name: string;
 *      originImage: Image;
 *      processFn: function;
 *    }
 *  }
 * }} action
 * @returns state
 */
function updateProcessModuleReducer(state, action) {
  const { currentImageUrl, processModule } = action.payload;

  const newModuleList = [...state.moduleList];

  if (
    state.moduleList.length > 0 &&
    processModule.name === state.moduleList[state.moduleList.length - 1].name
  ) {
    const topModule = newModuleList[newModuleList.length - 1];
    newModuleList[newModuleList.length - 1] = {
      name: topModule.name,
      repeat: topModule.repeat + 1,
    };
  } else {
    newModuleList.push({ name: processModule.name, repeat: 1 });
  }

  return {
    ...state,
    currentImageUrl,
    processModule,
    moduleList: newModuleList,
  };
}

function resetModuleReducer(state, action) {
  return {
    ...state,
    currentImageUrl: state.imageUrl,
    moduleList: [],
    processModule: {
      name: '',
      originImage: null,
      processFn: () => {},
    },
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

/**
 *
 * @param {object} state
 * @param {{ type: string; payload: string }} action
 * @returns state
 */
function changeModeReducer(state, action) {
  return {
    ...state,
    mode: action.payload,
  };
}

/**
 * 保存新的自定义处理模块
 * @param {object} state
 * @param {{ type: string; payload: string }} action
 * @returns state
 */
function saveNewModuleReducer(state, action) {
  const newSavedModuleList = [...state.savedModuleList];
  if (!state.savedModuleList.includes(action.payload)) {
    newSavedModuleList.push(action.payload);
  }
  window.localStorage.setItem(
    'custom-modules',
    JSON.stringify(newSavedModuleList)
  );
  return {
    ...state,
    savedModuleList: newSavedModuleList,
  };
}

/**
 * 删除保存的自定义处理模块
 * @param {object} state
 * @param {{ type: string; payload: string }} action
 * @returns state
 */
function deleteModuleReducer(state, action) {
  const moduleName = action.payload;
  const newSavedModuleList = state.savedModuleList.filter(
    name => name !== moduleName
  );
  window.localStorage.setItem(
    'custom-modules',
    JSON.stringify(newSavedModuleList)
  );
  return {
    ...state,
    savedModuleList: newSavedModuleList,
  };
}

function updateResourceReducer(state, action) {
  return {
    ...state,
    i18n: {
      ...state.i18n,
      resource: action.payload,
    },
  };
}

function changeLanguageReducer(state, action) {
  return {
    ...state,
    i18n: {
      ...state.i18n,
      language: action.payload,
    },
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'image/updateInfo':
      return selectNewImageReducer(state, action);
    case 'canvas/updateProcessModule':
      return updateProcessModuleReducer(state, action);
    case 'canvas/resetProcessModule':
      return resetModuleReducer(state, action);
    case 'canvas/updateCtx':
      return updateCtxReducer(state, action);
    case 'canvas/updateCurrentImage':
      return updateCurrentImageReducer(state, action);
    case 'canvas/changeMode':
      return changeModeReducer(state, action);
    case 'module/saveCustom':
      return saveNewModuleReducer(state, action);
    case 'module/deleteCustom':
      return deleteModuleReducer(state, action);
    case 'i18n/updateResource':
      return updateResourceReducer(state, action);
    case 'i18n/changeLanguage':
      return changeLanguageReducer(state, action);
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
