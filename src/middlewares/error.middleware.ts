import logger from "../config/logger";
import { Request, Response, NextFunction } from "express";

class ErrorMiddleware {
  // Route not found
  public notFound = (req: Request, res: Response): void => {
    res.status(501).json({
      message: "Oops, route not found",
    });
  };

  // Handle all errors thrown by the server
  public ErrorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
    logger.error(`
      Status - ${err.status || 500}
      Message - ${err.message} 
      URL - ${req.originalUrl} 
      Method - ${req.method} 
      IP - ${req.ip}
    `);

    res.status(err.status || 500).json({
      code: err.status || 500,
      message: err.message || "Internal Server Error",
    });
  };
}

export { ErrorMiddleware };