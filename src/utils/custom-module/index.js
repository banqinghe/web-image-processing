import preCode from './pre-code?raw';
import sufCode from './suf-code?raw';

function runCustomModule(ctx, code) {
  const processFn = new Function('ctx', preCode + code + sufCode);
  processFn(ctx);  
}

export { runCustomModule };
