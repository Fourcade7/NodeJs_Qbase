


import express from 'express';
import authController from '../controllers/AuthController.js'; // To'g'ri yo'l
import { body } from 'express-validator'; // 🔹 VALIDATOR
const router = express.Router();


const loginValidation = [
  body('phonenumber')
    .notEmpty()
    .withMessage('Telefon raqam majburiy')
    .isMobilePhone()
    .withMessage('Telefon raqam formati noto‘g‘ri'),
  body('password')
    .notEmpty()
    .withMessage('Parol majburiy')
    .isLength({ min: 6 })
    .withMessage('Parol kamida 6 ta belgidan iborat bo‘lishi kerak')
];

router.post('/register', authController.register);
router.post("/login",loginValidation,authController.login);
router.get("/getalluser",authController.getAllUser);
router.get("/getalluserpag",authController.getAllUserPag);
router.get("/getallusersearch",authController.getAllUserSearch);
router.get("/getbyid/:id",authController.getById);
router.put("/update/:id",authController.update);
router.delete("/delete/:id",authController.delete);

export default router;
