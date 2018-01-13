import 'babel-polyfill';
import {app, dialog} from 'electron';
import * as mainWindow from './main/main-window';
import * as mainMenu from './main/main-menu';
import isDev from 'electron-is-dev';

isDev && require('electron-debug')({showDevTools: true});

app.on('ready', function () {
  mainMenu.createMenu();
  mainWindow.createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  mainWindow.createWindow();
});

process.on('uncaughtException', async function (err) {
  dialog.showErrorBox('程序错误，即将退出！', err.message);
  app.quit();
});
