import http from 'http';
import assert from 'assert';

import server from '../lib/index.js';

describe('Example Node Server', () => {
  it('Return 200 http code', done => {
    http.get('http://127.0.0.1:3000', res => {
      assert.equal(200, res.statusCode);
      server.close();
      done();
    });
  });
});