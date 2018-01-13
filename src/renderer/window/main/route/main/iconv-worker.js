import 'babel-polyfill';
import '../../../../../vendor/babel/external-helpers';
import path from 'path';
import iconv from 'iconv-lite';
import Promise from 'bluebird';

const fs = Promise.promisifyAll(require('fs'));

onmessage = async function (evt) {
  postMessage({type: 'start'});
  try {
    let filePath = evt.data;
    let res = await fs.readFileAsync(filePath);
    let buf = iconv.decode(res, 'utf-8');
    buf = iconv.encode(buf, 'gbk');
    let info = path.parse(filePath);
    let newPath = path.join(info.dir, info.name + '.gbk' + info.ext);
    await fs.writeFileAsync(newPath, buf);
    postMessage({type: 'finish', newPath});
  } catch (err) {
    postMessage({type: 'finish', err});
  }
};
