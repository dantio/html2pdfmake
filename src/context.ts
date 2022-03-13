import {Config, CssStyles} from './types.js';

export class Context {
  public images: Record<string, string> = {};

  constructor(public readonly config: Config,
              public readonly styles: CssStyles) {
  }
}