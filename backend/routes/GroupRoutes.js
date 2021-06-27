const express = require("express");
const router = express.Router();
const GroupController = require("../controllers/GroupController");



router.get("/", GroupController.getGroups);

router.post("/", GroupController.insertGroup);

router.post("/mygroups", GroupController.getMyGroups);

router.post("/othergroups", GroupController.getOtherGroups);

router.post("/update", GroupController.updateMembers);



module.exports = router;