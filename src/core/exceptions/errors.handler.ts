import { Response } from 'express';
import { NotFoundException } from './not-found.exception';
import { HttpStatus } from '../types/http-statuses';
import { createErrorMessages } from '../middlewares/validation/input-validation-result.middleware';
import { DomainException } from './domain.exception';

// Единая точка обработки исключений для подхода "через throw" (модуль drivers).
// Превращает кастомные исключения в HTTP-ответ в формате JSON:API-ошибок.
export function errorsHandler(error: unknown, res: Response): void {
  if (error instanceof NotFoundException) {
    const httpStatus = HttpStatus.NotFound;

    res.status(httpStatus).send(
      createErrorMessages([
        {
          status: httpStatus,
          detail: error.message,
        },
      ]),
    );

    return;
  }

  if (error instanceof DomainException) {
    const httpStatus = HttpStatus.UnprocessableEntity;

    res.status(httpStatus).send(
      createErrorMessages([
        {
          status: httpStatus,
          source: error.source,
          detail: error.message,
          code: error.code,
        },
      ]),
    );

    return;
  }

  // Непредвиденная ошибка — 500 (обязательно завершаем ответ, иначе запрос повиснет).
  res.status(HttpStatus.InternalServerError).send(
    createErrorMessages([
      {
        status: HttpStatus.InternalServerError,
        detail: 'Internal server error',
      },
    ]),
  );
}
