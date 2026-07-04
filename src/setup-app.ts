import express, { Express } from 'express';
import { setupSwagger } from './core/swagger/setup-swagger';
import { driversRouter } from './drivers/routes/drivers.route';
import { testingRouter } from './testing/routes/testing.route';
import { ridesRoute } from './rides/routes/rides.route';
import { DRIVERS_PATH } from './drivers/constants/drivers.paths';
import { RIDES_PATH } from './rides/constants/rides.paths';
import { TESTING_PATH } from './testing/constants/testing.paths';

/**
 * Настраиваем routes, cors, swagger
 * @param app
 */
export const setupApp = (app: Express) => {
  app.use(express.json());

  app.use(DRIVERS_PATH, driversRouter);
  app.use(RIDES_PATH, ridesRoute);
  app.use(TESTING_PATH, testingRouter);

  setupSwagger(app);
};
