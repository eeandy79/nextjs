const { createServer } = require('https')
const { parse } = require('url')
const next = require('next')
const fs = require("fs")

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const httpsOptions = {
	  key: fs.readFileSync("./key.pem"),
	  cert: fs.readFileSync("./cert.pem"),
};

app.prepare().then(() => {
	createServer(httpsOptions, (req, res) => {
		const parsedUrl = parse(req.url, true)
		const { pathname, query } = parsedUrl

		if (pathname === '/a') {
			app.render(req, res, '/a', query)
		} else if (pathname === '/b') {
			app.render(req, res, '/b', query)
		} else {
			handle(req, res, parsedUrl)
		}
	}).listen(8000, '0.0.0.0', (err) => {
		if (err) throw err
		console.log('> Ready on http://localhost:3000')
	})
})
