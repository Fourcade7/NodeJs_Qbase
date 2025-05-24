
import express from 'express';
import friendController from '../controllers/FriendController.js';
const router = express.Router();


router.post("/add/friendid/:friendid",friendController.addNewFriend);
router.get("/getallpag",friendController.getAllFriendsOfUsersPag);
router.get("/getmy",friendController.getAllFriendsOfUsers);
router.delete("/delete/friendid/:friendid",friendController.delete);


export default router;