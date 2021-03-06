import {defaultConfig} from './default-config.js';
import {Config} from './types/config.types';
import {CssStyles} from './types/global.types.js';
import {merge} from './utils/merge.js';

export class Context {
  public images: Record<string, string> = {};
  private _styles: CssStyles | null = null;

  private pageStyles: CssStyles = {};

  constructor(public readonly config: Config) {
  }

  get styles(): CssStyles {
    if (this._styles) {
      return this._styles;
    }

    this._styles = merge({}, this.config.globalStyles || {}, this.pageStyles, this.config.styles) as CssStyles;

    return this._styles;
  }

  public setPageStyles(styles: CssStyles) {
    this.pageStyles = styles;
  }

  get fonts() {
    return this.config.fonts;
  }
}

export const createContext = (_config: Partial<Config> = defaultConfig()) => {
  const config = {
    ...defaultConfig(),
    ..._config
  };

  return new Context(config);
};