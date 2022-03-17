import { useState, useContext } from 'react';
import { Modal, Tooltip } from 'antd';
import VerticalResizable from '../VerticalResizable';
import ToolBox from '../ToolBox';
import SupportComponent from '../SupportComponent';
import CodeEditor from '../CodeEditor';
import IconInformation from '../../icons/Information';
// import hljs from 'highlight.js';
import { globalContext } from '../../store';
import { getText } from '../../i18n';
import { EditorGuideCN, EditorGuideEN } from './Guide';

import './index.css';
// import 'highlight.js/styles/vs.css';

// const highlight = hljs.highlight;

function ToolSideBar() {
  const { state } = useContext(globalContext);
  const t = getText(state.i18n);

  const [guideVisible, setGuideVisible] = useState(false);

  return (
    <aside className="tool-bar">
      <VerticalResizable
        defaultHeightList={['30%', '10%', '60%']}
        dividerText={[
          t('Support Component'),
          <div className="code-editor-divider-content">
            <span>{t('Code Editor')}</span>
            <Tooltip title={t('Code Editor Guide')} placement="right">
              <span
                className="icon-container"
                onClick={() => setGuideVisible(true)}
              >
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
        title={t('Code Editor Guide')}
        onCancel={() => setGuideVisible(false)}
        footer={null}
      >
        {state.i18n.language === 'zh-CN' && EditorGuideCN}
        {state.i18n.language === 'en-US' && EditorGuideEN}
      </Modal>
    </aside>
  );
}

export default ToolSideBar;
