/* global describe, it */
import assert from 'assert';
import SimpleTestServer from '../';
import http from 'http';

describe('SimpleTestServer', function () {
	let server;
	it('should should load the SimpleTestServer class', function () {
		assert.ok(SimpleTestServer, 'SimpleTestServer class loaded');
		server = new SimpleTestServer();
		assert.ok(server, 'server initiated');
	});
	it('should should start the server', function (done) {
		server.start(done);
	});
	it('should register the port', function () {
		assert(typeof server.port === 'number', 'server.port is a number');
	});
	it('should make a GET request', function (done) {
		const httpOpts = {
			method: 'GET',
			port: server.port,
			path: '/a/path?q=findme'
		};
		const req = http.request(httpOpts, function (res) {
			let body = '';
			res.on('data', function (chunk) {
				body += chunk;
			});
			res.on('end', function () {
				try {
					assert.ok(body = JSON.parse(body), 'response body is JSON');
					assert.strictEqual(body.method, 'GET', 'has the correct method');
					assert.strictEqual(body.path, '/a/path', 'has the correct pathname');
					assert.ok(body.query.q, 'has the correct query parameter');
					assert.strictEqual(body.query.q, 'findme', 'has the correct query parameter value');
					done();
				} catch (e) {
					assert.ifError(e);
					done();
				}
			});
		});
		req.on('err', function (e) {
			assert.ifError(e, 'error sending the request');
			done();
		});
		req.end();
	});
	it('should make a POST request with plain text', function (done) {
		const reqBodyText = 'text in the body';
		const path = '/a/path';
		const queryParam = 'q';
		const queryValue = 'findme';
		const httpOpts = {
			method: 'POST',
			port: server.port,
			path: `${path}?${queryParam}=${queryValue}`,
			headers: {
				'Content-Type': 'text/plain',
				'Content-Length': Buffer.byteLength(reqBodyText)
			}
		};
		const req = http.request(httpOpts, function (res) {
			let body = '';
			res.on('data', function (chunk) {
				body += chunk;
			});
			res.on('end', function () {
				try {
					assert.strictEqual(res.statusCode, 200, '200 status code');
					assert.ok(body = JSON.parse(body), 'response body is JSON');
					assert.strictEqual(body.method, 'POST', 'has the correct method');
					assert.strictEqual(body.path, '/a/path', 'has the correct pathname');
					assert.ok(body.query.q, 'has the correct query parameter');
					assert.strictEqual(body.query.q, 'findme', 'has the correct query parameter value');
					assert.ok(body.body, 'has a request body');
					assert.strictEqual(body.body, reqBodyText, 'has the correct request body, has:' + JSON.stringify(body));
					done();
				} catch (e) {
					assert.ifError(e);
					done();
				}
			});
		});
		req.on('err', function (e) {
			assert.ifError(e, 'error sending the request');
			done();
		});
		req.write(reqBodyText);
		req.end();
	});
	it('should make a POST request with JSON', function (done) {
		const reqBody = {
			test: 'prap'
		};
		const path = '/a/path';
		const queryParam = 'q';
		const queryValue = 'findme';
		const httpOpts = {
			method: 'POST',
			port: server.port,
			path: `${path}?${queryParam}=${queryValue}`,
			headers: {
				'Content-Type': 'application/json'
			}
		};
		const req = http.request(httpOpts, function (res) {
			let body = '';
			res.on('data', function (chunk) {
				body += chunk;
			});
			res.on('end', function () {
				try {
					assert.strictEqual(res.statusCode, 200, '200 status code');
					assert.ok(body = JSON.parse(body), 'response body is JSON');
					assert.strictEqual(body.method, 'POST', 'has the correct method');
					assert.strictEqual(body.path, '/a/path', 'has the correct pathname');
					assert.ok(body.query.q, 'has the correct query parameter');
					assert.strictEqual(body.query.q, 'findme', 'has the correct query parameter value');
					assert.ok(body.body, 'has a request body');
					assert.ok(JSON.stringify(body.body), 'return request body is valid JSON');
					assert.strictEqual(body.body.test, reqBody.test, 'has the correct request body, has:' + body.body);
					done();
				} catch (e) {
					assert.ifError(e);
					done();
				}
			});
		});
		req.on('err', function (e) {
			assert.ifError(e, 'error sending the request');
			done();
		});
		req.write(JSON.stringify(reqBody));
		req.end();
	});
	it('should stop the server', function (done) {
		server.stop(done);
	});
});
