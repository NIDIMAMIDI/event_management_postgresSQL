import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connection } from './config/db/db.js';
import indexRouter from './routes/index.routes.js';
const app = express();
const port = process.env.PORT || 5555;

app.use(express.json());
app.use(cors());
app.use('/api', indexRouter);

app.listen(port, () => {
  console.log(`App started at the port ${port}`);
});
connection();
