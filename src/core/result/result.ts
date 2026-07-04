import { HttpStatus } from '../types/http-statuses';

// Статус результата операции сервиса (подход "app notification result" — модуль rides).
// Вместо выбрасывания исключений сервис ВОЗВРАЩАЕТ объект Result с одним из статусов.
export enum ResultStatus {
  Success = 'Success',
  NotFound = 'NotFound',
  DomainRuleViolation = 'DomainRuleViolation',
}

export type ResultError = {
  detail: string;
  code?: string;
  source?: string;
};

// Универсальный результат: статус + данные (на успехе) + ошибки (на неудаче).
export type Result<T = null> = {
  status: ResultStatus;
  data: T;
  errors: ResultError[] | null;
};

// Фабрики результатов
export const successResult = <T>(data: T): Result<T> => ({
  status: ResultStatus.Success,
  data,
  errors: null,
});

// На ошибочных статусах данных нет, поэтому фабрики дженерик-параметризованы:
// T выводится из контекста (типа возвращаемого Result), а data = null.
export const notFoundResult = <T = null>(detail: string): Result<T> => ({
  status: ResultStatus.NotFound,
  data: null as T,
  errors: [{ detail }],
});

export const domainResult = <T = null>(
  detail: string,
  code: string,
  source?: string,
): Result<T> => ({
  status: ResultStatus.DomainRuleViolation,
  data: null as T,
  errors: [{ detail, code, source }],
});

// Соответствие статуса результата HTTP-коду.
export const resultStatusToHttp: Record<ResultStatus, HttpStatus> = {
  [ResultStatus.Success]: HttpStatus.Ok,
  [ResultStatus.NotFound]: HttpStatus.NotFound,
  [ResultStatus.DomainRuleViolation]: HttpStatus.UnprocessableEntity,
};
