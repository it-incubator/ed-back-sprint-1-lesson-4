import { body, param } from 'express-validator';

export const idValidation = param('id')
  .exists()
  .withMessage('ID is required') // Проверка на наличие
  .isString()
  .withMessage('ID must be a string') // Проверка, что это строка
  .isMongoId()
  .withMessage('Неверный формат ObjectId');

export const dataIdMatchValidation = body('data.id')
  .exists()
  .withMessage('ID in body is required')
  .custom((value, { req }) => {
    if (value !== req?.params?.id) {
      throw new Error('ID in URL and body must match');
    }
    return true; // Если все хорошо, возвращаем true
  });
