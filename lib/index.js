import express from "express";
import http from "http";
import socketio from "socket.io";
import dateTime from "simple-datetime-formater";
import bodyParser from "body-parser";
import dotenv from "dotenv";

//redis 
var redis = require("socket.io-redis");



import apiRouter from "./route/api";
import SocketCL from "./socket.js";

//Loads environment variables
const result = dotenv.config();
if (result.error) {
	throw result.error;
}

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketio(server);
io.adapter(redis({ host: "10.20.30.48", port: 6379 }));
(new SocketCL(io));

app.use(express.static("public"));
app.use(bodyParser.json());

app.use("/api", apiRouter);

app.get("/", (req, res) => {
	res.sendFile(__dirname + "../public/index.html");
});

server.listen(PORT, function() {
	console.log("listening on *:" + PORT);
});

export default server;