import ReactDOM from 'react-dom';
import App from './App';
import { GlobalProvider } from '@/store';

import './styles/index.css';
import 'antd/dist/antd.css';
import 'virtual:windi.css';

ReactDOM.render(
  <GlobalProvider>
    <App />
  </GlobalProvider>,
  document.getElementById('root')
);
