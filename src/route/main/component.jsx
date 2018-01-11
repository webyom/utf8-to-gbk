import $ from 'jquery';
import React from 'react';
import {shell} from 'electron';
import fs from 'fs';
import path from 'path';
import iconv from 'iconv-lite';
import Alerts from '../../util/alerts';
import Modal from '../../util/modal';

class ModuleComponent extends React.Component {
  componentDidMount() {
    $(this.dropBox).on('dragover', evt => {
      $(this.dropBox).addClass('drag-over');
    }).on('dragleave', evt => {
      $(this.dropBox).removeClass('drag-over');
    }).on('drop', evt => {
      $(this.dropBox).removeClass('drag-over');
      let filePath = evt.originalEvent.dataTransfer.files[0].path;
      let content = fs.readFile(filePath, function (err, res) {
        if (err) {
          return Alerts.err(err);
        }
        let buf = iconv.decode(res, 'utf-8');
        buf = iconv.encode(buf, 'gbk');
        let info = path.parse(filePath);
        let newPath = path.join(info.dir, info.name + '.gbk' + info.ext);
        fs.writeFile(newPath, buf, function (err) {
          if (err) {
            return Alerts.err(err);
          }
          Modal.confirm('转换后的文件已保存到 ' + newPath + ' 点击确定查看文件', function () {
            shell.showItemInFolder(newPath);
          });
        });
      });
    });
  }

  componentWillUnmount() {
    $(this.dropBox).off('dragover drop');
  }

  render() {
    return <div>
      <div className="panel panel-default panel-drop" ref={el => this.dropBox = el}>
        <div className="panel-body">
          <div className="content">
            请把要转换的文件拖拽到这里...<br />
            <i className="fa fa-download"></i>
          </div>
        </div>
      </div>
    </div>;
  }
}

export default ModuleComponent;
