import express from 'express';
import bodyParser from 'body-parser';
/**
 * @class ParrotServer
 * */
export default class ParrotServer {
	/**
	 * @param {number} port Port to start the http server. (Optional)
	 * */
	constructor (port) {
		const app = this.app = express();
		this.port = port || null;
		app.use(bodyParser.urlencoded({extended: false}));
		app.use(bodyParser.text());
		app.use(bodyParser.json({strict: true}));
		app.all('*', function (req, res) {
			const output = {
				method: req.method,
				host: req.hostname,
				path: req.path,
				body: req.body,
				query: req.query,
				headers: req.headers
			};
			res.json(output);
		});
	}

	/**
	 * Starts the http server.
	 * @param  {function} [cb]
	 */
	start (cb) {
		this.server = this.app.listen(this.port, () => {
			this.port = this.server.address().port;
			if (typeof cb === 'function') {
				cb();
			}
		});
	}

	/**
	 * Stops the http server.
	 * @param  {function} [cb]
	 */
	stop (cb) {
		this.server.close(cb);
	}
}
