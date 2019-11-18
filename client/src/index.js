import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import PrivyApp from './PrivyApp';

// webpack-dev-server requires window.onload delay for proper resizing after any refresh (automatic or manual)
// window.onload = () =>
ReactDOM.render(<PrivyApp />, document.getElementById('root'));
module.hot.accept();
