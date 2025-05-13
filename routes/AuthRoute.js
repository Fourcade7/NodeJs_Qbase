


import express from 'express';
import authController from '../controllers/AuthController.js'; // To'g'ri yo'l
const router = express.Router();

// Barcha foydalanuvchilarni olish
router.post('/register', authController.register);
router.get("/login",authController.login);
router.get("/getalluser",authController.getAllUser);
router.get("/getalluserpag",authController.getAllUserPag);
router.get("/getallusersearch",authController.getAllUserSearch);
router.get("/getbyid/:id",authController.getById);
router.put("/update/:id",authController.update);
router.delete("/delete/:id",authController.delete);

export default router;
