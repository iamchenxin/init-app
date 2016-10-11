const { format} = require('../log.js');


describe('log.js', () => {
  it('format', () => {
    const v = {
      a: 1,
      b: {v: 'hehe', n: 22},
    };
    expect(format(v)).toEqual("{ a: 1, b: { v: 'hehe', n: 22 } }");
  });
});
