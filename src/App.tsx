import { useEffect, useContext } from 'react';
import HeaderMenu from '@/components/HeaderMenu';
import HorizonResizable from '@/components/HorizonResizable';
import WebGLCanvas from '@/components/WebGLCanvas';
import ToolSideBar from '@/components/ToolSideBar';
import { globalContext } from '@/store';

function App() {
  const { state, dispatch } = useContext(globalContext);
  useEffect(() => {
    fetch(state.i18n.languageResourceUrl)
      .then(res => res.json())
      .then(resource => {
        console.log('resource from network', resource);
        dispatch({
          type: 'i18n',
          payload: resource,
        });
      })
      .catch(() => {
        console.error('Fail to fetch language from network');
      });
  }, []);

  return (
    <div className="app">
      <HeaderMenu />
      <main className="w-screen h-[calc(100vh-var(--header-height))]">
        <HorizonResizable defaultWidthList={['30%', '70%']}>
          <ToolSideBar />
          <WebGLCanvas />
        </HorizonResizable>
      </main>
    </div>
  );
}

export default App;
