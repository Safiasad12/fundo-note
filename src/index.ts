
import express from 'express';
import connectDB from './config/db.config';
import dotenv from 'dotenv';
import logger from './utils/logger';
import morgan from 'morgan';
import userRouter from './routes/user.routes';
import noteRouter from './routes/note.routes';



dotenv.config(); 
const app = express();
const PORT = process.env.PORT;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

connectDB();

const morganFormate = ':method :url :status :response-time ms';

app.use(morgan(morganFormate, {
  stream: {
    write: (message) => {
      const logObject = {
        method: message.split(' ')[0],
        url: message.split(' ')[1],
        status: message.split(' ')[2],
        responseTime: message.split(' ')[3]
      };
      logger.info(JSON.stringify(logObject));
    }
  }
}));

app.use('/api/user', userRouter);
app.use('/api/note', noteRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
