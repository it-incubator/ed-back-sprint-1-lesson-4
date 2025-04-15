import { body } from 'express-validator';
import { Currency } from '../domain/ride';
import { resourceTypeValidation } from '../../core/middlewares/validation/resource-type.validation-middleware';
import { ResourceType } from '../../core/types/resource-type';

export const clientNameValidation = body('data.attributes.clientName')
  .isString()
  .withMessage('status should be string')
  .trim()
  .isLength({ min: 3, max: 100 });

export const driverIdValidation = body('data.attributes.driverId')
  .isString()
  .withMessage('ID must be a string')
  .trim()
  .isMongoId()
  .withMessage('Неверный формат ObjectId');

export const priceValidation = body('data.attributes.price')
  .isFloat({ gt: 0 }) // Проверка, что цена - это число больше 0
  .withMessage('price must be a positive number');

export const currencyValidation = body('data.attributes.currency')
  .isString()
  .withMessage('currency should be string')
  .trim()
  .isIn(Object.values(Currency)) // Проверка на допустимые значения
  .withMessage('currency must be either "usd" or "eu"');

export const startAddressValidation = body('data.attributes.fromAddress')
  .isString()
  .withMessage('fromAddress should be string')
  .trim()
  .isLength({ min: 10, max: 200 });

export const endAddressValidation = body('data.attributes.toAddress')
  .isString()
  .withMessage('toAddress should be string')
  .trim()
  .isLength({ min: 10, max: 200 });

export const rideCreateInputValidation = [
  resourceTypeValidation(ResourceType.Rides),
  clientNameValidation,
  driverIdValidation,
  priceValidation,
  currencyValidation,
  startAddressValidation,
  endAddressValidation,
];
