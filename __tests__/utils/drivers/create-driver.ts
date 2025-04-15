// @ts-ignore
import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { DRIVERS_PATH } from '../../../src/core/paths/paths';
import { getDriverDto } from './get-driver-dto';
import { DriverOutput } from '../../../src/drivers/routes/output/driver.output';
import { DriverCreateInput } from '../../../src/drivers/routes/input/driver-create.input';
import { ResourceType } from '../../../src/core/types/resource-type';
import { DriverAttributes } from '../../../src/drivers/application/dtos/driver-attributes';

export async function createDriver(
  app: Express,
  driverDto?: DriverAttributes,
): Promise<DriverOutput> {
  const testDriverData: DriverCreateInput = {
    data: {
      type: ResourceType.Drivers,
      attributes: { ...getDriverDto(), ...driverDto },
    },
  };

  const createdDriverResponse = await request(app)
    .post(DRIVERS_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(testDriverData)
    .expect(HttpStatus.Created);

  return createdDriverResponse.body;
}
