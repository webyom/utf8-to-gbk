import {BaseMod} from 'skateboardjs';
import Component from './component';
import {moduleClassNames} from './style.css';

export class Mod extends BaseMod {
  ReactComponent = Component;
  className = moduleClassNames();
}
