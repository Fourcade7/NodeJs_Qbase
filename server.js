// index.js

import express from 'express';
import router from './routes/AuthRoute.js'; // .js yozilishi shart

const app = express();

app.use(express.json());
app.use("/auth",router);



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT} is running`);
});
