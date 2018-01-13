import $ from 'jquery';

let UI = {};

let loadingCount = 0;
let loadingTimeout = null;

let initLoading = function () {
  let el = $('#app-loading-bar');
  if (!el.length) {
    $('<div id="app-loading-bar">loading...</div>').appendTo(document.body);
  }
  initLoading = () => 0;
};

let bootstrapPromise = new Promise(function (resolve, reject) {
  UI.resolveBootstrap = resolve;
  UI.rejectBootstrap = reject;
});

UI.waitForBootstrap = function () {
  return bootstrapPromise;
};

UI.showLoading = function () {
  loadingCount++;
  initLoading();
  $('#app-loading-bar').addClass('loading');
  clearTimeout(loadingTimeout);
  loadingTimeout = setTimeout(() => {
    if (loadingCount) {
      loadingCount = 0;
      UI.hideLoading();
    }
  }, 30 * 1000);
};

UI.hideLoading = function () {
  loadingCount > 0 && loadingCount--;
  if (!loadingCount) {
    $('#app-loading-bar').removeClass('loading');
  }
};

export default UI;
