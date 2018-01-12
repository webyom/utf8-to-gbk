import $ from 'jquery';
import React from 'react';
import {shell} from 'electron';
import {observer} from 'mobx-react';
import {types} from 'mobx-state-tree';
import Alerts from '../../util/alerts';
import Modal from '../../util/modal';

const IconvState = types.model('IconvState', {
  working: false
}).actions(self => ({
  setWorking(working) {
    self.working = working;
  }
}));

const NoticeComponent = function (props) {
  return <div>
    转换后的文件已保存到<br />{props.newPath}<br />点击<strong>确定</strong>查看文件
  </div>;
};

@observer
class ModuleComponent extends React.Component {
  constructor(props) {
    super(props);
    this.iconvState = IconvState.create();
  }

  componentDidMount() {
    $(this.dropBox).on('dragover', evt => {
      $(this.dropBox).addClass('drag-over');
    }).on('dragleave', evt => {
      $(this.dropBox).removeClass('drag-over');
    }).on('drop', async evt => {
      $(this.dropBox).removeClass('drag-over');
      if (this.iconvState.working) {
        return;
      }
      let worker = new Worker(resolveRoot('route/main/iconv-worker.js'));
      worker.onmessage = (evt) => {
        let data = evt.data;
        if (data.type == 'start') {
          this.iconvState.setWorking(true);
        } else if (data.type == 'finish') {
          this.iconvState.setWorking(false);
          if (data.err) {
            Alerts.err(data.err);
          } else {
            Modal.confirm(<NoticeComponent newPath={data.newPath} />, function () {
              shell.showItemInFolder(data.newPath);
            });
          }
        }
      };
      worker.postMessage(evt.originalEvent.dataTransfer.files[0].path);
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
            {this.iconvState.working ? '正在转换，请稍候...' : '请把要转换的文件拖拽到这里...'}<br />
            <i className="fa fa-download"></i>
          </div>
        </div>
      </div>
    </div>;
  }
}

export default ModuleComponent;
