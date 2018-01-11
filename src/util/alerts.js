import $ from 'jquery';
import Route from './route';

let containerDOM = $('<div class="app-alerts"></div>').appendTo(document.body)[0];
let modal = null;
let toRef = null;

let Alerts = {
  /**
   * @param {String} content
   * @param {Number} timeout ms delay to hide
   * @param {String} type success|info|warning|danger
   */
  show(content, timeout = 10000, type = 'info') {
    clearTimeout(toRef);
    this.hide();
    let tpl = `<div class="alert alert-${type} alert-dismissible">
      <button type="button" class="close" onclick="requireRoot('util/main').Alerts.hide();"><span>&times;</span></button>
      ${content}
    </div>`;
    let dom = $(tpl).appendTo(containerDOM);
    dom[0].offsetTop;
    dom.addClass('show');
    toRef = setTimeout(this.hide, timeout);
  },

  hide() {
    let alerts = $('.alert', containerDOM);
    alerts.removeClass('show');
    setTimeout(() => {
      alerts.remove();
    }, 300);
  }
};

for (let type of ['success', 'info', 'warning', 'danger']) {
  Alerts[type] = (content, timeout) => Alerts.show(content, timeout, type);
}

Alerts.suc = Alerts.success;
Alerts.warn = Alerts.warning;

Alerts.error = Alerts.err = (content, timeout) => {
  Log.error(content);
  if (typeof content == 'object' && content) {
    if (content.responseText) {
      try {
        content = JSON.parse(content.responseText).message;
        if (content) {
          return Alerts.danger(content);
        }
      } catch (err) {
        Log(err);
      }
    }
    content = content && ((content.status === 200) && '解析数据出错' || content.responseText || content.statusText || content.message) || '网络不给力，请稍后再试';
  }
  Alerts.danger(content || '网络不给力，请稍后再试', timeout);
};

Alerts.dev = (content, timeout) => {
  Alerts.warn(`*** ${content} ***`, timeout);
};

Route.onBeforeChange.add(() => {
  Alerts.hide();
});

export default Alerts;
