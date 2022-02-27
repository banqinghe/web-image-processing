/**
 * 点击元素外触发回调，一般用于 menu item
 */
function climbToWindow(element, isBlock, callback) {
  while (element) {
    element = element.parentElement;
    if (element && isBlock(element)) {
      return;
    }
  }
  callback();
}

export { climbToWindow };
