import { useState } from 'react';
import { Modal, Tooltip } from 'antd';
import VerticalResizable from '../VerticalResizable';
import ToolBox from '../ToolBox';
import SupportComponent from '../SupportComponent';
import CodeEditor from '../CodeEditor';
import IconInformation from '../../icons/Information';
import hljs from 'highlight.js';
import './index.css';
import 'highlight.js/styles/vs.css';

const highlight = hljs.highlight;

const editorGuide = (
  <>
    <p>在编辑器中，你可以访问与图片有关的三个变量，分别为：</p>
    <ul className="list">
      <li><span className="key-word">width: number</span>，图片宽度（高度与宽度单位均为像素）。</li>
      <li><span className="key-word">height: number</span>，图片高度。</li>
      <li>
        <span className="key-word">
          pixels: {'{'} r: number; g: number; b: number; a: number {'}'}[width][height]
        </span>，
        <span className="key-word">rgba</span>值范围均为<span className="key-word">[0, 255]</span>。
      </li>
    </ul>
    {/* <p>在渲染模式为<span className="key-word">Canvas</span>时，你可以通过修改<span className="key-word">pixels</span>数组中的像素值来对当前已加载的图像进行修改。
      以下为一个实现图片二值化的简单 demo：
    </p>
    <pre>
      <code
        // className="javascript"
        dangerouslySetInnerHTML={{
          __html: highlight(`
              let name = 'banqinghe';
            `,
            { language: 'javascript' }).value
        }} />
    </pre> */}
  </>
);

function ToolSideBar() {
  const [guideVisible, setGuideVisible] = useState(false);

  return (
    <aside className="tool-bar">
      <VerticalResizable
        defaultHeightList={['30%', '10%', '60%']}
        dividerText={[
          '辅助组件',
          <div className="code-editor-divider-content">
            <span>代码编辑</span>
            <Tooltip title="编辑器使用指南" placement="right">
              <span className="icon-container" onClick={() => setGuideVisible(true)}>
                <IconInformation style={{ marginLeft: 6, width: 14 }} />
              </span>
            </Tooltip>
          </div>,
        ]}
      >
        <ToolBox />
        <SupportComponent />
        <CodeEditor />
      </VerticalResizable>
      <Modal
        width={800}
        className="guide-modal"
        visible={guideVisible}
        title="编辑器使用指南"
        onCancel={() => setGuideVisible(false)}
        footer={null}
      >
        {editorGuide}
      </Modal>
    </aside>
  );
}

export default ToolSideBar;
