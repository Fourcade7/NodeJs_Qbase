
import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


const prisma = new PrismaClient();

const SECRET_KEY = "super-secret-key";
const REFRESH_SECRET = "refresh-secret-key";


class AuthController{


    async  universal(req,res) {
        let data=req.body;
        let id=req.params.id;
        let h=req.headers["pr"];
        let q=req.query.q;
        res.send({
            userid:data.userid,
            username:data.name,
            message:"success",
            id:id,
            q:q,
            h:h,
            headers:req.headers
        });
    }

    async getAllUser(req,res){
        try{
            let users=await prisma.user.findMany({
                include:{
                    cardlist:false,
                    partylist:false
                }
            });
            res.send(users);
        }catch(error){
            res.status(400).send(error);
        }

    }


    async getAllUserSearch(req,res){
        const search = req.query.search || '';

        try{
           const users = await prisma.user.findMany({
            where: {
                OR:[
                {username: {
                //startsWith: search,
                contains: search.toLowerCase()
                }},
                {surname: {
                //startsWith: search,
                contains: search.toLowerCase()
                }},
                {phonenumber: {
                //startsWith: search,
                contains: search.toLowerCase()
                }},
                ]
            },
            take:4
            });

            res.send(users);
        }catch(error){
            res.status(400).send(error);
        }

    }


    async  getAllUserPag(req, res) {
    try {
        // So‘rovdan page va limit parametrlarini olish
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;

        // Skip – qaysidan boshlab olish
        let skip = (page - 1) * limit;

        // Ma’lumotlarni olish
        let users = await prisma.user.findMany({
            skip: skip,
            take: limit,
        });

        // Jami foydalanuvchilar sonini olish
        let totalUsers = await prisma.user.count();

        // Javob yuborish
        res.send({
            currentpage: page,
            limit: limit,
            alluser: totalUsers,
            allpages: Math.ceil(totalUsers / limit),
            users: users,
        });
    } catch (error) {
        res.status(400).send(error);
    }
}


    async getById(req,res){
        
        const id=Number(req.params.id);

        try{

            let user=await prisma.user.findUnique({
                where:{id},
                include:{
                    cardlist:true,
                    partylist:true
                }
            });
            if(!user){
                return res.status(404).send({message:"User not found"});
            }
            res.send(user);
        }catch(error){
            res.status(400).send(error);
        }

    }

     async login(req,res){
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     return res.status(400).json({ errors: errors.array() });
        // }
         const { phonenumber, password } = req.body;

    if (!phonenumber || !password) {
      return res.status(400).send({ message: "phonenumber and password must" });
    }

    try {
      // Faqat telefon raqam bo‘yicha userni topamiz
      const user = await prisma.user.findFirst({
        where: {
          phonenumber: phonenumber
        }
      });

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      // Parolni bcrypt orqali tekshiramiz
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).send({ message: "Incorrect password" });
      }

      // JWT tokenlar 
      const accessToken = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "30d" });
      const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: "90d" });

      return res.json({ accessToken, refreshToken });

    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
    }

    async refreshToken(req,res){
       const token = req.body.refreshToken;
  
        if (!token) {
            return res.status(401).send("not refresh token");
        }

        try {
            // Refresh tokenni tekshiramiz
            const userData = jwt.verify(token, REFRESH_SECRET);
            
            // Yangi access token yaratamiz (90d amal qiladi)
            const newAccessToken = jwt.sign({ id: userData.id }, SECRET_KEY, { expiresIn: "90d" });
            
            // Yangi access tokenni javobga yuboramiz
            res.json({ newAccessToken: newAccessToken });
        } catch (error) {
            // Token noto‘g‘ri yoki muddati tugagan bo‘lsa
            res.status(400).send(error);
        }
    }
    async decodeToken(req,res){
       const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Token not found" });
        }

        //const token = authHeader.split(" ")[1];
        const token = authHeader.replace("Bearer ", "");


        try {
            // TOKEN NI TEKSHIRIB VA DECODE QILIB, ID NI OLAMIZ
            const decoded = jwt.verify(token, SECRET_KEY);
            res.send({decoded});
           
        } catch (error) {
            return res.status(403).json({ 
                error,
                message: "Token wrong or expired" 
            });
        }
    }

    async register(req,res){
        let {username,surname,phonenumber,password}=req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try{
            const user=await prisma.user.create({
                data:{
                    username,
                    surname,
                    phonenumber,
                    password:hashedPassword
                }
            });

            res.status(201).json(user);
        }catch(error){
            res.status(400).send({error:error});
        }
    }

    async update(req,res){
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Token not found" });
        }

        //const token = authHeader.split(" ")[1];
        const token = authHeader.replace("Bearer ", "");
        const decoded = jwt.verify(token, SECRET_KEY);

       

        const id=Number(decoded.id);
         
        let {username,surname,sex,phonenumber,password}=req.body;
        try{
            let usercheck=await prisma.user.findUnique({where:{id}});
            if(!usercheck){
                return res.status(404).send({message:"User not found"});
            }
            const user=await prisma.user.update({
                where:{id},
                data:{
                    username,
                    surname,
                    sex,
                    phonenumber,
                    password
                }
            });

            res.status(200).json(user);
        }catch(error){
            res.status(400).send({error:error});
        }
    }

    async delete(req,res){

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Token not found" });
        }

        //const token = authHeader.split(" ")[1];
        const token = authHeader.replace("Bearer ", "");
        const decoded = jwt.verify(token, SECRET_KEY);

        const id=Number(decoded.id);

        try{
            let usercheck=await prisma.user.findUnique({where:{id}});
            if(!usercheck){
                return res.status(404).send({message:"User not found"});
            }
            await prisma.user.delete({where:{id}});
            res.status(200).json({message:"User deleted"});
        }catch(error){
            res.status(400).send({error:error});
        }
    }
}

export default new AuthController();