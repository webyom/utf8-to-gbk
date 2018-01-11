import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import {useStrict} from 'mobx';
import Skateboard from 'skateboardjs';
import * as Util from './util/main';
import path from 'path';

/**
 * use mobx strict mode
 */
useStrict(true);

/**
 * define global properties
 */
global.resolveRoot = function (p) {
  let parts = __filename.split('/src/');
  parts.pop();
  return path.resolve(path.join(parts.join('/src'), 'dist'), p);
};

global.requireRoot = function (p) {
  return require(global.resolveRoot(p));
};

document.ondragover = document.ondrop = function (evt) {
  evt.preventDefault();
};


/**
 * bootstrap UI
 */
const ALERT_MOD_NAME = 'alert';
Skateboard.core.init({
  container: $('.app-wrapper'),
  defaultModName: 'main',
  alertModName: ALERT_MOD_NAME,
  modBase: path.resolve(__dirname, 'route') + '/',
  loadingMsg: ' ',
  modCacheable: true,
  isSupportHistoryState: false,
  animate: {
    type: 'fade',
    timingFunction: 'ease-out',
    slideOutPercent: 30,
    duration: 300
  },
  react: {
    React: React,
    createElement: React.createElement,
    ReactDOM: ReactDOM,
    render: ReactDOM.render,
    unmountComponentAtNode: ReactDOM.unmountComponentAtNode
  },
  onBeforeViewChange(modName, modInst) {
    Util.Route.onBeforeChange.dispatch(modName, modInst);
    return true;
  },
  onLoadModFail(mark, modName, params, opt, type, top) {
    top && modName != ALERT_MOD_NAME && Skateboard.core.showAlert({type: 'error', subType: 'load_mod_fail', relModName: modName}, {holdMark: type == 'view'});
  },
  onInitModFail(mark, modName, params, opt, type, top) {
    top && modName != ALERT_MOD_NAME &&  Skateboard.core.showAlert({type: 'error', subType: 'init_mod_fail', relModName: modName}, {holdMark: type == 'view'});
  },
  onFirstRender() {
  }
});
