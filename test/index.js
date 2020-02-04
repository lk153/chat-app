import http from 'http';
import assert from 'assert';

import server from '../lib/index.js';

describe('Example Node Server', () => {
    it('Return 200 http code', done => {
        http.get('https://chat-app-lupin.herokuapp.com', res => {
            assert.equal(200, res.statusCode);
            server.close();
            done();
        });
    });
});