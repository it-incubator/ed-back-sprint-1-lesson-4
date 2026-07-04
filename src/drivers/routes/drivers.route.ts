import { RequestHandler, Router } from 'express';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import {
  driverCreateInputValidation,
  driverUpdateInputValidation,
} from '../validation/driver.input-dto.validation-middlewares';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard.middleware';
import { idValidation } from '../../core/middlewares/validation/params-id.validation.middleware';
import { getDriverListHandler } from './handlers/get-driver-list.handler';
import { getDriverHandler } from './handlers/get-driver.handler';
import { createDriverHandler } from './handlers/create-driver.handler';
import { updateDriverHandler } from './handlers/update-driver.handler';
import { deleteDriverHandler } from './handlers/delete-driver.handler';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation.middleware';
import { sanitizeQueryParams } from '../../core/middlewares/validation/sanitize-query.middleware';
import { DriverSortField } from './input/driver-sort-field';
import { RideSortField } from '../../rides/routes/input/ride-sort-field';
import { getDriverRideListHandler } from './handlers/get-driver-ride-list.handler';
import { DRIVERS_ROUTES } from '../constants/drivers.paths';

export const driversRouter = Router({});

//middleware на весь маршрут
driversRouter.use(superAdminGuardMiddleware);

// @types/express v5: у хендлеров списка req.query типизирован (DriverQueryInput/RideQueryInput)
// и не совпадает с ParsedQs, из-за чего роутер отвергает их сигнатуру. К моменту вызова
// query уже провалидирован и приведён middleware'ами (pagination + sanitizeQueryParams),
// поэтому безопасно приводим такие хендлеры к RequestHandler.
driversRouter
  .get(
    DRIVERS_ROUTES.ROOT,
    paginationAndSortingValidation(DriverSortField),
    inputValidationResultMiddleware,
    sanitizeQueryParams,
    getDriverListHandler as unknown as RequestHandler,
  )

  .get(
    DRIVERS_ROUTES.BY_ID,
    idValidation,
    inputValidationResultMiddleware,
    getDriverHandler,
  )

  .post(
    DRIVERS_ROUTES.ROOT,
    driverCreateInputValidation,
    inputValidationResultMiddleware,
    createDriverHandler,
  )

  .put(
    DRIVERS_ROUTES.BY_ID,
    idValidation,
    driverUpdateInputValidation,
    inputValidationResultMiddleware,
    updateDriverHandler,
  )

  .delete(
    DRIVERS_ROUTES.BY_ID,
    idValidation,
    inputValidationResultMiddleware,
    deleteDriverHandler,
  )

  .get(
    DRIVERS_ROUTES.DRIVER_RIDES,
    idValidation,
    paginationAndSortingValidation(RideSortField),
    inputValidationResultMiddleware,
    sanitizeQueryParams,
    getDriverRideListHandler as unknown as RequestHandler,
  );
