const express = require("express");
const router = express.Router();
const LoginController = require("../controllers/LoginController");



router.post("/", LoginController.checkingLogin);



module.exports = router;