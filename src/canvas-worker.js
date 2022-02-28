self.addEventListener('message', e => {
  const { customCode, pixels, width, height } = e.data;
  const func = new Function('pixels', 'width', 'height', `
    return (function() {
      ${customCode}
      if (typeof run !== 'undefined') {
        return run(pixels, width, height);
      }
      return null;
    })();
  `);

  self.postMessage(func(pixels, width, height));
});
