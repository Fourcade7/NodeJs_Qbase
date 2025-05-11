
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


class AuthController{


    async  register(req,res) {
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


    async login(req,res){
        let data=req.body;
        res.send({
            message:"login success"
        });
    }

    async addUser(req,res){
        let {username,phonenumber}=req.body;

        try{
            const user=await prisma.user.create({
                data:{username,phonenumber}
            });

            res.status(201).json(user);
        }catch(error){
            res.status(400).send({error:error});
        }
    }
}

export default new AuthController();