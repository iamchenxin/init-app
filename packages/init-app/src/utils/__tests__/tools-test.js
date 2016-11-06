// @flow
declare var jest: Function;
declare var describe: Function;
declare var it: Function;
declare var expect: Function;

import { mustbe, mustNot, format } from '../tools.js';
import { RepoFileError } from '../error.js';

describe('Test tools.js', () => {
  describe('mustbe', () => {
    it('has a default error msg', () => {
      expect( () => {
        mustbe(false, 2);
      }).toThrowError(Error,
      `value(${format(2)}) shoulde be (${format(false)})`);
    });

    it('will wrap (errMsg: string) to an Error instance', () => {
      expect( () => {
        mustbe(false, 2, 'should failed');
      }).toThrowError(new Error('should failed'));
    });

    it('will throw the passed in Error instance', () => {
      expect( () => {
        mustbe(false, 2, new RepoFileError('custom failed'));
      }).toThrowError( new RepoFileError('custom failed') );
    });
  });

  describe('mustNot', () => {
    it('has a default error msg', () => {
      expect( () => {
        mustNot(2, 2);
      }).toThrowError(Error,
      `value(${format(2)}) most not be (${format(2)})`);
    });

    it('will wrap (errMsg: string) to an Error instance', () => {
      expect( () => {
        mustNot(2, 2, 'should fail');
      }).toThrowError(new Error('should fail'));
    });

    it('will throw the passed in Error instance', () => {
      expect( () => {
        mustNot(2, 2, new RepoFileError('custom failed'));
      }).toThrowError(new RepoFileError('custom failed') );
    });
  });
});
