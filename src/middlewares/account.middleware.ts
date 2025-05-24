import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export const accountMiddleware = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;
    const result = schema.safeParse(body);

    if (!result.success) {
      const errors = result.error.errors.map((error) => error.message);
      return res.status(400).json({ errors });
    }

    next();
  };
};
