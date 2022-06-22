// TypeScript has some wrong with File System Access API

/**
 * 从文件系统中获取指定类型的文件的 Handle
 */
export async function getFileFromFileSystem(types: any[]) {
  const [fileHandle] = await window.showOpenFilePicker({
    types: types ?? [{ description: 'All', accept: { '*/*': ['*'] } }],
    excludeAcceptAllOption: true,
  });
  return fileHandle;
}

/**
 * 将文本或图片保存至本地
 */
export async function saveFileToFileSystem(
  content: string,
  type: string,
  suggestedName: string
) {
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

export async function getNewFileHandle(suggestedName: string) {
  const options = {
    suggestedName,
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

export async function writeFile(
  fileHandle: FileSystemFileHandle,
  contents: string
) {
  const writable = await fileHandle.createWritable();
  await writable.write(contents);
  await writable.close();
}
