import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

const SECRET_KEY = "super-secret-key";

class FriendController {
  async universal(req, res) {
    let data = req.body;
    let id = req.params.id;
    let h = req.headers["pr"];
    let q = req.query.q;
    res.send({
      userid: data.userid,
      username: data.name,
      message: "success",
      id: id,
      q: q,
      h: h,
      headers: req.headers,
    });
  }

  async getAllFriendsOfUsers(req, res) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token not found" });
    }

    //const token = authHeader.split(" ")[1];
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, SECRET_KEY);

    const id = Number(decoded.id);

    try {
      // Men qo‘shgan do‘stlar (ya’ni userId = men)
      const addedByMe = await prisma.friend.findMany({
        where: { userId: id },
        include: { friend: true },
      });

      // Meni qo‘shgan do‘stlar (ya’ni friendId = men)
      const addedMe = await prisma.friend.findMany({
        where: { friendId: id },
        include: { user: true },
      });

      res.json({
        addedByMe, // men kimnidir qo‘shganman
        addedMe, // kimdir meni qo‘shgan
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Do‘stlar ro‘yxatini olishda xatolik yuz berdi." });
    }
  }

  async getAllFriendsOfUsersPag(req, res) {
     const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token not found" });
    }

    //const token = authHeader.split(" ")[1];
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, SECRET_KEY);

    const id = Number(decoded.id);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
      // Men qo‘shgan do‘stlar (userId = men)
      const addedByMe = await prisma.friend.findMany({
        where: { userId: id },
        include: { friend: true },
        skip,
        take: limit,
      });

      // Meni qo‘shgan do‘stlar (friendId = men)
      const addedMe = await prisma.friend.findMany({
        where: { friendId: id },
        include: { user: true },
        skip,
        take: limit,
      });

      // Umumiy sonlarni ham olish
      const totalAddedByMe = await prisma.friend.count({
        where: { userId: id },
      });

      const totalAddedMe = await prisma.friend.count({
        where: { friendId: id },
      });

      res.json({
        page,
        limit,
        addedByMe,
        totalAddedByMe,
        addedMe,
        totalAddedMe,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Do‘stlar ro‘yxatini olishda xatolik yuz berdi." });
    }
  }

  async addNewFriend(req, res) {
     const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token not found" });
    }

    //const token = authHeader.split(" ")[1];
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, SECRET_KEY);

    const userid = Number(decoded.id);

    const { friendid } = req.params;
    if (userid === friendid) {
      return res.status(400).json({ error: "Fatal error in id" });
    }

    try {
      const alreadyExists = await prisma.friend.findFirst({
        where: {
          userId: Number(userid),
          friendId: Number(friendid),
        },
      });

      if (alreadyExists) {
        return res.status(400).json({ error: "This friend already exsist" });
      }

      const friend = await prisma.friend.create({
        data: {
          userId: Number(userid),
          friendId: Number(friendid),
        },
      });

      res.status(201).json(friend);
    } catch (error) {
      res.status(400).send({ error: error });
    }
  }

  async delete(req, res) {
     const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token not found" });
    }

    //const token = authHeader.split(" ")[1];
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, SECRET_KEY);

    const userId = Number(decoded.id);
    const friendId = Number(req.params.friendid);

    try {
      const deleted = await prisma.friend.deleteMany({
        where: {
          userId: userId,
          friendId: friendId,
        },
      });

      if (deleted.count === 0) {
        return res.status(404).json({ message: "Friends not found" });
      }

      res.json({ message: "Friends deleted" });
      //res.json({ message: "Friends deleted", deleted });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Fatal error" });
    }
  }
}

export default new FriendController();
