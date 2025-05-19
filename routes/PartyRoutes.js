
import express from 'express';
import partyController from '../controllers/PartyController.js';
const router = express.Router();


router.post("/add/:id",partyController.addParty);
router.get("/getallpag",partyController.getAllPartyPag);
router.get("/getby/:id",partyController.getById);
router.get("/getallpartysearch",partyController.getAllPartySearch);
router.put("/update/:id",partyController.updateParty);
router.delete("/delete/:id",partyController.delete);


export default router;