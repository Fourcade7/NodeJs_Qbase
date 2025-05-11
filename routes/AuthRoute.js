


import express from 'express';
import authController from '../controllers/AuthController.js'; // To'g'ri yo'l
const router = express.Router();

// Barcha foydalanuvchilarni olish
router.post('/register/:id', authController.register);
router.get("/login",authController.login);
router.post("/adduser",authController.addUser);

export default router;
