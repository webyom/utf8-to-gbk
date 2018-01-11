import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import Route from './route';

let containerDOM = $('<div class="app-modals"></div>').appendTo(document.body)[0];
let modal = null;

class ConfirmComponent extends React.Component {
  render() {
    let props = this.props;
    return (
      <div className="modal fade modal--confirm">
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-body">
              {props.text}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={props.ok}>确定</button>
              <button type="button" className="btn btn-default" data-dismiss="modal" onClick={props.cancel}>取消</button>
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
    Modal.open(ConfirmComponent, null, {
      text, ok, cancel
    });
  }
};

Route.onBeforeChange.add(() => {
  Modal.close();
});

export default Modal;
