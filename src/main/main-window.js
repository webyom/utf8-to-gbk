import {BrowserWindow} from 'electron';
import path from 'path';
import url from 'url';

let mainWindow;

export function createWindow() {
  if (mainWindow) {
    return;
  }
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
    pathname: path.resolve(__dirname, '../window/main.html'),
    protocol: 'file',
    slashes: true
  }));
  mainWindow.on('close', function () {
    mainWindow = null;
  });
}

export function getWindow() {
  return mainWindow;
}
