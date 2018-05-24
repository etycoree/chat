import express from "express";
import passport from "passport";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import morgan from "morgan";
import chalk from "chalk";
import socketIo from "socket.io";
import http from "http";

import User from "./models/User";
import Message from "./models/Message";

import auth from "./routes/auth";
import initPassport from "./passport";

const app = express();
const server = http.Server(app);

process.on("unhandledRejection", function(err) {
	console.log(err.stack);
	process.exit(1);
});

app.use(
	morgan((tokens, req, res) => {
		let method;
		if (tokens.status(req, res) < 400) {
			method = chalk.green(tokens.method(req, res));
		} else {
			method = chalk.red(tokens.method(req, res));
		}
		return (
			method +
			" " +
			chalk.white(tokens.url(req, res)) +
			" " +
			tokens.status(req, res) +
			" " +
			chalk.red(tokens["response-time"](req, res))
		);
	}),
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost/chatApp").then(() => console.log("MongoDB started"));
//Passport middleware
app.use(passport.initialize());

//Passport config
initPassport(passport);

app.use("/auth", auth);

// app.use((req, res, next) => {
// 	res.header("Access-Control-Allow-Origin", "*");
// 	res.header("Access-Control-Allow-Headers", "X-Requested-With");
// 	res.header("Access-Control-Allow-Headers", "Content-Type");
// 	res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
// 	next();
// });

const exServer = app.listen(5000, () => console.log("Server live on 5000..."));
// Socket
import SocketIo from "socket.io";

// const io = SocketIo(server);

const io = socketIo.listen(exServer);
let activeUsers = [];
io.set("origins", "*:*");

io.on("connection", client => {
	console.log("Client connected ", client.id);

	client.on("ADD_USER_TO_LIST", ({ user }) => {
		if (activeUsers.indexOf(user) > -1) {
			activeUsers.splice(activeUsers.indexOf(user), 1);
		}
		activeUsers.push(user);
		io.emit("UPDATE_USER_LIST", activeUsers);
	});

	client.on("SEND_MESSAGE", async data => {
		const message = new Message(data);
		await message.save();
		io.emit("RECEIVE_MESSAGE", message);
	});

	client.on("GET_MESSAGES", async () => {
		try {
			const messages = await Message.find({});
			io.emit("SET_MESSAGES", messages);
		} catch (err) {
			io.emit("SET_MESSAGES", []);
			console.log(err);
		}
	});

	client.on("DELETE_USER_FROM_LIST", ({ user }) => {
		const index = activeUsers.indexOf(user);
		activeUsers.splice(index, 1);
		io.emit("UPDATE_USER_LIST", activeUsers);
	});

	console.log(activeUsers);

	client.on("disconnect", () => {
		console.log("client disconnect...", client.id);
	});
});
