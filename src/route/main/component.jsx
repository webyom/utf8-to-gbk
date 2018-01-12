import $ from 'jquery';
import React from 'react';
import {shell} from 'electron';
import path from 'path';
import iconv from 'iconv-lite';
import Promise from 'bluebird';
import Alerts from '../../util/alerts';
import Modal from '../../util/modal';

const fs = Promise.promisifyAll(require('fs'));

const NoticeComponent = function (props) {
  return <div>
    转换后的文件已保存到<br />{props.newPath}<br />点击<strong>确定</strong>查看文件
  </div>;
};

class ModuleComponent extends React.Component {
  componentDidMount() {
    $(this.dropBox).on('dragover', evt => {
      $(this.dropBox).addClass('drag-over');
    }).on('dragleave', evt => {
      $(this.dropBox).removeClass('drag-over');
    }).on('drop', async evt => {
      $(this.dropBox).removeClass('drag-over');
      try {
        let filePath = evt.originalEvent.dataTransfer.files[0].path;
        let res = await fs.readFileAsync(filePath);
        let buf = iconv.decode(res, 'utf-8');
        buf = iconv.encode(buf, 'gbk');
        let info = path.parse(filePath);
        let newPath = path.join(info.dir, info.name + '.gbk' + info.ext);
        await fs.writeFileAsync(newPath, buf);
        Modal.confirm(<NoticeComponent newPath={newPath} />, function () {
          shell.showItemInFolder(newPath);
        });
      } catch (err) {
        Alerts.err(err);
      }
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
