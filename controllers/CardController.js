
import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';
const prisma = new PrismaClient();


class CardController{


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

    async getAllCards(req,res){
        try{
            let cards=await prisma.card.findMany();
            res.send(cards);
        }catch(error){
            res.status(400).send(error);
        }

    }


    async getAllCardSearch(req,res){
        const search = req.query.search || '';

        try{
           const cards = await prisma.card.findMany({
            where: {
                number: {
                    contains: search.toLowerCase()
                    },
            },
            include:{
                    user:true
            },
            take:4
            });

            res.send(cards);
        }catch(error){
            res.status(400).send(error);
        }

    }


    async  getAllCardPag(req, res) {
    try {
        // So‘rovdan page va limit parametrlarini olish
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;

        // Skip – qaysidan boshlab olish
        let skip = (page - 1) * limit;

        // Ma’lumotlarni olish
        let cards = await prisma.card.findMany({
            skip: skip,
            take: limit,
        });

        // Jami foydalanuvchilar sonini olish
        let totalCards = await prisma.card.count();

        // Javob yuborish
        res.send({
            currentpage: page,
            limit: limit,
            allcard: totalCards,
            allpages: Math.ceil(totalCards / limit),
            cards: cards,
        });
    } catch (error) {
        res.status(400).send(error);
    }
}


    async getById(req,res){
        try{
            const id=Number(req.params.id);
            let card=await prisma.card.findUnique({where:{id}});
            if(!card){
                return res.status(404).send({message:"Card not found"});
            }
            res.send(card);
        }catch(error){
            res.status(400).send(error);
        }

    }


    

    async addNewCard(req,res){
        const userId=Number(req.params.id);
        let {number,date}=req.body;

        try{
            const card=await prisma.card.create({
                data:{
                    userId,
                    number,
                    date
                }
            });

            res.status(201).json(card);
        }catch(error){
            res.status(400).send({error:error});
        }
    }

    async update(req,res){
          const id=Number(req.params.id);
          let {number,date}=req.body;
        try{
            let cardcheck=await prisma.card.findUnique({where:{id}});
            if(!cardcheck){
                return res.status(404).send({message:"Card not found"});
            }
            const card=await prisma.card.update({
                where:{id},
                data:{
                    number,
                    date
                }
            });

            res.status(200).json(card);
        }catch(error){
            res.status(400).send({error:error});
        }
    }

    async delete(req,res){

        const id=Number(req.params.id);
        try{
            
            let cardcheck=await prisma.card.findUnique({where:{id}});
            if(!cardcheck){
                return res.status(404).send({message:"Card not found"});
            }
            await prisma.card.delete({where:{id}});
            res.status(200).json({message:"Card deleted"});
        }catch(error){
            res.status(400).send({error:error});
        }
    }
}

export default new CardController();