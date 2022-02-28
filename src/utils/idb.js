import { set, get, update, del } from 'idb-keyval';

const modulePrefix = 'MODULE-';
const fileHandleKey = 'FILE_HANDLE';

/**
 * 添加新的自定义模块代码
 */
function setCustomModule(name, code) {
  return set(modulePrefix + name, code);
}

/**
 * 获取曾经已保存的模块代码
 */
function getCustomModule(name) {
  return get(modulePrefix + name);
}

/**
 * 删除保存的模块
 */
function deleteCustomModule(name) {
  return del(modulePrefix + name);
}

/**
 * 向最近打开文件 handle 列表中添加新 handle，新的项添加至队首
 */
function unshiftFileHandleList(handle) {
  get(fileHandleKey)
    .then(list => {
      if (!list) {
        set(fileHandleKey, [handle]);
        return;
      }
      update(fileHandleKey, prevList => [handle, ...prevList])
    });
}


export {
  setCustomModule,
  getCustomModule,
  deleteCustomModule,
  unshiftFileHandleList,
};
