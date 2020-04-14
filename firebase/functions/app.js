const createError = require("http-errors");
const express = require("express");
const functions = require("firebase-functions");
const logger = require("morgan");
const expressIp = require("express-ip");
const cors = require("cors");
const cache = require("./cache");

const app = express();

// view engine setup
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressIp().getIpInfoMiddleware);

app.get("/userIp", cache(), (req, res) => {
	const ipInfo = req.ipInfo;

	// res.set("Cache-Control", "public, max-age=3600, s-maxage=3600");

	res.status(200).json({ ipInfo });
});

app.get("/key", cache(), (req, res) => {
	// res.set("Cache-Control", "public, max-age=3600, s-maxage=3600");

	res.status(200).json({ ...functions.config().moviedb });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	res.status(err.status || 500).json({
		message: "Opps! something happened",
		errorStatus: err.status || 500,
		errorStack: err,
	});
});

module.exports = app;
