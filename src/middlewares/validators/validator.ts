import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { passToExpressErrorHandler } from "../../utils";

const authSignupSchema = Joi.object({
  name: Joi.string().max(24).required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().min(6).required(),
});

export const authSignupValidator = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    await authSignupSchema.validateAsync(req.body);

    next();
  } catch (err: any) {
    passToExpressErrorHandler(err, next);
  }
};

const authRefreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

export const authRefreshTokenValidator = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    await authRefreshTokenSchema.validateAsync(req.body);

    next();
  } catch (err: any) {
    passToExpressErrorHandler(err, next);
  }
};

const apiUpdateUserSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email({ minDomainSegments: 2 }),
  isAdmin: Joi.boolean(),
});

export const apiUpdateUserValidator = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    await apiUpdateUserSchema.validateAsync(req.body);

    next();
  } catch (err: any) {
    passToExpressErrorHandler(err, next);
  }
};

const apiFileUploadSchema = Joi.array().items(Joi.binary());

export const apiFileUploadValidator = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    await apiFileUploadSchema.validateAsync(req.files);

    next();
  } catch (err: any) {
    passToExpressErrorHandler(err, next);
  }
};
