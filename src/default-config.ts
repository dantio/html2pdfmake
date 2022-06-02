import {globalStyles} from './global-styles.js';
import {Config} from './types.js';

export const defaultConfig = (): Config => ({
  globalStyles: globalStyles(),
  styles: {},
  collapseMargin: true,
  collapseWhitespace: true,
  render: (el) => el,
  document: () => window.document,
  parseCss: () => ({})
});