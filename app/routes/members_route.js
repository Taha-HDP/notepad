const express = require("express");
const router = express.Router();
const Members_controller = require("../http/controller/members_controller");
const auth = require("../http/middleware/auth");

router.post("/signup" , Members_controller.signUp) ;
router.post("/login" , Members_controller.login) ;
router.get("/member_info" , auth , Members_controller.member_info) ;
router.put("/editInfo" , auth , Members_controller.edit_member_info) ;
router.put("/changePassword" , auth , Members_controller.change_password) ;
router.get("/notes" , auth , Members_controller.notes) ;
router.post("/addNote" , auth , Members_controller.addNote) ;
router.put("/editNote/:id" , auth , Members_controller.editNote) ;
router.delete("/delete/:id" , auth , Members_controller.deleteNote) ;
module.exports = router;