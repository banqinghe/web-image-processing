self.addEventListener('message', e => {
  // ---------------- PERFORMANCE TEST BEGIN ----------------
  const startTime = performance.now();

  const { customCode, pixels, width, height } = e.data;
  const func = new Function('pixels', 'width', 'height', `
    ${customCode}
    if (typeof run === 'function') {
      return run(pixels, width, height);
    }
    return null;
  `);
  const result = func(pixels, width, height);

  console.log('Web Worker duration:', performance.now() - startTime);
  // ---------------- PERFORMANCE TEST END ----------------

  self.postMessage(result);
});
