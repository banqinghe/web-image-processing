/**
 * 点击元素外触发回调
 */
export function climbToWindow(
  element: Element | null,
  isBlock: (element: Element | null) => boolean,
  callback: (element: Element | null) => any
) {
  while (element) {
    element = element.parentElement;
    if (element && isBlock(element)) {
      return;
    }
  }
  callback(element);
}
