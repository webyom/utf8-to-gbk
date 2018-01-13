import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import Route from './route';

let containerDOM = $('<div class="app-modals"></div>').appendTo(document.body)[0];
let modal = null;

class DefaultComponent extends React.Component {
  cancel() {}

  render() {
    let props = this.props;

    return (
      <div className="modal fade modal--confirm">
        <div className={classNames('modal-dialog', props.size ? 'modal-' + props.size : '')}>
          <div className="modal-content">
            <div className="modal-body">{props.text}</div>
            <div className="modal-footer">
              {(() => {
                if (props.ok) {
                  return [
                    <button key="ok" type="button" className="btn btn-primary" data-dismiss="modal" onClick={props.ok}>确定</button>,
                    <button key="cancel" type="button" className="btn btn-default" data-dismiss="modal" onClick={props.cancel || this.cancel}>取消</button>
                  ];
                } else {
                  return <button type="button" className="btn btn-default" data-dismiss="modal">关闭</button>;
                }
              })()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

let Modal = {
  /**
   * @param {ReactComponent} ModalComponent
   * @param {Object} opt bootstrap modal options
   * @param {Object} props props for ModalComponent
   */
  open(ModalComponent, opt, props) {
    let component = ReactDOM.render(React.createElement(ModalComponent, props), containerDOM);
    modal = $(ReactDOM.findDOMNode(component)).on('hidden.bs.modal', evt => {
      ReactDOM.unmountComponentAtNode(containerDOM);
    });
    opt = $.extend({keyboard: true, backdrop: true}, opt);
    modal.modal(opt);
    return modal;
  },

  close() {
    if (modal) {
      modal.modal('hide');
      modal = null;
    }
  },

  confirm(text, ok = (() => 1), cancel = (() => 1)) {
    Modal.open(DefaultComponent, null, {
      text, ok, cancel
    });
  },

  alert(text) {
    Modal.open(DefaultComponent, null, {
      text
    });
  }
};

Route.onBeforeChange.add(() => {
  Modal.close();
});

export default Modal;
