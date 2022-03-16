import { set, get, update, del } from 'idb-keyval';

const modulePrefix = 'MODULE-';
const fileHandleKey = 'FILE_HANDLE';

const fileSumLimit = 10;

/**
 * 添加新的自定义模块代码
 */
function setCustomModule(name, code) {
  if (window.indexedDB) {
    return set(modulePrefix + name, code);
  } else {
    window.localStorage.setItem(modulePrefix + name, code);
  }
}

/**
 * 获取曾经已保存的模块代码
 */
function getCustomModule(name) {
  if (window.indexedDB) {
    return get(modulePrefix + name);
  } else {
    return new Promise(resolve => {
      const code = window.localStorage.getItem(modulePrefix + name);
      resolve(code);
    });
  }
}

/**
 * 删除保存的模块
 */
function deleteCustomModule(name) {
  if (window.indexedDB) {
    return del(modulePrefix + name);
  } else {
    window.localStorage.removeItem(modulePrefix + name);
  }
}

/**
 * 向最近打开文件 handle 列表中添加新 handle，新的项添加至队首
 */
function saveFileHandleList(handle) {
  get(fileHandleKey).then(list => {
    if (!list) {
      set(fileHandleKey, [handle]);
      return;
    }
    if (list.length === fileSumLimit) {
      update(fileHandleKey, prevList => {
        const sliceList = prevList.slice(0, prevList.length - 1);
        return [handle, ...sliceList];
      });
    } else {
      update(fileHandleKey, prevList => [handle, ...prevList]);
    }
  });
}

/**
 * 获取现有 handle
 */
function getFileHandleList() {
  return get(fileHandleKey);
}

/**
 * 获取 handle 内容权限
 */
async function verifyPermission(fileHandle, readWrite) {
  const options = {};
  if (readWrite) {
    options.mode = 'readwrite';
  }
  if ((await fileHandle.queryPermission(options)) === 'granted') {
    return true;
  }
  if ((await fileHandle.requestPermission(options)) === 'granted') {
    return true;
  }
  return false;
}

export {
  setCustomModule,
  getCustomModule,
  deleteCustomModule,
  saveFileHandleList,
  getFileHandleList,
  verifyPermission,
};
