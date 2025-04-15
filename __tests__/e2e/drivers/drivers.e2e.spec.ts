// @ts-ignore
import request from 'supertest';
// @ts-ignore
import express from 'express';

import { VehicleFeature } from '../../../src/drivers/domain/driver';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';

import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { DRIVERS_PATH } from '../../../src/core/paths/paths';
import { createDriver } from '../../utils/drivers/create-driver';
import { getDriverDto } from '../../utils/drivers/get-driver-dto';
import { clearDb } from '../../utils/clear-db';
import { getDriverById } from '../../utils/drivers/get-driver-by-id';
import { updateDriver } from '../../utils/drivers/update-driver';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { DriverAttributes } from '../../../src/drivers/application/dtos/driver-attributes';

describe('Driver API', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB('mongodb://localhost:27017/db-test');
    await clearDb(app);
  });

  afterAll(async () => {
    await stopDb();
  });

  it('✅ should create driver; POST /api/drivers', async () => {
    await createDriver(app, {
      ...getDriverDto(),
      name: 'Feodor',
      email: 'feodor@example.com',
    });
  });

  it('✅ should return drivers list; GET /api/drivers', async () => {
    await Promise.all([createDriver(app), createDriver(app)]);

    const response = await request(app)
      .get(DRIVERS_PATH)
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok);

    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data.length).toBeGreaterThanOrEqual(2);
  });

  it('✅ should return driver by id; GET /api/drivers/:id', async () => {
    const createdDriver = await createDriver(app);
    const createdDriverId = createdDriver.data.id;

    const driver = await getDriverById(app, createdDriverId);

    expect(driver).toEqual({
      ...createdDriver,
    });
  });

  it('✅ should update driver; PUT /api/drivers/:id', async () => {
    const createdDriver = await createDriver(app);
    const createdDriverId = createdDriver.data.id;

    const driverUpdateData: DriverAttributes = {
      name: 'Updated Name',
      phoneNumber: '999-888-7777',
      email: 'updated@example.com',
      vehicleMake: 'Tesla',
      vehicleModel: 'Model S',
      vehicleYear: 2022,
      vehicleLicensePlate: 'NEW-789',
      vehicleDescription: 'Updated vehicle description',
      vehicleFeatures: [VehicleFeature.ChildSeat],
    };

    await updateDriver(app, createdDriverId, driverUpdateData);

    const driverResponse = await getDriverById(app, createdDriverId);

    expect(driverResponse.data.id).toBe(createdDriverId);
    expect(driverResponse.data.attributes).toEqual({
      name: driverUpdateData.name,
      phoneNumber: driverUpdateData.phoneNumber,
      email: driverUpdateData.email,
      vehicle: {
        description: driverUpdateData.vehicleDescription,
        features: driverUpdateData.vehicleFeatures,
        licensePlate: driverUpdateData.vehicleLicensePlate,
        make: driverUpdateData.vehicleMake,
        model: driverUpdateData.vehicleModel,
        year: driverUpdateData.vehicleYear,
      },
      createdAt: expect.any(String),
    });
  });

  it('✅ should delete driver and check after "NOT FOUND"; DELETE /api/drivers/:id', async () => {
    const createdDriver = await createDriver(app);
    const createdDriverId = createdDriver.data.id;

    await request(app)
      .delete(`${DRIVERS_PATH}/${createdDriverId}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NoContent);

    await request(app)
      .get(`${DRIVERS_PATH}/${createdDriverId}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NotFound);
  });
});
