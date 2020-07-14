import express from "express";
import authService from "../services/auth";

const router = express.Router();

router.post("/login", (req, res) => {
  authService
    .login(req.body.username, req.body.password)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.post("/register", (req, res) => {
  authService
    .register(req.body.username, req.body.password)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

export default router;
