import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

const noteValidation = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required()
});

export const validateNote = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = noteValidation.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
  } else {
    next();
  }
};

const updateNoteValidation = Joi.object({
  createdBy: Joi.string().required(),
  newTitle: Joi.string().optional(),
  newDescription: Joi.string().optional(),
});

export const validateUpdateNote = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = updateNoteValidation.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
  } else {
    next();
  }
};