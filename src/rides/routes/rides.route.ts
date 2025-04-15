import { Router } from 'express';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';
import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { rideCreateInputValidation } from './ride.input-dto.validation-middleware';
import { createRideHandler } from './handlers/create-ride.handler';
import { getRideListHandler } from './handlers/get-ride-list.handler';
import { getRideHandler } from './handlers/get-ride.handler';
import { finishRideHandler } from './handlers/finish-ride.handler';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation-middleware';
import { RideSortField } from './input/ride-sort-field';

export const ridesRoute = Router({});

ridesRoute.use(superAdminGuardMiddleware);

ridesRoute.get(
  '',
  paginationAndSortingValidation(RideSortField),
  inputValidationResultMiddleware,
  getRideListHandler,
);

ridesRoute.get(
  '/:id',
  idValidation,
  inputValidationResultMiddleware,
  getRideHandler,
);

ridesRoute.post(
  '',
  rideCreateInputValidation,
  inputValidationResultMiddleware,
  createRideHandler,
);

ridesRoute.post(
  '/:id/actions/finish',
  idValidation,
  inputValidationResultMiddleware,
  finishRideHandler,
);
