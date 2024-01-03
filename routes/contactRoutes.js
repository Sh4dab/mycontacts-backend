const express= require("express");
const router=express.Router();
const { getAllContacts, createContacts, getContactbyID, updateContact, deleteContact } = require("../controllers/contactControllers");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken);

router.route("/").get(getAllContacts);
router.route("/").post(createContacts);
router.route("/:id").get(getContactbyID);
router.route("/:id").put(updateContact);
router.route("/:id").delete(deleteContact);

module.exports=router;