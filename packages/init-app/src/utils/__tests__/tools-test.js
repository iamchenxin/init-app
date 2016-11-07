// @flow
declare var jest: Function;
declare var describe: Function;
declare var it: Function;
declare var expect: Function;

jest.mock('../fs.js');
jest.mock('../../../config/base.js');
const fs = require('../fs.js');
const base = require('../../../config/base.js');
const path = require('path');
import { mustbe, mustNot, format } from '../tools.js';
import { RepoFileError } from '../error.js';

const testDir = base.test_mock.base.testDir;
const thisTestDir = path.resolve(testDir, 'tools-test');

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
