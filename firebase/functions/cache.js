const mcache = require("memory-cache");

module.exports = (duration = 5) => (req, res, next) => {
	let key = `_express_` + req.originalUrl || req.url;

	let cachedBody = mcache.get(key);

	if (cachedBody) {
		return res.json({ ...JSON.parse(cachedBody) });
	} else {
		res.sendResponse = res.send;
		res.send = (body) => {
			mcache.put(key, body, duration * 60000);
			res.sendResponse(body);
		};
		next();
	}
};
