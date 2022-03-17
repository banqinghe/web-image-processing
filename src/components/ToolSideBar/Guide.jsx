const EditorGuideCN = (
  <>
    <p>
      在编辑器中声明名为<span className="key-word">run</span>
      的函数即可对图像进行操作，该函数将会被传入三个与图片有关的变量，分别为：
    </p>
    <ul className="list">
      <li>
        <span className="key-word">width: number</span>
        ，图片宽度（高度与宽度单位均为像素）。
      </li>
      <li>
        <span className="key-word">height: number</span>，图片高度。
      </li>
      <li>
        <span className="key-word">
          pixels: {'{'} r: number; g: number; b: number; a: number {'}'}
          [width][height]
        </span>
        ，<span className="key-word">rgba</span>值范围均为
        <span className="key-word">[0, 255]</span>。
      </li>
    </ul>
    <p>
      <span className="key-word">run</span>
      函数需要返回与第三个参数相同的数据结构以输出新的图像。
    </p>
  </>
);

const EditorGuideEN = (
  <>
    <p>
      The image can be manipulated by declaring a function named
      <span className="key-word">run</span> in the editor. The function will be
      passed three variables related to the image, namely:
    </p>
    <ul className="list">
      <li>
        <span className="key-word">width: number</span>, image width (height and
        width are in pixels)。
      </li>
      <li>
        <span className="key-word">height: number</span>, image height.
      </li>
      <li>
        <span className="key-word">
          pixels: {'{'} r: number; g: number; b: number; a: number {'}'}
          [width][height]
        </span>
        , <span className="key-word">rgba</span>values are in the range
        <span className="key-word">[0, 255]</span>。
      </li>
    </ul>
    <p>
      function <span className="key-word">run</span>
      needs to return the same data structure as the third parameter to output
      the new image.
    </p>
  </>
);

export { EditorGuideCN, EditorGuideEN };
