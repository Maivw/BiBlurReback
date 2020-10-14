const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const { ValidationError } = require("sequelize");
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const commentRouter = require("./routes/comment");
const likeRouter = require("./routes/like");
const followRouter = require("./routes/follow");

const { environment } = require("./config");

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(cors({ origin: "*" }));
// allows app to read file from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);
app.use("/likes", likeRouter);
app.use("/follow", followRouter);

// Catch unhandled requests and forward to error handler.
app.use((req, res, next) => {
	const err = new Error("The requested resource couldn't be found.");
	err.errors = ["The requested resource couldn't be found."];
	err.status = 404;
	next(err);
});

// Process sequelize errors
app.use((err, req, res, next) => {
	// check if error is a Sequelize error:
	if (err instanceof ValidationError) {
		err.errors = err.errors.map((e) => e.message);
		err.title = "Sequelize Error";
	}
	next(err);
});
// Generic error handler.
app.use((err, req, res, next) => {
	console.log(err);
	res.status(err.status || 500);
	const isProduction = environment === "production";
	res.json({
		title: err.title || "Server Error",
		errors: err.errors,
		stack: isProduction ? null : err.stack,
	});
});

module.exports = app;
