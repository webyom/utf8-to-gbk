import $ from 'jquery';
import moment from 'moment';

export function safeAccess(obj, props, defaultValue, canBeNull) {
  if (!obj) {
    return defaultValue;
  }
  props = props.replace(/\[(\w+)\]/g, '.$1');
  props = props.replace(/^\./, '');
  props = props.split('.');
  for (let i = 0, l = props.length; i < l; i++) {
    let k = props[i];
    if (obj && k in obj && (obj[k] !== null || canBeNull)) {
      obj = obj[k];
    } else {
      return defaultValue;
    }
  }
  return obj;
}

export function getFirstDefined(obj, keys, evaluator) {
  let argLens = arguments.length;
  let values = null;
  if (argLens === 1) {
    values = obj;
    obj = null;
  } else if (argLens === 2 && typeof keys == 'function') {
    evaluator = keys;
    values = obj;
    obj = null;
    keys = null;
  }
  if (Array.isArray(values)) {
    for (let val of values) {
      if (evaluator) {
        if (evaluator(val)) {
          return val;
        }
      } else if (typeof val != 'undefined') {
        return val;
      }
    }
  } else if (obj && Array.isArray(keys)) {
    for (let key of keys) {
      let val = safeAccess(obj, key);
      if (evaluator) {
        if (evaluator(val)) {
          return val;
        }
      } else if (typeof val != 'undefined') {
        return val;
      }
    }
  }
}

export function regexpEscape(str) {
  if ('escape' in RegExp) {
    return RegExp.escape(str);
  } else {
    return str.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
  }
}

export function wheelScrollHandler(evt) {
  evt.preventDefault();
  let e = evt.originalEvent || evt;
  let step = -30;
  let x = 0;
  let y = 0;
  let top, left;
  let target = evt.currentTarget;
  if (!isNaN(e.wheelDeltaX)) {
    x = e.wheelDeltaX / 120;
  } else if (!isNaN(e.deltaX)) {
    x = e.deltaX / 120 * -3;
  }
  if (!isNaN(e.wheelDeltaY)) {
    y = e.wheelDeltaY / 120;
  } else if (!isNaN(e.deltaY)) {
    y = e.deltaY / 120 * -3;
  } else if (!isNaN(e.wheelDelta)) {
    y = e.wheelDelta / 120;
  }
  x = x * step;
  y = y * step;
  if (x > 0 && x < 1) {
    x = 1;
  } else if (x < 0 && x > -1) {
    x = -1;
  }
  if (y > 0 && y < 1) {
    y = 1;
  } else if (y < 0 && y > -1) {
    y = -1;
  }
  if (Math.abs(x) > Math.abs(y)) { // scroll x
    left = target.scrollLeft + x;
    target.scrollLeft = left;
  } else if (Math.abs(y) > 0) { // scroll y
    top = target.scrollTop + y;
    target.scrollTop = top;
  }
}

/**
 * Merge sort (http://en.wikipedia.org/wiki/Merge_sort)
 * https://github.com/mout/mout
 */
export function mergeSort(arr, compareFn) {
  if (arr == null) {
    return [];
  } else if (arr.length < 2) {
    return arr;
  }
  if (compareFn == null) {
    compareFn = function defaultCompare(a, b) {
      return a < b ? -1 : (a > b ? 1 : 0);
    };
  }
  let mid = ~~(arr.length / 2);
  let left = mergeSort(arr.slice(0, mid), compareFn);
  let right = mergeSort(arr.slice(mid, arr.length), compareFn);
  let result = [];
  while (left.length && right.length) {
    if (compareFn(left[0], right[0]) <= 0) {
      // if 0 it should preserve same order (stable)
      result.push(left.shift());
    } else {
      result.push(right.shift());
    }
  }
  if (left.length) {
    result.push.apply(result, left);
  }
  if (right.length) {
    result.push.apply(result, right);
  }
  return result;
}

export function getCurrentLocationPath() {
  return location.hash.split('?')[0].slice(1);
}

export function getCurrentLocationSearch() {
  let res = (location.hash.split('?')[1] || '').replace(/&?_k=\w{5,}$/, '');
  return res && ('?' + res);
}

export function getCurrentLocation() {
  return getCurrentLocationPath() + getCurrentLocationSearch();
}

export function getSearchParams(searchStr) {
  let res = {};
  if (typeof searchStr == 'undefined') {
    searchStr = getCurrentLocationSearch();
  }
  if (!searchStr) {
    return res;
  }
  let pairs = searchStr.replace(/^\?/, '').split('&');
  for (let pair of pairs) {
    pair = pair.split('=');
    if (pair[0]) {
      res[pair[0]] = decodeURIComponent(pair[1]);
    }
  }
  return res;
}

export function appendQueryString(url, param, isHashMode) {
  if (!param) {
    param = '';
  } else if (typeof param == 'object') {
    let tmp = {};
    Object.keys(param).forEach(key => {
      let val = param[key];
      let type = typeof val;
      if (val === null) {
        tmp[key] = 'null';
      } else if (type != 'undefined' && type != 'object') {
        tmp[key] = val;
      }
    });
    param = $.param(tmp, true);
  } else if (typeof param == 'string') {
    param = param.replace(/^[&?]/, '');
  } else {
    param = '';
  }
  if (!param) {
    return url;
  }
  if (isHashMode) {
    if (url.indexOf('#') == -1) {
      url += '#' + param;
    } else {
      url += '&' + param;
    }
  } else if (url.indexOf('#') == -1) {
    if (url.indexOf('?') == -1) {
      url += '?' + param;
    } else {
      url += '&' + param;
    }
  } else {
    let tmp = url.split('#');
    if (tmp[0].indexOf('?') == -1) {
      url = tmp[0] + '?' + param + '#' + (tmp[1] || '');
    } else {
      url = tmp[0] + '&' + param + '#' + (tmp[1] || '');
    }
  }
  return url;
}

export function formatDecimal(decimal, format, opt = {}) {
  function formatInteger(integer) {
    let res = [], count = 0;
    integer = integer.split('');
    while (integer.length) {
      if (count && !(count % 3)) {
        res.unshift(',');
      }
      res.unshift(integer.pop());
      count++;
    }
    return res.join('');
  }
  let res = '';
  let decimalMatchRes, formatMatchRes, fLen, dLen, tmp;
  decimal += '';
  if (!decimal) {
    return decimal;
  }
  decimalMatchRes = decimal.match(/^(-?)(\w*)(.?)(\w*)/);
  formatMatchRes = format.match(/^(-?)(\w*)(.?)(\w*)/);
  if (formatMatchRes[2]) {
    res += decimalMatchRes[2];
  }
  if (formatMatchRes[3] && formatMatchRes[4]) {
    res += formatMatchRes[3];
  } else {
    if (opt.round) {
      res = Math.round(decimal) + '';
    } else if (opt.ceil) {
      res = Math.ceil(decimal) + '';
    }
    if (opt.formatInteger !== false) {
      res = formatInteger(res);
    }
    return res;
  }
  fLen = Math.min(formatMatchRes[4].length, 4);
  dLen = decimalMatchRes[4].length;
  res += decimalMatchRes[4].slice(0, fLen);
  if (fLen > dLen) {
    res += new Array(fLen - dLen + 1).join('0');
  }
  if (dLen > fLen && (opt.round && decimalMatchRes[4].charAt(fLen) >= 5 || opt.ceil && decimalMatchRes[4].charAt(fLen) > 0)) {
    return formatDecimal((res * Math.pow(10, fLen) + 1) / Math.pow(10, fLen), format);
  }
  res = res.split('.');
  if (opt.formatInteger !== false) {
    res[0] = formatInteger(res[0]);
  }
  res = res.join('.');
  if (decimalMatchRes[1] && res != '0') {
    res = decimalMatchRes[1] + res;
  }
  return res;
}

export function formatSplitString(str, gap = 1, sep = ' ', tail) {
  if (!str) {
    return str;
  }
  let l = str.length - 1;
  return str.split('').map(function (c, i) {
    if (i % gap == gap - 1 && (tail || i != l)) {
      return c + sep;
    } else {
      return c;
    }
  }).join('');
}

export function formatDatetime(date, format, fallback) {
  let res = moment(date).format(format);
  if (res == 'Invalid date') {
    res = fallback || ('' + date);
  }
  return res;
}

export function submitFormPage(url, data, target = '_blank') {
  let form = $('<form target="' + target + '" action="' + url + '" method="post"></form>').appendTo(document.body);
  for (let key of Object.keys(data)) {
    form.append($('<input type="hidden" name="' + key + '" value="' + data[key] + '" />'));
  }
  form[0].submit();
  setTimeout(function () {
    form.remove();
  }, 100);
}

let autoIncreasedId = 0;
export function getAutoIncreasedId() {
  return autoIncreasedId++;
}
