const express = require("express");
const router = express.Router();
const collaboratorController = require("../controllers/collaboratorController");

router.post('/wikis/:id/collaborators/addCollab', collaboratorController.addCollab)
router.post('/wikis/:wikiId/collaborators/:id/removeCollab', collaboratorController.removeCollab)
module.exports = router