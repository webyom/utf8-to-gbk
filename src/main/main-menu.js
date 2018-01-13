import {app, dialog, Menu} from 'electron';
import * as mainWindow from './main-window';

let template = [
  {
    label: '文件',
    submenu: [
      {
        label: '选择文件',
        click: function () {
          dialog.showOpenDialog({
            properties: ['openFile']
          }, function (filePaths) {
            if (!filePaths) {
              return;
            }
            let win = mainWindow.getWindow();
            win && win.webContents.send('chooseFile', filePaths[0]);
          });
        }
      }
    ]
  }
];

if (process.platform == 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      {role: 'about'},
      {type: 'separator'},
      {role: 'hide'},
      {role: 'hideothers'},
      {role: 'unhide'},
      {type: 'separator'},
      {role: 'quit'}
    ]
  });
}

let mainMenu;

export function createMenu() {
  if (mainMenu) {
    return;
  }
  mainMenu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(mainMenu);
}
