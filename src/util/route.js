import Signal from 'signals';
import Skateboard from 'skateboardjs';

let Route = {
  push(path) {
    Skateboard.history.push(path);
  },

  onBeforeChange: new Signal()
};

export default Route;
