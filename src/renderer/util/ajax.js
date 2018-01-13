import $ from 'jquery';
import UI from './ui';
import Alerts from './alerts';
import {appendQueryString, getAutoIncreasedId} from './misc';

const PROXY_PATH = '/ajax-proxy.html';
const ORIGIN = location.origin || `${location.protocol}//${location.host}`;

let postQueue = {};
let proxyQueue = [];
let proxyFrameMap = {};
let loadingCount = 0;

let Ajax = {};

function isInAppUrl(url) {
  return url.replace(/^https?:/, '').indexOf(G.API_BASE.replace(/^https?:/, '')) === 0;
}

function url2obj(str) {
  if (typeof str != 'string') {
    return str;
  }
  let m = str.match(/([^:]*:)?(?:\/\/)?([^\/:]+)?(:)?(\d+)?([^?#]+)(\?[^?#]*)?(#[^#]*)?/);
  m = m || [];
  let uri = {
    href: str,
    protocol: m[1] || 'http:',
    host: (m[2] || '') + (m[3] || '') + (m[4] || ''),
    hostname: m[2] || '',
    port: m[4] || '',
    pathname: m[5] || '',
    search: m[6] || '',
    hash: m[7] || ''
  };
  uri.origin = uri.protocol + '//' + uri.host;
  return uri;
}

function proxyCall(opt, resolve, reject, getXhr) {
  let xhr, pro;
  let proxyFrame = proxyFrameMap[opt.urlObj.origin];
  if (getXhr) {
    try {
      xhr = new proxyFrame.contentWindow.XMLHttpRequest();
    } catch (e) {
      xhr = new proxyFrame.contentWindow.ActiveXObject('MSXML2.XMLHTTP');
    }
    resolve(xhr);
    return;
  }
  if (opt.type == 'GET') {
    pro = proxyFrame.contentWindow.require('app-util').Ajax.get(opt);
  } else {
    pro = proxyFrame.contentWindow.require('app-util').Ajax.post(opt);
  }
  pro.then(res => resolve(res))
    .catch(err => reject(err))
    .finally(() => opt.loading === false || UI.hideLoading());
}

function proxy(opt, getXhr) {
  let proxyFrame = proxyFrameMap[opt.urlObj.origin];
  if (!proxyFrame) {
    proxyFrame = document.createElement('iframe');
    proxyFrame.style.display = 'none';
    proxyFrame.src = opt.urlObj.origin + PROXY_PATH;
    $(proxyFrame).on('load', function onload(evt) {
      if (proxyFrame._loaded) {
        while (proxyQueue.length) {
          let {opt, resolve, reject, getXhr} = proxyQueue.shift();
          proxyCall(opt, resolve, reject, getXhr);
        }
      } else {
        $(proxyFrame).off('load', onload).remove();
        proxyFrame = proxyFrameMap[opt.urlObj.origin] = null;
        while (proxyQueue.length) {
          let {reject} = proxyQueue.shift();
          reject(new Error(`Failed to load proxy ${opt.urlObj.origin + PROXY_PATH}!`));
        }
      }
    });
    proxyFrame = proxyFrameMap[opt.urlObj.origin] = document.body.appendChild(proxyFrame);
  }
  let resolve, reject;
  let pro = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  if (proxyFrame._loaded) {
    proxyCall(opt, resolve, reject, getXhr);
  } else {
    proxyQueue.push({opt, resolve, reject, getXhr});
  }
  return pro;
}

Ajax.getLoadingCount = function () {
  return loadingCount;
};

Ajax.normalizeUrl = function (url) {
  if (url.indexOf('//') === 0) {
    url = location.protocol + url;
  } else if (!(/^https?:/).test(url)) {
    url = `${G.API_BASE}/${url.replace(/^\/+/, '')}`;
  }
  return url;
};

Ajax.dealCommonError = function (res) {
  if (res.status === 401) {
    // TODO
  }
};

Ajax.getXhr = function (url) {
  url = Ajax.normalizeUrl(url);
  let urlObj = url2obj(url);
  if (!$.support.cors && ORIGIN != urlObj.origin) {
    return proxy({
      url: url,
      urlObj: urlObj
    }, true);
  }
  let xhr;
  try {
    xhr = new window.XMLHttpRequest();
  } catch (e) {
    xhr = new window.ActiveXObject('MSXML2.XMLHTTP');
  }
  let token = G.USER_INFO.token;
  let headers = {};
  if (token && isInAppUrl(url)) {
    headers['authorization'] = 'JWT ' + token;
  }
  return Promise.resolve({xhr, headers});
};

Ajax.get = function (opt) {
  opt = opt || {};
  opt.type = opt._method = 'GET';
  opt.url = Ajax.normalizeUrl(opt.url);
  opt.urlObj = opt.urlObj || url2obj(opt.url);
  let isInApp = isInAppUrl(opt.url);
  if (isInApp) {
    opt.dataType = 'json'; // only support json
  }
  if (!$.support.cors && ORIGIN != opt.urlObj.origin && opt.dataType == 'json') {
    return proxy(opt);
  } else {
    opt.dataType = opt.dataType || (ORIGIN == opt.urlObj.origin ? 'json' : 'jsonp');
    if (opt.dataType == 'jsonp') {
      opt.scriptCharset = opt.scriptCharset || opt.charset || 'UTF-8';
      if (!opt.jsonpCallback) {
        opt.url.split('/').pop().replace(/^[a-zA-Z_]\w*/, function (m) {
          opt.jsonpCallback = '_' + m + '_' + getAutoIncreasedId(); // use unique postfix to avoid concurrency issue
        });
        opt.jsonpCallback = opt.jsonpCallback || 'jsonpCallback';
      }
      opt.jsonp = opt.jsonp || 'callback';
    } else if (ORIGIN != opt.urlObj.origin) {
      opt.xhrFields = {
        withCredentials: true
      };
    }
  }
  opt.url = appendQueryString(opt.url, opt.data);
  delete opt.data;
  if (G.HOST_INFO && G.HOST_INFO.short) {
    opt.url = appendQueryString(opt.url, {short: G.HOST_INFO.short});
  }
  opt.headers = opt.headers || {};
  let token = G.USER_INFO.token;
  if (token && isInApp) {
    opt.headers['authorization'] = 'JWT ' + token;
  }
  let pro = Promise.resolve($.ajax(opt));
  loadingCount++;
  opt.loading === false || UI.showLoading();
  pro.finally(() => {
    loadingCount--;
    opt.loading === false || UI.hideLoading();
  }).catch(Ajax.dealCommonError);
  return pro;
};

Ajax.post = function (opt) {
  opt = opt || {};
  opt.type = opt._method = opt._method || 'POST';
  opt.dataType = 'json';
  opt.url = Ajax.normalizeUrl(opt.url);
  opt.urlObj = opt.urlObj || url2obj(opt.url);
  if (!$.support.cors && ORIGIN != opt.urlObj.origin) {
    return proxy(opt);
  }
  let isInApp = isInAppUrl(opt.url);
  let data = opt.data || {};
  opt.charset = opt.charset || 'UTF-8';
  if (!opt.notJsonParamData) {
    if (isInApp) {
      opt.contentType = 'application/vnd.api+json; charset=' + opt.charset;
    } else {
      opt.contentType = 'application/json; charset=' + opt.charset;
    }
    opt.data = typeof data == 'string' ? data : JSON.stringify(data);
  }
  if (ORIGIN != opt.urlObj.origin) {
    opt.xhrFields = {
      withCredentials: true
    };
  }
  opt.url = appendQueryString(opt.url, opt.queryString);
  if (G.HOST_INFO && G.HOST_INFO.short) {
    opt.url = appendQueryString(opt.url, {short: G.HOST_INFO.short});
  }
  let queueName = opt.queueName == null ? opt.url : opt.queueName;
  if (queueName) {
    if (postQueue[queueName]) {
      return;
    }
    postQueue[queueName] = 1;
  }
  opt.headers = opt.headers || {};
  let token = G.USER_INFO.token;
  if (token && isInApp) {
    opt.headers['authorization'] = 'JWT ' + token;
  }
  let pro = Promise.resolve($.ajax(opt));
  loadingCount++;
  opt.loading === false || UI.showLoading();
  pro.finally(() => {
    loadingCount--;
    if (queueName) {
      delete postQueue[queueName];
    }
    opt.loading === false || UI.hideLoading();
  }).catch(Ajax.dealCommonError);
  return pro;
};

Ajax.put = function (opt) {
  opt = opt || {};
  opt._method = 'PUT';
  return Ajax.post(opt);
};

Ajax.patch = function (opt) {
  opt = opt || {};
  opt._method = 'PATCH';
  return Ajax.post(opt);
};

Ajax.del = Ajax.delete = function (opt) {
  opt = opt || {};
  opt._method = 'DELETE';
  return Ajax.post(opt);
};

export default Ajax;
