import { useEffect, useState, useContext } from 'react';
import { globalContext } from '@/store';
import logoUrl from '@/assets/favicon.svg';
import {
  getFileHandleList,
  saveFileHandleList,
  verifyPermission,
} from '@/utils/idb';
import { getFileFromFileSystem } from '@/utils/file';
import { getText } from '@/i18n';
import Menu from '@/components/Menu';

export default function HeaderMenu() {
  const { state, dispatch } = useContext(globalContext);
  const t = getText(state.i18n);

  const [recentFileHandleList, setRecentFileHandleList] = useState<
    FileSystemFileHandle[]
  >([]);

  const changeColorTheme = theme => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      window.editor._themeService.setTheme('vs-dark');
    } else {
      document.documentElement.classList.remove('dark');
      window.editor._themeService.setTheme('vs');
    }
  };

  const followSystemTheme = e => {
    changeColorTheme(e.matches ? 'dark' : 'light');
  };

  const importFile = (file: File) => {
    dispatch({
      type: 'image/updateInfo',
      payload: {
        url: URL.createObjectURL(file),
        name: file.name,
        fileSize: file.size,
      },
    });
  };

  const importFileByHandle = async (handle: FileSystemFileHandle) => {
    await verifyPermission(handle);
    const file = await handle.getFile();
    importFile(file);
  };

  const handleImportRecentImage = (handle: FileSystemFileHandle) => {
    importFileByHandle(handle);
  };

  const handleImportImage = async () => {
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
  };

  const handleImportModule = async () => {
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
  };

  const handleMouseEnterRecent = () => {
    getFileHandleList().then(handleList => setRecentFileHandleList(handleList));
  };

  const changeLanguage = language => {
    dispatch({
      type: 'i18n/changeLanguage',
      payload: language,
    });
  };

  useEffect(() => {
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
      window
        .matchMedia('(prefers-color-scheme: dark)')
        ?.removeEventListener('change', followSystemTheme);
    };
  }, []);

  return (
    <div className="flex items-center h-[var(--header-height)] bg-[var(--bg-color)] border-b border-[var(--divider-bg)]">
      <img
        src={logoUrl}
        className="w-4 h-4 mx-1 filter dark:invert-[1]"
        alt="header-logo"
      />
      <ul className="flex items-center h-full text-[13px]">
        {/* 文件导入 */}
        <li className="h-full">
          <Menu
            label={t('File')}
            className="h-full"
            options={[
              { label: t('New Image'), onClick: handleImportImage },
              {
                label: t('Recent Images'),
                onMouseEnter: handleMouseEnterRecent,
                childrenOptions: recentFileHandleList.map(handle => ({
                  label: handle.name,
                  onClick: () => handleImportRecentImage(handle),
                })),
              },
              { label: t('Import Custom Module'), onClick: handleImportModule },
            ]}
          />
        </li>

        {/* 语言切换 */}
        <li className="h-full">
          <Menu
            label={t('Language')}
            className="h-full"
            options={[
              { label: '简体中文', onClick: () => changeLanguage('zh-CN') },
              {
                label: 'English',
                onClick: () => changeLanguage('en-US'),
              },
              {
                label: t('Follow System'),
                onClick: () => changeLanguage(window.navigator.language),
              },
            ]}
          />
        </li>

        {/* 颜色主题切换 */}
        <li className="h-full">
          <Menu
            label={t('Theme')}
            className="h-full"
            options={[
              { label: t('Light'), onClick: () => changeColorTheme('light') },
              { label: t('Dark'), onClick: () => changeColorTheme('dark') },
              {
                label: t('Follow System'),
                onClick: () =>
                  changeColorTheme(
                    window.matchMedia &&
                      window.matchMedia('(prefers-color-scheme: dark)').matches
                      ? 'dark'
                      : 'light'
                  ),
              },
            ]}
          />
        </li>

        {/* 关于 */}
        <li className="h-full">
          <button
            className="h-full px-2"
            onClick={() => console.log('canvas image by bqh')}
          >
            {t('About')}
          </button>
        </li>
      </ul>
    </div>
  );
}
