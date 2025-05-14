
import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';
const prisma = new PrismaClient();


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
                    cardlist:true,
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
                username: {
                //startsWith: search,
                contains: search.toLowerCase()
                },
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
        try{
            const id=Number(req.params.id);
            let user=await prisma.user.findUnique({
                where:{id},
                include:{
                    cardlist:true
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
        let {phonenumber,password}=req.body;
        if (!phonenumber || !password) {
         return res.status(400).send({ message: "phonenumber and password must" });
        }
        try{
            
            let user=await prisma.user.findFirst({
                where:{
                    phonenumber:phonenumber,
                    password:password
                }
            });
            if(!user){
                return res.status(404).send({message:"Error User not found"});
            }
            res.send({
                id:user.id,
                message:"Login success"
            });
        }catch(error){
            res.status(400).send(error);
        }
    }

    async register(req,res){
        let {username,surname,phonenumber,password}=req.body;

        try{
            const user=await prisma.user.create({
                data:{
                    username,
                    surname,
                    phonenumber,
                    password
                }
            });

            res.status(201).json(user);
        }catch(error){
            res.status(400).send({error:error});
        }
    }

    async update(req,res){
         const id=Number(req.params.id);
          let {username,surname,phonenumber,password}=req.body;
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

        const id=Number(req.params.id);
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