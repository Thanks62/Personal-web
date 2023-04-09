import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { HashRouter } from 'react-router-dom';
import { message } from 'antd';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
       <App />
    </HashRouter>
  </React.StrictMode>
);
(function adjustWidth() {
  var phoneWidth =  parseInt(window.screen.width); 
  var phoneScale = phoneWidth/1512; 
  var ua = navigator.userAgent; 
  if (/Android (\d+\.\d+)/.test(ua) || /ios (\d+\.\d+)/.test(ua)){ 
    var version = parseFloat(RegExp.$1); 
    if(version>2.3){ 
      document.write('<meta name="viewport" content="width=1512, minimum-scale = '+phoneScale+', maximum-scale = '+phoneScale+', target-densitydpi=device-dpi">'); 
    }else{ 
      document.write('<meta name="viewport" content="width=1512, target-densitydpi=device-dpi">'); 
    } 
  } else { 
    document.write('<meta name="viewport" content="width=1512, user-scalable=no, target-densitydpi=device-dpi">'); 
  }
})();
(function userAgentCheck() {
  let userAgent = navigator.userAgent;
  let isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1;
  let isEdge = userAgent.indexOf("Edge") > -1 && !isIE;
  if(isIE || isEdge) {
    message.warning("为了更佳的体验，推荐使用谷歌浏览器～")
  }
})();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals