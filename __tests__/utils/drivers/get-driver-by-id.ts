// @ts-ignore
import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { DRIVERS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { DriverOutput } from '../../../src/drivers/routes/output/driver.output';

export async function getDriverById(
  app: Express,
  driverId: string,
): Promise<DriverOutput> {
  const driverResponse = await request(app)
    .get(`${DRIVERS_PATH}/${driverId}`)
    .set('Authorization', generateBasicAuthToken())
    .expect(HttpStatus.Ok);

  return driverResponse.body;
}
