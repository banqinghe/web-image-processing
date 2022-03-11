import { useEffect, useState, useContext } from 'react';

import { globalContext } from '../../store';
import './index.css';
import logoUrl from '../../assets/favicon.svg';

function HeaderMenu() {
  const { dispatch } = useContext(globalContext);

  const [activeItem, setActiveItem] = useState('');

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

  useEffect(() => {
    window.addEventListener('click', handleClickWindow);
    return () => {
      window.removeEventListener('click', handleClickWindow);
    };
  }, []);

  async function handleImportImage() {
    const [fileHandle] = await window.showOpenFilePicker({
      types: [
        {
          description: 'Image',
          accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
          }
        }
      ],
      excludeAcceptAllOption: true,
    });
    const file = await fileHandle.getFile();
    dispatch({
      type: 'image/updateInfo',
      payload: {
        url: URL.createObjectURL(file),
        name: file.name,
        fileSize: file.size,
      },
    });
    setActiveItem('');
  }

  async function handleImportModule() {
    const [fileHandle] = await window.showOpenFilePicker({
      types: [
        {
          description: 'JavaScript File',
          accept: {
            'application/javascript': ['.js'],
          }
        }
      ],
      excludeAcceptAllOption: true,
    });
    const file = await fileHandle.getFile();
    const fileReader = new FileReader();
    fileReader.onload = () => {
      window.editor.setValue(fileReader.result);
      console.log(fileReader.result);
    };
    fileReader.readAsText(file);
    setActiveItem('');
  }

  return (
    <div className="header-menu">
      <img src={logoUrl} className="header-logo" alt="header-logo" />
      <ul className="header-menu-list">
        <li className="header-menu-item">
          <button onClick={() => setActiveItem('file')}>文件</button>
          <ul
            className="header-submenu"
            style={{ display: activeItem === 'file' ? 'block' : 'none' }}
          >
            <li className="header-submenu-item">
              <button onClick={handleImportImage}>导入图片</button>
            </li>
            <li className="header-submenu-item">
              <button onClick={handleImportModule}>导入自定义模块</button>
            </li>
          </ul>
        </li>
        <li className="header-menu-item"><button>语言</button></li>
        <li className="header-menu-item">
          <button onClick={() => console.log('canvas image by bqh')}>关于</button>
        </li>
      </ul>
    </div>
  )
}

export default HeaderMenu;
