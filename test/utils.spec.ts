import {expect} from 'chai';
import {merge} from '../src/utils/merge.js';

describe('Utils', () => {
  describe('merge', () => {
    it('merge deep', () => {
      const objA = {a: 'a', b: {b: 'b'}};
      merge(objA, {b: {c: 'c'}});
      expect(objA).to.eql({a: 'a', b: {b: 'b', c: 'c'}});
    });
  });
});