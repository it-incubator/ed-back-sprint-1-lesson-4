import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { ridesQueryRepository } from '../../repositories/rides.query-repositoty';

export async function getRideHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;

    const ride = await ridesQueryRepository.findByIdOrFail(id);

    const rideOutput = ridesQueryRepository.mapToRideOutputUtil(ride);

    res.send(rideOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
