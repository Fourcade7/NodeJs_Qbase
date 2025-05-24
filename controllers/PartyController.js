import { PrismaClient } from "@prisma/client";

import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();

const SECRET_KEY = "super-secret-key";

class PartyController {
  
    async addParty(req, res) {
       const authHeader = req.headers.authorization;
      
          if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Token not found" });
          }
      
          //const token = authHeader.split(" ")[1];
          const token = authHeader.replace("Bearer ", "");
          const decoded = jwt.verify(token, SECRET_KEY);
      
          const id = Number(decoded.id);
      

      let user = await prisma.user.findUnique({
        where: { id },
      });
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      
      
      let {name, type, address, cardNumber, startTime, endTime, status } = req.body;

      try {
        const party = await prisma.party.create({
          data: {
            userId:id,
            userName:user.username,
            name,
            type,
            address,
            cardNumber,
            startTime,
            endTime,
            status,
          },
        });

        res.status(201).json({ success: true });
      } catch (error) {
        res.status(400).send({ error: error });
      }
    }

    async getAllPartyPag(req, res) {
      try {
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;

        // Skip – qaysidan boshlab olish
        let skip = (page - 1) * limit;

        let partys = await prisma.party.findMany({
          skip: skip,
          take: limit,
        });

        let totalPartys = await prisma.party.count();

        res.send({
          currentpage: page,
          limit: limit,
          allparty: totalPartys,
          allpages: Math.ceil(totalPartys / limit),
          partys: partys,
        });
      } catch (error) {
        res.status(400).send(error);
      }
    }


    async getById(req,res){
        try{
            const id=Number(req.params.id);
            let party=await prisma.party.findUnique({
                where:{id},
                include:{
                    user:true
                }
            });
            if(!party){
                return res.status(404).send({message:"Party not found"});
            }

            res.send(party);
        }catch(error){
            res.status(400).send(error);
        }

    }
    async getAllPartySearch(req,res){
        const search = req.query.search || '';

        try{
           const partys = await prisma.party.findMany({
            where: {
                name: {
                //startsWith: search,
                contains: search.toLowerCase()
                },
            },
            take:10
            });

            res.send(partys);
        }catch(error){
            res.status(400).send(error);
        }

    }


    async updateParty(req, res) {

    const id = Number(req.params.id);
    let partycheck=await prisma.party.findUnique({where:{id}});
    if(!partycheck){
       return res.status(404).send({message:"party not found"});
    }
    let {name, type, address, cardNumber, startTime, endTime, status } = req.body;
    let userId=Number(partycheck.userId);
    let userName=partycheck.userName;


    try {
      const party = await prisma.party.update({
        where:{id},
        data: {
          userId:userId,
          userName:userName,
          name,
          type,
          address,
          cardNumber,
          startTime,
          endTime,
          status,
        },
      });

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(400).send({ error: error });
    }
    }


    async delete(req,res){

        const id=Number(req.params.id);
        try{
            let partycheck=await prisma.party.findUnique({where:{id}});
            if(!partycheck){
                return res.status(404).send({message:"party not found"});
            }
            await prisma.party.delete({where:{id}});
            res.status(200).json({message:"party deleted"});
        }catch(error){
            res.status(400).send({error:error});
        }
    }

}

export default new PartyController();
