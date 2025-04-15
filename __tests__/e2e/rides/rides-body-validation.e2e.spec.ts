// @ts-ignore
import express from 'express';
// @ts-ignore
import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { Currency } from '../../../src/rides/domain/ride';
import { clearDb } from '../../utils/clear-db';
import { createRide } from '../../utils/rides/create-ride';
import { RIDES_PATH } from '../../../src/core/paths/paths';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { ResourceType } from '../../../src/core/types/resource-type';

describe('Rides API body validation check', () => {
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

  it(`❌ should not create ride when incorrect body passed; POST /api/rides'`, async () => {
    await request(app)
      .post('/api/rides')
      .send({})
      .expect(HttpStatus.Unauthorized);

    const invalidDataSet1 = await request(app)
      .post(RIDES_PATH)
      .set('Authorization', generateBasicAuthToken())
      .send({
        data: {
          type: ResourceType.Rides,
          attributes: {
            clientName: '   ', // empty string
            price: 'bla bla', // not a number
            currency: 1, // not a string
            fromAddress: '', // empty string
            toAddress: true, // not a string
            driverId: 'bam', //not a number
          },
        },
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errors).toHaveLength(6);

    const invalidDataSet2 = await request(app)
      .post(RIDES_PATH)
      .set('Authorization', generateBasicAuthToken())
      .send({
        data: {
          type: ResourceType.Rides,
          attributes: {
            clientName: 'LA', // short string
            price: 0, // can not be 0
            currency: 'byn', // not in Currency
            fromAddress: 'street', // short string
            driverId: 0, //can not be 0
            toAddress: 'test address',
          },
        },
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errors).toHaveLength(5);

    const invalidDataSet3 = await request(app)
      .post(RIDES_PATH)
      .set('Authorization', generateBasicAuthToken())
      .send({
        data: {
          type: ResourceType.Rides,
          attributes: {
            driverId: 5000, //driver should exist
            clientName: 'Sam',
            price: 100,
            currency: Currency.USD,
            fromAddress: 'test address',
            toAddress: 'test address',
          },
        },
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errors).toHaveLength(1);

    // check что никто не создался
    const riderListResponse = await request(app)
      .get(RIDES_PATH)
      .set('Authorization', adminToken);

    expect(riderListResponse.body.data).toHaveLength(0);
  });

  it('❌ should not finish ride when ride already been finished; POST /api/rides/:id/actions/finish', async () => {
    const createdRide = await createRide(app);
    const createdRideId = createdRide.data.id;

    await request(app)
      .post(`${RIDES_PATH}/${createdRideId}/actions/finish`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NoContent);

    await request(app)
      .post(`${RIDES_PATH}/${createdRideId}/actions/finish`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.UnprocessableEntity);
  });
});
