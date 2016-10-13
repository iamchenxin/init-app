// @flow
const { testPackageName } = require('../cmdtools.js');
declare function expect(value: any): any ;
declare var describe: Function ;
declare var it: Function ;
declare var xit: Function ;

describe('cmdtools.js', () => {
  function nameMustbe(packageName: string, stat: string): void {
    expect(testPackageName(packageName)).toEqual(stat);
  }
  it('testPackageName', () => {
    nameMustbe('package', 'npm');
    nameMustbe('package1', 'npm');
    nameMustbe('_package', 'npm');
    nameMustbe('relay-react', 'npm'); // *-*
    nameMustbe('1package', 'unknown'); // do not allow start with number
    nameMustbe('package@0.0.1', 'npm');
    nameMustbe('package@beta0.0.1', 'npm');
    nameMustbe('package/beta0.0.1', 'unknown');
    nameMustbe('package/', 'unknown'); // should not install from this kind dir
    nameMustbe('.a', 'local');
    nameMustbe('/dir/package', 'local');
    nameMustbe('~/dir/package', 'local');
    nameMustbe('~/dir/package.ss-s_ss', 'local');
    nameMustbe('./dir/package', 'local');
  });
  /*
  xit('tmptest', () => {
    const local_exp = /^[\.\/~].+/;
    function ts(v: string) {
      const mt = v.match(local_exp);
      console.dir(mt);
      expect(mt != null).toEqual(true);
    }
    ts('~/a/');
  });
  */
});
