
import express from 'express';
import connectDB from './config/db.config';
import dotenv from 'dotenv';
import logger from './utils/logger';
import morgan from 'morgan';
import * as router from "./routes/index.routes";
import cors from 'cors';
import {ErrorMiddleware} from './middlewares/error.middleware'




dotenv.config(); 

const app = express();
const PORT = process.env.PORT;
const errorHandler = new ErrorMiddleware();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:4200",
  })
)


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

app.use('/api/v1', router.handleRouter());

app.use(errorHandler.ErrorHandler);
app.use(errorHandler.notFound);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;