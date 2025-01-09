// import { Request, Response} from "express";

// interface err{
//     code: number;
//     message: string;
//     error?: string | object;
//   }

// const ErrorMiddleware = (err: err,req: Request,res: Response) => {
//   const status = err.code;
//   const message = err.message;
//   const error = err.error;

//   res.status(status).json({
//     message: message,
//     error: error
//   })
  
// }

// export default ErrorMiddleware;