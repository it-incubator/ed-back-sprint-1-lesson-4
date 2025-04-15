// @ts-ignore
import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { RIDES_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { RideOutput } from '../../../src/rides/routes/output/ride.output';

export async function getRideById(
  app: Express,
  rideId: string,
): Promise<RideOutput> {
  const getResponse = await request(app)
    .get(`${RIDES_PATH}/${rideId}`)
    .set('Authorization', generateBasicAuthToken())
    .expect(HttpStatus.Ok);

  return getResponse.body;
}
