import { RequestHandler, Router } from 'express';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard.middleware';
import { idValidation } from '../../core/middlewares/validation/params-id.validation.middleware';
import { rideCreateInputValidation } from '../validation/ride.input-dto.validation-middleware';
import { createRideHandler } from './handlers/create-ride.handler';
import { getRideListHandler } from './handlers/get-ride-list.handler';
import { getRideHandler } from './handlers/get-ride.handler';
import { finishRideHandler } from './handlers/finish-ride.handler';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation.middleware';
import { sanitizeQueryParams } from '../../core/middlewares/validation/sanitize-query.middleware';
import { RideSortField } from './input/ride-sort-field';
import { RIDES_ROUTES } from '../constants/rides.paths';

export const ridesRoute = Router({});

ridesRoute.use(superAdminGuardMiddleware);

// @types/express v5: req.query у списка типизирован (RideQueryInput) и не совпадает с ParsedQs.
// К моменту вызова query уже провалидирован и приведён middleware'ами, поэтому приводим к RequestHandler.
ridesRoute.get(
  RIDES_ROUTES.ROOT,
  paginationAndSortingValidation(RideSortField),
  inputValidationResultMiddleware,
  sanitizeQueryParams,
  getRideListHandler as unknown as RequestHandler,
);

ridesRoute.get(
  RIDES_ROUTES.BY_ID,
  idValidation,
  inputValidationResultMiddleware,
  getRideHandler,
);

ridesRoute.post(
  RIDES_ROUTES.ROOT,
  rideCreateInputValidation,
  inputValidationResultMiddleware,
  createRideHandler,
);

ridesRoute.post(
  RIDES_ROUTES.FINISH,
  idValidation,
  inputValidationResultMiddleware,
  finishRideHandler,
);
