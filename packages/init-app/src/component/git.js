/* @flow
 *
*/

function ts(v: string) {
  const a = ` vvvv= '${v}',(${v.length})`;
  const b = a.length;
  console.log(a);
}
console.log('aaaa');
ts('fffff');