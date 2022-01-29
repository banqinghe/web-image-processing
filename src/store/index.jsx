import React, { useReducer } from 'react';
import defaultImageUrl from '../assets/hor.jpg';

const initialState = {
  /** 当前读取图片 url */
  imageUrl: defaultImageUrl,
};

export const globalContext = React.createContext();

/**
 * 
 * @param {object} state 
 * @param {{ type: string; payload: string }} action payload 为新图片的 url
 * @returns state
 */
function selectNewImageReducer(state, action) {
  // console.log('action', action);
  state.imageUrl = action.payload;
  return { ...state };
}

function reducer(state, action) {
  switch (action.type) {
    case 'image/new':
      return selectNewImageReducer(state, action);
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
