import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { mapToRideOutputUtil } from '../mappers/map-to-ride-output.util';
import { RideCreateInput } from '../input/ride-create.input';
import { ridesService } from '../../application/rides.service';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function createRideHandler(
  req: Request<{}, {}, RideCreateInput>,
  res: Response,
) {
  try {
    const createdRideId = await ridesService.create(req.body.data.attributes);

    const createdRide = await ridesService.findByIdOrFail(createdRideId);

    const rideOutput = mapToRideOutputUtil(createdRide);

    res.status(HttpStatus.Created).send(rideOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
