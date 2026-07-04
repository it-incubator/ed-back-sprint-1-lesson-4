import { ValidationError, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { ValidationErrorType } from '../../types/validationError';
import { HttpStatus } from '../../types/http-statuses';
import { ValidationErrorListOutput } from '../../types/validationError.dto';

// Оборачивает список ошибок в единый формат JSON:API-ответа: { errors: [...] }.
export const createErrorMessages = (
  errors: ValidationErrorType[],
): ValidationErrorListOutput => {
  return {
    errors: errors.map((error) => ({
      status: error.status,
      detail: error.detail, // текст ошибки
      source: { pointer: error.source ?? '' }, // поле, где ошибка
      code: error.code ?? null, // код доменной ошибки
    })),
  };
};

// Приводит ошибку express-validator к нашему формату.
// У ошибок типа 'field' (body/param/query) есть путь к полю.
const formatValidationError = (error: ValidationError): ValidationErrorType => {
  return {
    status: HttpStatus.BadRequest,
    source: error.type === 'field' ? error.path : '',
    detail: error.msg,
  };
};

export const inputValidationResultMiddleware = (
  req: Request<{}, {}, {}, {}>,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req)
    .formatWith(formatValidationError)
    .array({ onlyFirstError: true });

  if (errors.length > 0) {
    res.status(HttpStatus.BadRequest).json(createErrorMessages(errors));
    return;
  }
  next();
};
