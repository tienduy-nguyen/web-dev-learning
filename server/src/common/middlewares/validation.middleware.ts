import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { BadRequestException } from '@common/exceptions';
import handler from 'express-async-handler';
import { ClassType } from 'class-transformer/esm2015';
import { RequestHandler } from 'express';

export function validationMiddleware<T>(type: ClassType<T>, skipMissingProperties = false): RequestHandler {
  return handler(async (req, res, next) => {
    try {
      const parsedBody = plainToClass(type, req.body);
      const errors = await validate(parsedBody, { skipMissingProperties, whitelist: true });
      if (errors.length > 0) {
        const message = errors.join('').trimEnd();
        next(new BadRequestException(message));
      } else {
        req.body = parsedBody;
        next();
      }
    } catch (error) {
      next(error);
    }
  });
}
