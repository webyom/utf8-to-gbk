/* eslint-disable no-console */

let Log = function (...args) {
  G.ENV == 'production' || console.log(...args);
};

for (let type of ['log', 'error', 'warn', 'info']) {
  Log[type] = (...args) => {
    G.ENV == 'production' || (console[type] || console.log).apply(console, args);
  };
}

window.Log = Log;

export default Log;

/* eslint-enable no-console */
