
import express from 'express';
import cardController from '../controllers/CardController.js';
const router = express.Router();


router.post("/add/:id",cardController.addNewCard);
router.get("/getall",cardController.getAllCards);
router.get("/getallpag",cardController.getAllCardPag);
router.get("/getby/:id",cardController.getById);
router.get("/getallcardssearch",cardController.getAllCardSearch);
router.put("/update/:id",cardController.update);
router.delete("/delete/:id",cardController.delete);


export default router;