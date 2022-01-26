import { useEffect, useState } from 'react';
import './index.css';
import logoUrl from '../../assets/favicon.svg';

function HeaderPopover() {
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
            <li className="header-submenu-item"><button>选择图片</button></li>
            <li className="header-submenu-item"><button>保存图片</button></li>
          </ul>
        </li>
        <li className="header-menu-item">
          <button onClick={() => console.log('canvas image by bqh')}>关于</button>
        </li>
      </ul>
    </div>
  )
}

export default HeaderPopover;
