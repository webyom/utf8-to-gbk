import 'babel-polyfill';
import {app, BrowserWindow, dialog} from 'electron';
import path from 'path';
import url from 'url';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    minWidth: 600,
    minHeight: 400,
    webPreferences: {
      nodeIntegrationInWorker: true
    }
  });
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file',
    slashes: true
  }));
  mainWindow.on('close', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

process.on('uncaughtException', async function (err) {
  dialog.showErrorBox('程序错误，即将退出！', err.message);
  app.quit();
});
