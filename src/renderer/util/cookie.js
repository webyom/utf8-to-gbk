import {regexpEscape} from './misc';

const DOMAIN = document.domain;

let Cookie = {
  set(name, value, domain, path, hour) {
    let expire;
    if (hour) {
      expire = new Date();
      expire.setTime(expire.getTime() + 3600000 * hour);
    }
    document.cookie = (name + '=' + value + '; ') + (expire ? ('expires=' + expire.toGMTString() + '; ') : '') + ('path=' + (path || '/') + '; ') + ('domain=' + (domain || DOMAIN) + ';');
  },

  get(name) {
    let r = new RegExp('(?:^|;\\s*)' + regexpEscape(name) + '=([^;]*)'), m = document.cookie.match(r);
    return m && m[1] || '';
  },

  del(name, domain, path) {
    document.cookie = name + '=; expires=Mon, 26 Jul 1997 05:00:00 GMT; ' + ('path=' + (path || '/') + '; ') + ('domain=' + (domain || DOMAIN) + ';');
  }
};

export default Cookie;
