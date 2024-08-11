import { validationResult } from "express-validator";

export const validate = (validations: any) => {
  return async (req: any, res: any, next: any) => {
    await Promise.all(
      validations.map((validation: any) => validation.run(req))
    );

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // res.handler.validationError(undefined, errors.array()[0]["msg"]);
    res.errorHandler({
      res,
      statusCode: 422,
      message: errors.array()[0].msg,
    });
  };
};
