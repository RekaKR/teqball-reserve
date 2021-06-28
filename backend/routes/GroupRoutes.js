const express = require("express");
const router = express.Router();
const GroupController = require("../controllers/GroupController");



router.get("/", GroupController.getGroups);

router.post("/", GroupController.insertGroup);

router.post("/mygroups", GroupController.getMyGroups);

router.post("/othergroups", GroupController.getOtherGroups);

router.post("/insert-member", GroupController.insertMember);

router.post("/update-member", GroupController.updateMemberRole);



module.exports = router;