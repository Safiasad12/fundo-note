import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redis.config';
import logger from '../utils/logger';

export const cacheNotesByUserId = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  const userId = req.body.createdBy;
  try {
    const cachedNotes = await redisClient.get(`notes:${userId}`);
    if (cachedNotes) {
      logger.info('Fetching notes from Redis cache');
      return res.status(200).json({ 
        message: 'Data retrieved from Redis cache', 
        notes: JSON.parse(cachedNotes)
      });
    }
    next();
  } catch (error) {
    logger.error(`Error in Redis middleware: ${error}`);
    next(error);
  }
};

export default cacheNotesByUserId;