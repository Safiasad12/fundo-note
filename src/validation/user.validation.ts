import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

 const registerValidation = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required()
});

 const loginValidation = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required()
});


export const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = registerValidation.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
  } else {
    next(); 
  }
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = loginValidation.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
  } else {
    next(); 
  }
};
