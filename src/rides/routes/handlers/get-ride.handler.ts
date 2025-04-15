import { Request, Response } from 'express';
import { mapToRideOutputUtil } from '../mappers/map-to-ride-output.util';
import { ridesService } from '../../application/rides.service';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function getRideHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;

    const ride = await ridesService.findByIdOrFail(id);

    const rideOutput = mapToRideOutputUtil(ride);

    res.send(rideOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
