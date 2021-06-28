const express = require("express");
const router = express.Router();
const EventController = require("../controllers/EventController");



router.get("/:groupId", EventController.getEventsByGroupId);

router.get("/byId/:googleId",EventController.getEventsByGoogleId);

router.post("/insert", EventController.insertEvent);

router.post("/update-participation", EventController.updateParticipation);

//router.post("/update-member", GroupController.updateMemberRole);



module.exports = router;