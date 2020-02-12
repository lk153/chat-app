import express from "express";
import ChatModel from '../model/ChatModel.js';

const router = express.Router();
const chatObj = new ChatModel();

router.route("/chats").get((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    let room = req.query.room;

    chatObj.findDocuments('message', { room }, (data) => {
        res.json(data);
    });
});

module.exports = router;