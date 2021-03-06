import React from 'react';

class ModuleComponent extends React.Component {
  render() {
    let props = this.props;
    let opt = props.route.opt;

    return (
      <div>
        <p>
          <i className="fa fa-exclamation-triangle" /> {(() => {
            if (opt.subType == 'init_mod_fail') {
              return `初始化模块“${opt.relModName}”失败`;
            } else if (opt.subType == 'load_mod_fail') {
              return `加载模块“${opt.relModName}”失败`;
            } else {
              return '未知错误';
            }
          })()}
        </p>
        <a href="/:back" className="btn btn-lg btn-primary">返回</a>
      </div>
    );
  }
}

export default ModuleComponent;
