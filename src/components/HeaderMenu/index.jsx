import { useEffect, useState, useContext } from 'react';
import { globalContext } from '../../store';
import './index.css';
import logoUrl from '../../assets/favicon.svg';
import {
  getFileHandleList,
  saveFileHandleList,
  verifyPermission,
} from '../../utils/idb';
import { getFileFromFileSystem } from '../../utils/file';
import { getText } from '../../i18n';

function HeaderMenu() {
  const { state, dispatch } = useContext(globalContext);
  const t = getText(state.i18n);

  const [activeItem, setActiveItem] = useState('');
  const [recentFileVisible, setRecentFileVisible] = useState(false);
  const [recentFileHandleList, setRecentFileHandleList] = useState([]);

  function handleClickWindow(e) {
    let element = e.target;
    while (element) {
      element = element.parentElement;
      if (element && element.classList.contains('header-menu-item')) {
        return;
      }
    }
    setActiveItem('');
  }

  function changeColorTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      window.editor._themeService.setTheme('vs-dark');
    } else {
      document.documentElement.classList.remove('dark');
      window.editor._themeService.setTheme('vs');
    }
  }

  function followSystemTheme(e) {
    changeColorTheme(e.matches ? 'dark' : 'light');
  }

  useEffect(() => {
    window.addEventListener('click', handleClickWindow);
    // 检测操作系统当前是否开启暗色模式
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      document.documentElement.classList.add('dark');
    }
    // 监听操作系统的浅色暗色模式切换
    window
      .matchMedia('(prefers-color-scheme: dark)')
      ?.addEventListener('change', followSystemTheme);
    return () => {
      window.removeEventListener('click', handleClickWindow);
      window
        .matchMedia('(prefers-color-scheme: dark)')
        ?.removeEventListener('change', followSystemTheme);
    };
  }, []);

  function importFile(file) {
    dispatch({
      type: 'image/updateInfo',
      payload: {
        url: URL.createObjectURL(file),
        name: file.name,
        fileSize: file.size,
      },
    });
  }

  async function importFileByHandle(handle) {
    await verifyPermission(handle);
    const file = await handle.getFile();
    importFile(file);
  }

  function handleImportRecentImage(handle) {
    importFileByHandle(handle);
    setActiveItem('');
  }

  async function handleImportImage() {
    const types = [
      {
        description: 'Image',
        accept: {
          'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
        },
      },
    ];
    const fileHandle = await getFileFromFileSystem(types);
    saveFileHandleList(fileHandle);
    importFileByHandle(fileHandle);
    setActiveItem('');
  }

  async function handleImportModule() {
    const [fileHandle] = await window.showOpenFilePicker({
      id: 'script',
      types: [
        {
          description: 'JavaScript File',
          accept: {
            'application/javascript': ['.js'],
          },
        },
      ],
      excludeAcceptAllOption: true,
    });
    const file = await fileHandle.getFile();
    const fileReader = new FileReader();
    fileReader.onload = () => {
      window.editor.setValue(fileReader.result);
    };
    fileReader.readAsText(file);
    setActiveItem('');
  }

  function handleMouseEnter() {
    getFileHandleList().then(handleList => {
      setRecentFileHandleList(handleList);
    });
    setRecentFileVisible(true);
  }

  function handleMouseLeave() {
    setRecentFileVisible(false);
  }

  function changeLanguage(language) {
    dispatch({
      type: 'i18n/changeLanguage',
      payload: language,
    });
    setActiveItem('');
  }

  return (
    <div className="header-menu">
      <img src={logoUrl} className="header-logo" alt="header-logo" />
      <ul className="header-menu-list">
        <li className="header-menu-item">
          <button onClick={() => setActiveItem('file')}>{t('File')}</button>
          <ul
            className="header-submenu"
            style={{ display: activeItem === 'file' ? 'block' : 'none' }}
          >
            <li className="header-submenu-item">
              {window.indexedDB ? (
                <button onClick={handleImportImage}>导入新图片</button>
              ) : (
                <label for="new-image">
                  导入新图片
                  <input
                    type="file"
                    name="new-image"
                    id="new-image"
                    style={{ display: 'none' }}
                    onChange={e => {
                      const file = e.target.files[0];
                      e.target.value = null;
                      importFile(file);
                    }}
                  />
                </label>
              )}
            </li>
            <li
              style={
                window.indexedDB
                  ? undefined
                  : { pointerEvents: 'none', background: '#f44' }
              }
              className="header-submenu-item"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button>导入最近使用图片</button>
              <div
                className="recent-file-list"
                style={{ display: recentFileVisible ? 'block' : 'none' }}
              >
                {recentFileHandleList.map((handle, index) => (
                  <button
                    key={index}
                    onClick={() => handleImportRecentImage(handle)}
                  >
                    {handle.name}
                  </button>
                ))}
              </div>
            </li>
            <li className="header-submenu-item">
              <button onClick={handleImportModule}>导入自定义模块</button>
            </li>
          </ul>
        </li>
        <li className="header-menu-item">
          <button onClick={() => setActiveItem('language')}>语言</button>
          <ul
            className="header-submenu"
            style={{ display: activeItem === 'language' ? 'block' : 'none' }}
          >
            <li className="header-submenu-item">
              <button onClick={() => changeLanguage('zh-CN')}>简体中文</button>
            </li>
            <li className="header-submenu-item">
              <button onClick={() => changeLanguage('en-US')}>English</button>
            </li>
            <li className="header-submenu-item">
              <button onClick={() => changeLanguage(window.navigator.language)}>
                跟随系统
              </button>
            </li>
          </ul>
        </li>
        <li className="header-menu-item">
          <button onClick={() => setActiveItem('theme')}>主题</button>
          <ul
            className="header-submenu"
            style={{ display: activeItem === 'theme' ? 'block' : 'none' }}
          >
            <li className="header-submenu-item">
              <button onClick={() => changeColorTheme('light')}>
                浅色模式
              </button>
            </li>
            <li className="header-submenu-item">
              <button onClick={() => changeColorTheme('dark')}>暗色模式</button>
            </li>
            <li className="header-submenu-item">
              <button
                onClick={() =>
                  changeColorTheme(
                    window.matchMedia &&
                      window.matchMedia('(prefers-color-scheme: dark)').matches
                      ? 'dark'
                      : 'light'
                  )
                }
              >
                跟随系统
              </button>
            </li>
          </ul>
        </li>
        <li className="header-menu-item">
          <button onClick={() => console.log('canvas image by bqh')}>
            关于
          </button>
        </li>
      </ul>
    </div>
  );
}

export default HeaderMenu;
