import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { RideCreateInput } from '../input/ride-create.input';
import { ridesService } from '../../application/rides.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { ridesQueryRepository } from '../../repositories/rides.query-repositoty';

export async function createRideHandler(
  req: Request<{}, {}, RideCreateInput>,
  res: Response,
) {
  try {
    const createdRideId = await ridesService.create(req.body.data.attributes);

    const createdRide = await ridesQueryRepository.findById(createdRideId);

    const rideOutput = ridesQueryRepository.mapToRideOutputUtil(createdRide!);

    res.status(HttpStatus.Created).send(rideOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
