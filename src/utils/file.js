async function getNewFileHandle(suggestedName) {
  const options = {
    suggestedName: suggestedName,
    types: [
      {
        description: 'JavaScript Files',
        accept: {
          'application/javascript': ['.js'],
        }
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
  // Create a FileSystemWritableFileStream to write to.
  const writable = await fileHandle.createWritable();
  // Write the contents of the file to the stream.
  await writable.write(contents);
  // Close the file and write the contents to disk.
  await writable.close();
}

export { getNewFileHandle, writeFile };
