import { Response } from 'express';
import { Result, resultStatusToHttp } from './result';
import { createErrorMessages } from '../middlewares/validation/input-validation-result.middleware';

// Отправляет HTTP-ответ по неуспешному Result (подход rides): маппит статус в HTTP-код
// и оборачивает ошибки в тот же JSON:API-формат, что и валидация/errorsHandler.
export function sendErrorResult(result: Result<unknown>, res: Response): void {
  const httpStatus = resultStatusToHttp[result.status];

  res.status(httpStatus).send(
    createErrorMessages(
      (result.errors ?? []).map((error) => ({
        status: httpStatus,
        detail: error.detail,
        source: error.source,
        code: error.code,
      })),
    ),
  );
}
