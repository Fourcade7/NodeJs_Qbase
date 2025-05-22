
import express from 'express';
import friendController from '../controllers/FriendController.js';
const router = express.Router();


router.post("/userid/:userid/friendid/:friendid",friendController.addNewFriend);
router.get("/getallpag/:id",friendController.getAllFriendsOfUsersPag);
router.get("/getmy/:id",friendController.getAllFriendsOfUsers);
router.delete("/delete/userid/:userid/friendid/:friendid",friendController.delete);


export default router;