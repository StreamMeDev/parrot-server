/* global describe, it, beforeEach, afterEach */
import assert from 'assert';
import SimpleTestServer from '../';
import url from 'url';
import request from 'request';

describe('module functionality', function () {
	it('should support a simple require statement', function () {
		const Sts = require('../');
		assert.ok(new Sts(), 'initialize the server');
	});
});

describe('SimpleTestServer', function () {
	let server;
	beforeEach(function (done) {
		server = new SimpleTestServer();
		server.start(done);
	});
	afterEach(function (done) {
		server.stop(done);
	});
	it('should register the port', function () {
		assert(typeof server.port === 'number', 'server.port is a number');
	});
	it('should make a GET request', function (done) {
		let httpOpts = {
			method: 'GET',
			uri: url.format({
				protocol: 'http',
				hostname: 'localhost',
				pathname: 'a/path',
				port: server.port,
				query: {q: 'findme'}
			})
		};
		request(httpOpts, function (err, resp, body) {
			assert.ifError(err);
			assert.ok(resp.statusCode === 200, 'response is a 200');
			assert.ok(body = JSON.parse(body), 'response body is JSON');
			assert.strictEqual(body.method, 'GET', 'has the correct method');
			assert.strictEqual(body.path, '/a/path', 'has the correct pathname');
			assert.ok(body.query.q, 'has the correct query parameter');
			assert.strictEqual(body.query.q, 'findme', 'has the correct query parameter value');
			done();
		});
	});
	it('should make a POST request with plain text', function (done) {
		const reqBodyText = 'text in the body';
		const path = '/a/path';
		const queryParam = 'q';
		const queryValue = 'findme';
		const httpOpts = {
			method: 'POST',
			uri: url.format({
				protocol: 'http',
				hostname: 'localhost',
				pathname: path,
				port: server.port,
				query: {
					[queryParam]: queryValue
				}
			}),
			body: reqBodyText,
			headers: {
				'Content-Type': 'text/plain',
				'Content-Length': Buffer.byteLength(reqBodyText)
			}
		};
		request(httpOpts, function (err, resp, body) {
			assert.ifError(err);
			assert.ok(resp.statusCode === 200, 'response is a 200');
			assert.ok(body = JSON.parse(body), 'response body is JSON');
			assert.strictEqual(body.method, 'POST', 'has the correct method');
			assert.strictEqual(body.path, '/a/path', 'has the correct pathname');
			assert.ok(body.query.q, 'has the correct query parameter');
			assert.strictEqual(body.query.q, 'findme', 'has the correct query parameter value');
			assert.ok(body.body, 'has a request body');
			assert.strictEqual(body.body, reqBodyText, 'has the correct request body, has:' + JSON.stringify(body));
			done();
		});
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
			uri: url.format({
				protocol: 'http',
				hostname: 'localhost',
				pathname: path,
				port: server.port,
				query: {
					[queryParam]: queryValue
				}
			}),
			json: true,
			body: reqBody
		};
		request(httpOpts, function (err, resp, body) {
			assert.ifError(err);
			assert.strictEqual(resp.statusCode, 200, '200 status code');
			assert.ok(JSON.stringify(body), 'response body is JSON');
			assert.strictEqual(body.method, 'POST', 'has the correct method');
			assert.strictEqual(body.path, '/a/path', 'has the correct pathname');
			assert.ok(body.query.q, 'has the correct query parameter');
			assert.strictEqual(body.query.q, 'findme', 'has the correct query parameter value');
			assert.ok(body.body, 'has a request body');
			assert.ok(JSON.stringify(body.body), 'return request body is valid JSON');
			assert.strictEqual(body.body.test, reqBody.test, 'has the correct request body, has:' + body.body);
			done();
		});
	});
});
