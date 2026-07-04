// Нарушение бизнес-правила (например, «у водителя уже есть активная поездка»).
// Используется в подходе через throw (модуль drivers) и ловится errorsHandler → 422.
export class DomainException extends Error {
  constructor(
    detail: string,
    public readonly code: string,
    public readonly source?: string,
  ) {
    super(detail);
  }
}
