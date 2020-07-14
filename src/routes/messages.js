import express from "express";
import messagesService from "../services/messages";

const router = express.Router();

router.get("/", (req, res) => {
  messagesService
    .getUserEmails(req.user.username)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});
router.post("/", (req, res) => {
  messagesService
    .insertNewMessage(req.user.username, req.body)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.delete("/:messageId", (req, res) => {
  messagesService
    .deleteForUser(req.params.messageId, req.user.username)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

export default router;
