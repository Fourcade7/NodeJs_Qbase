

import express from 'express';
import authRouter from './routes/AuthRoute.js'; 
import partyRouter from './routes/PartyRoutes.js';
import cardRouter from './routes/CardRoutes.js'; 
import friendRouter from './routes/FriendRoutes.js'; 
import cors from "cors";

const app = express();
app.use(cors());

app.use(express.json());
app.use("/",authRouter);
app.use("/party",partyRouter);
app.use("/card",cardRouter);
app.use("/friend",friendRouter);



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT} is running`);
});
