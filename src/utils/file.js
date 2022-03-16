/**
 * 从文件系统中获取指定类型的文件的 Handle
 */
async function getFileFromFileSystem(types) {
  const [fileHandle] = await window.showOpenFilePicker({
    types: types ?? [{ description: 'All', accept: { '*/*': ['*'] } }],
    excludeAcceptAllOption: true,
  });
  return fileHandle;
}

/**
 * 将文本或图片保存至本地
 */
async function saveFileToFileSystem(content, type, suggestedName) {
  const options = {
    suggestedName:
      suggestedName ?? (type === 'image' ? 'image-result' : 'canvas-script'),
    types: [
      {
        description: 'Image',
        accept: { 'image/png': ['.png'], 'image/jpg': ['.jpg', '.jpeg'] },
      },
      {
        description: 'JavaScript Files',
        accept: { 'application/javascript': ['.js'] },
      },
      {
        description: 'Text Files',
        accept: { 'text/plain': ['.txt'] },
      },
    ],
  };
  const fileHandle = await window.showSaveFilePicker(options);
  const writable = await fileHandle.createWritable();
  await writable.write(content);
  await writable.close();
}

async function getNewFileHandle(suggestedName) {
  const options = {
    suggestedName: suggestedName,
    types: [
      {
        description: 'JavaScript Files',
        accept: {
          'application/javascript': ['.js'],
        },
      },
      {
        description: 'Text Files',
        accept: {
          'text/plain': ['.txt'],
        },
      },
    ],
  };
  const handle = await window.showSaveFilePicker(options);
  return handle;
}

async function writeFile(fileHandle, contents) {
  const writable = await fileHandle.createWritable();
  await writable.write(contents);
  await writable.close();
}

export {
  getNewFileHandle,
  writeFile,
  getFileFromFileSystem,
  saveFileToFileSystem,
};
