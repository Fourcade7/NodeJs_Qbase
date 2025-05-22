// index.js

import express from 'express';
import authRouter from './routes/AuthRoute.js'; // .js yozilishi shart
import partyRouter from './routes/PartyRoutes.js'; // .js yozilishi shart
import cardRouter from './routes/CardRoutes.js'; // .js yozilishi shart
import friendRouter from './routes/FriendRoutes.js'; // .js yozilishi shart

const app = express();

app.use(express.json());
app.use("/",authRouter);
app.use("/party",partyRouter);
app.use("/card",cardRouter);
app.use("/friend",friendRouter);



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT} is running`);
});
